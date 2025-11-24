import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const minLat = parseFloat(url.searchParams.get('minLat') ?? '-90');
		const minLon = parseFloat(url.searchParams.get('minLon') ?? '-180');
		const maxLat = parseFloat(url.searchParams.get('maxLat') ?? '90');
		const maxLon = parseFloat(url.searchParams.get('maxLon') ?? '180');
		const radius = parseFloat(url.searchParams.get('radius') ?? '500'); // meters
		const minpoints = parseInt(url.searchParams.get('minpoints') ?? '1');

		// Use PostGIS ST_ClusterDBSCAN to cluster points on the DB side.
		// We transform to EPSG:3857 so `eps` (radius) is in meters.
		const rows = await prisma.$queryRaw`
      WITH filtered AS (
        SELECT id, ST_Transform(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), 3857) AS geom3857
        FROM "Report"
        WHERE longitude BETWEEN ${minLon} AND ${maxLon}
          AND latitude BETWEEN ${minLat} AND ${maxLat}
      ),
      clusters AS (
        SELECT id,
               ST_ClusterDBSCAN(geom3857, eps := ${radius}, minpoints := ${minpoints}) OVER () AS cid,
               geom3857
        FROM filtered
      )
      SELECT
        cid,
        ST_Y(ST_Transform(ST_Centroid(ST_Collect(geom3857)), 4326)) AS lat,
        ST_X(ST_Transform(ST_Centroid(ST_Collect(geom3857)), 4326)) AS lon,
        COUNT(*)::int AS count
      FROM clusters
      WHERE cid IS NOT NULL
      GROUP BY cid
      ORDER BY count DESC;
    `;

		return new Response(JSON.stringify({ clusters: rows }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: (err as Error).message }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
