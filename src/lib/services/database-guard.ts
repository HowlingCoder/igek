import prisma from '$lib/prisma';

let connectionStatus: 'unknown' | 'checking' | 'connected' | 'error' = 'unknown';
let lastCheck: number = 0;
const CHECK_INTERVAL = 60000; // Check every 60 seconds
let checkPromise: Promise<boolean> | null = null;

/**
 * Checks if the database is reachable
 * Uses a simple query to test the connection
 */
async function checkConnection(): Promise<boolean> {
	try {
		// Simple query to test connection (PostgreSQL-specific)
		await prisma.$queryRaw`SELECT 1`;
		return true;
	} catch (error) {
		console.error('Database connection check failed:', error);
		return false;
	}
}

/**
 * Checks database connection with caching
 * Only checks if last check was more than CHECK_INTERVAL ago
 * or if status is unknown/error
 */
async function checkDatabaseConnection(force: boolean = false): Promise<boolean> {
	const now = Date.now();
	const needsCheck =
		force ||
		connectionStatus === 'unknown' ||
		connectionStatus === 'error' ||
		now - lastCheck > CHECK_INTERVAL;

	if (!needsCheck && connectionStatus === 'connected') {
		return true;
	}

	// If a check is already in progress, return that promise
	if (checkPromise) {
		return checkPromise;
	}

	connectionStatus = 'checking';
	checkPromise = checkConnection()
		.then((isConnected) => {
			connectionStatus = isConnected ? 'connected' : 'error';
			lastCheck = Date.now();
			checkPromise = null;
			return isConnected;
		})
		.catch(() => {
			connectionStatus = 'error';
			lastCheck = Date.now();
			checkPromise = null;
			return false;
		});

	return checkPromise;
}

/**
 * Gets the current connection status without triggering a check
 */
export function getConnectionStatus(): 'unknown' | 'checking' | 'connected' | 'error' {
	return connectionStatus;
}

/**
 * Checks database connection (called on app startup)
 * This should be called in hooks.server.ts or +layout.ts
 */
export async function verifyDatabaseConnection(force: boolean = false): Promise<boolean> {
	return await checkDatabaseConnection(force);
}

/**
 * Gets a user-friendly error message based on connection status
 */
export function getConnectionErrorMessage(): string | null {
	if (connectionStatus === 'connected' || connectionStatus === 'checking') {
		return null;
	}

	return 'Die Datenbankverbindung konnte nicht hergestellt werden. Bitte überprüfen Sie:\n' +
		'- Ob der SSH-Tunnel aktiv ist (npm run tunnel)\n' +
		'- Ob die Datenbank läuft\n' +
		'- Ob die DATABASE_URL korrekt konfiguriert ist';
}
