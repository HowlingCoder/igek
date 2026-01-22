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

	const response = await resolve(event);

	// Add cache control headers to prevent caching of older versions
	// HTML pages should not be cached to ensure users get the latest version
	if (response.headers.get('content-type')?.includes('text/html')) {
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');
	}
	// For JS/CSS assets, SvelteKit already uses content hashing, so we can cache longer
	// but still add version headers for debugging
	else if (response.headers.get('content-type')?.includes('application/javascript') ||
	         response.headers.get('content-type')?.includes('text/css')) {
		// Assets are already versioned by SvelteKit via build hashes
		// Set a reasonable cache time, but allow revalidation
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}

	return response;
};
