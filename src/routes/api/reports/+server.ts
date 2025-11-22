import  prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

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
