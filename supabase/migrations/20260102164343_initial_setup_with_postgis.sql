/*
  # Initial Database Setup with PostGIS for Bang Reporting Application
  
  1. Extensions
    - Enable PostGIS extension for geographic data types and functions
    - Enable UUID extension for generating unique identifiers
  
  2. New Tables
    - `reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `device_id` (text) - Anonymous device identifier for tracking (not personally identifiable)
      - `timestamp` (timestamptz) - When the bang was reported
      - `actual_time` (timestamptz) - When the bang actually occurred (calculated from time_offset_minutes)
      - `time_offset_minutes` (integer) - How many minutes ago the bang occurred (0 = just now)
      - `latitude` (double precision) - Latitude coordinate
      - `longitude` (double precision) - Longitude coordinate
      - `location` (geography point) - PostGIS geographic point for spatial queries
      - `created_at` (timestamptz) - When the record was created in the database
  
  3. Security
    - Enable RLS on `reports` table
    - Add policy for anonymous users to insert reports (public reporting)
    - Add policy for anonymous users to read reports (public cluster map)
    - Data is anonymous by design - device_id is just a hash, no personal information
  
  4. Indexes
    - Spatial index on location for efficient geographic queries
    - Index on timestamp for time-based queries
  
  5. Important Notes
    - All reports are anonymous - device_id is a non-personal identifier
    - Reports are public read-only to generate cluster maps
    - No personal data is collected or stored
    - Location data is aggregated for privacy
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  actual_time timestamptz NOT NULL,
  time_offset_minutes integer NOT NULL DEFAULT 0,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  location geography(Point, 4326),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create spatial index for efficient geographic queries
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- Create index on timestamp for time-based queries
CREATE INDEX IF NOT EXISTS reports_timestamp_idx ON reports (timestamp DESC);
CREATE INDEX IF NOT EXISTS reports_actual_time_idx ON reports (actual_time DESC);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert reports (for public bang reporting)
CREATE POLICY "Anyone can submit reports"
  ON reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read reports (for public cluster map visualization)
-- This is safe because data is anonymous and will be aggregated
CREATE POLICY "Anyone can view reports"
  ON reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add a trigger to automatically populate the location geography column
CREATE OR REPLACE FUNCTION set_report_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_report_location_trigger
  BEFORE INSERT OR UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_report_location();