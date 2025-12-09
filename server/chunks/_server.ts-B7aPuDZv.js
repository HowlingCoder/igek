import { p as prisma } from './prisma-BDFzP59l.js';
import { j as json } from './index-CoD1IJuy.js';
import 'node:path';
import 'node:url';
import '@prisma/client/runtime/client';
import './shared-server-DaWdgxVh.js';
import '@prisma/adapter-pg';

const GET = async ({ url }) => {
  try {
    const params = url.searchParams;
    const cLat = params.get("centerLat");
    const cLon = params.get("centerLon");
    const radiusRaw = params.get("radius");
    if (!cLat || !cLon) {
      return json(
        { error: "Missing required parameters: centerLat and centerLon" },
        { status: 400 }
      );
    }
    const centerLat = Number(cLat);
    const centerLon = Number(cLon);
    if (Number.isNaN(centerLat) || Number.isNaN(centerLon)) {
      return json({ error: "Invalid numeric parameters" }, { status: 400 });
    }
    const radiusMeters = radiusRaw ? Number(radiusRaw) : 2e3;
    if (Number.isNaN(radiusMeters) || radiusMeters <= 0) {
      return json({ error: "Invalid radius parameter" }, { status: 400 });
    }
    const MERGE_METERS = 135;
    const rows = await prisma.$queryRaw`
			WITH candidates AS (
				SELECT
					"id",
					"deviceId",
					COALESCE(location, ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326)::geography) AS geog,
					(COALESCE(location, ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326)::geography))::geometry AS geom
				FROM "Report"
				WHERE ST_DWithin(
					COALESCE(location, ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326)::geography),
					ST_SetSRID(ST_MakePoint(${centerLon}, ${centerLat}), 4326)::geography,
					${radiusMeters}
				)
			),
			clustered AS (
				SELECT
					*,
					ST_ClusterDBSCAN(ST_Transform(geom, 3857), eps := ${MERGE_METERS}, minpoints := 1) OVER () AS cluster_id
				FROM candidates
			)
			SELECT
				ST_AsGeoJSON(ST_Centroid(ST_Collect(geog::geometry)))::json AS geometry,
				COUNT(*)::int AS count,
				json_agg("id") AS ids,
				json_agg("deviceId") AS deviceIds
			FROM clustered
			GROUP BY cluster_id;
		`;
    const parseJsonField = (v) => {
      if (v == null) return [];
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch {
          return [];
        }
      }
      return v;
    };
    const features = (rows || []).map((r) => ({
      type: "Feature",
      geometry: r.geometry,
      properties: {
        count: Number(r.count) || 0,
        ids: parseJsonField(r.ids),
        deviceIds: parseJsonField(r.deviceids ?? r.deviceIds)
      }
    }));
    return json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error("Error in /api/clusters GET", err);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-B7aPuDZv.js.map
