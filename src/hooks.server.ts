import { verifyDatabaseConnection } from '$lib/services/database-guard';
import type { Handle } from '@sveltejs/kit';

const dev = process.env.NODE_ENV === 'development';

// Check database connection on server startup
let startupCheckDone = false;

async function performStartupCheck() {
	if (startupCheckDone) return;
	startupCheckDone = true;

	try {
		const isConnected = await verifyDatabaseConnection(true);
		if (!isConnected) {
			console.error('⚠️  Database connection check failed on startup');
			console.error('   Make sure the SSH tunnel is running: npm run tunnel');
		} else {
			console.log('✅ Database connection verified');
		}
	} catch (error) {
		console.error('⚠️  Error during database connection check:', error);
	}
}

// In development, check on first request to avoid blocking startup
let firstRequest = true;

export const handle: Handle = async ({ event, resolve }) => {
	if (dev && firstRequest) {
		firstRequest = false;
		// Non-blocking check on first request in dev
		performStartupCheck().catch(() => {
			// Error already logged in performStartupCheck
		});
	}

	return resolve(event);
};
