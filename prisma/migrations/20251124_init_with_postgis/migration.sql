-- Combined migration: create Report table and enable PostGIS
-- This migration is idempotent and safe to run on a new database.

-- Enable PostGIS extension (requires privileges on target DB)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Report table (keep latitude/longitude for compatibility)
CREATE TABLE IF NOT EXISTS "Report" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "location" geography(Point,4326),
    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- Populate `location` column from existing latitude/longitude if any
UPDATE "Report"
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create spatial GIST index for fast spatial queries
CREATE INDEX IF NOT EXISTS reports_location_gist ON "Report" USING GIST(location);
