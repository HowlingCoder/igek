import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '$env/dynamic/private';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = env.DATABASE_URL ?? process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not set. Add it to .env or set the environment variable before starting the app.'
    );
}

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

export default prisma;
