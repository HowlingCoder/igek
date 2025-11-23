import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	    // default: 1 decimal (≈ ~1 km)
    const raw = url.searchParams.get('detail');
    let detail = 1;
    if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n >= 0 && n <= 6) {
            detail = n;
        }
    }

    // Use parameterized query so `decimals` is passed safely.
    const clusters = await prisma.$queryRaw`
    SELECT
      ROUND(latitude::numeric, ${detail}) AS lat_bin,
      ROUND(longitude::numeric, ${detail}) AS lon_bin,
      COUNT(*) AS count
    FROM "Report"
    GROUP BY lat_bin, lon_bin
    ORDER BY count DESC;
  `;


	// Format für Frontend
	return json(
		clusters.map((c: any) => ({
			lat: Number(c.lat_bin),
			lon: Number(c.lon_bin),
			count: Number(c.count)
		}))
	);
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { deviceId, latitude, longitude } = await request.json();

		const report = await prisma.report.create({
			data: {
				deviceId,
				latitude,
				longitude,
				timestamp: new Date()
			}
		});

		return new Response(JSON.stringify(report), { status: 201 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Failed to save report' }), { status: 500 });
	}
};
