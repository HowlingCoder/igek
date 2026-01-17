import 'dotenv/config';
import { spawn } from 'child_process';

const environment = process.argv[2] || 'dev';

if (environment !== 'dev' && environment !== 'prod') {
	console.error(`Error: Invalid environment "${environment}". Use "dev" or "prod".`);
	console.error('Usage: node scripts/migrate.js [dev|prod]');
	process.exit(1);
}

if (environment === 'prod') {
	// Set DATABASE_URL from DATABASE_URL_PROD for production migrations
	if (!process.env.DATABASE_URL_PROD) {
		console.error('Error: DATABASE_URL_PROD is not set in .env file');
		process.exit(1);
	}
	process.env.DATABASE_URL = process.env.DATABASE_URL_PROD;
	
	// Run prisma migrate deploy for production
	const child = spawn('npx', ['prisma', 'migrate', 'deploy'], {
		stdio: 'inherit',
		shell: true
	});

	child.on('exit', (code) => {
		process.exit(code || 0);
	});
} else {
	// Run prisma migrate dev for development
	const child = spawn('npx', ['prisma', 'migrate', 'dev'], {
		stdio: 'inherit',
		shell: true
	});

	child.on('exit', (code) => {
		process.exit(code || 0);
	});
}
