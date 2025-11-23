// ...existing code...
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

// generate a random point within a radius (meters) around a center lat/lon
function randomPointAround(lat: number, lon: number, radiusMeters: number) {
    // Convert meters to degrees
    const metersPerDegLat = 111_111; // approx
    const metersPerDegLon = Math.cos((lat * Math.PI) / 180) * 111_111;
    // random distance and angle for uniform distribution in circle
    const r = Math.sqrt(Math.random()) * radiusMeters;
    const theta = randomInRange(0, 2 * Math.PI);
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    const dLat = dy / metersPerDegLat;
    const dLon = dx / metersPerDegLon;
    return { latitude: lat + dLat, longitude: lon + dLon };
}

async function main() {
    console.log('Seeding reports...');

    const countEnv = process.env.SEED_COUNT;
    const argCount = process.argv[2];
    const count = parseInt(countEnv ?? argCount ?? '10000', 10) || 100;

    const radiusEnv = process.env.SEED_RADIUS_METERS;
    const radiusMeters = parseInt(radiusEnv ?? '5000', 10) || 5000;

    // Frankfurt center
    const centerLat = 50.110924;
    const centerLon = 8.682127;

    const now = Date.now();
    const dayMs = 24 * 3600 * 1000;

    const data = Array.from({ length: count }).map((_, i) => {
        const { latitude, longitude } = randomPointAround(centerLat, centerLon, radiusMeters);
        const offset = (Math.random() * 2 - 1) * dayMs; // -24h .. +24h
        const timestamp = new Date(now + offset);
        const deviceId = `device-${String(i + 1).padStart(3, '0')}`;
        return {
            deviceId,
            timestamp,
            latitude,
            longitude
        };
    });

    // createMany (skipDuplicates if supported)
    await prisma.report.createMany({
        data,
        skipDuplicates: true
    });

    console.log(`Seeding finished. Created ${data.length} reports around Frankfurt (±${radiusMeters} m) within ±24h.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });