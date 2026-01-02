import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

function getSupabaseClient() {
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Supabase credentials not configured');
	}
	return createClient(supabaseUrl, supabaseAnonKey);
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { deviceId, latitude, longitude, timeOffsetMinutes } = await request.json();

		if (!deviceId || latitude === undefined || longitude === undefined) {
			return error(400, 'Missing required fields: deviceId, latitude, longitude');
		}

		const supabase = getSupabaseClient();

		const now = new Date();
		const actualTime = new Date(now.getTime() - (timeOffsetMinutes || 0) * 60000);

		const { data, error: insertError } = await supabase
			.from('reports')
			.insert({
				device_id: deviceId,
				latitude,
				longitude,
				timestamp: now.toISOString(),
				actual_time: actualTime.toISOString(),
				time_offset_minutes: timeOffsetMinutes || 0
			})
			.select()
			.maybeSingle();

		if (insertError) {
			console.error('Supabase insert error:', insertError);
			return error(500, `Failed to save report: ${insertError.message}`);
		}

		return json({ success: true, report: data }, { status: 201 });
	} catch (err) {
		console.error('Report submission error:', err);
		return error(500, 'Failed to save report');
	}
};
