import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { deviceId, latitude, longitude, timeOffsetMinutes, loudness } = await request.json();

		if (!deviceId || latitude === undefined || longitude === undefined) {
			return error(400, 'Missing required fields: deviceId, latitude, longitude');
		}

		// Calculate actual timestamp based on timeOffsetMinutes
		// The timestamp field will store when the bang actually occurred
		const now = new Date();
		const actualTime = new Date(now.getTime() - (timeOffsetMinutes || 0) * 60000);

		// Create report using Prisma with Raw SQL to set the location geography field
		// Prisma doesn't support geography types directly, so we use Raw SQL
		const result = await prisma.$queryRaw<Array<{ id: number; deviceId: string; timestamp: Date; latitude: number; longitude: number; loudness: number | null }>>`
			INSERT INTO "Report" ("deviceId", latitude, longitude, timestamp, location, loudness)
			VALUES (${deviceId}, ${latitude}, ${longitude}, ${actualTime}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${loudness ?? null})
			RETURNING id, "deviceId", timestamp, latitude, longitude, loudness
		`;

		if (!result || result.length === 0) {
			return error(500, 'Failed to save report');
		}

		const report = result[0];

		return json({ success: true, report }, { status: 201 });
	} catch (err) {
		console.error('Report submission error:', err);
		return error(500, 'Failed to save report');
	}
};
