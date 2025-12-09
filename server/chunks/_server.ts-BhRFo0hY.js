import { p as prisma } from './prisma-BDFzP59l.js';
import { j as json } from './index-CoD1IJuy.js';
import 'node:path';
import 'node:url';
import '@prisma/client/runtime/client';
import './shared-server-DaWdgxVh.js';
import '@prisma/adapter-pg';

const GET = async ({ url }) => {
  const raw = url.searchParams.get("detail");
  let detail = 1;
  if (raw !== null) {
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n >= 0 && n <= 6) {
      detail = n;
    }
  }
  const clusters = await prisma.$queryRaw`
    SELECT
      ROUND(latitude::numeric, ${detail}) AS lat_bin,
      ROUND(longitude::numeric, ${detail}) AS lon_bin,
      COUNT(*) AS count
    FROM "Report"
    GROUP BY lat_bin, lon_bin
    ORDER BY count DESC;
  `;
  return json(
    clusters.map((c) => ({
      lat: Number(c.lat_bin),
      lon: Number(c.lon_bin),
      count: Number(c.count)
    }))
  );
};
const POST = async ({ request }) => {
  try {
    const { deviceId, latitude, longitude } = await request.json();
    const report = await prisma.report.create({
      data: {
        deviceId,
        latitude,
        longitude,
        timestamp: /* @__PURE__ */ new Date()
      }
    });
    return new Response(JSON.stringify(report), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to save report" }), { status: 500 });
  }
};

export { GET, POST };
//# sourceMappingURL=_server.ts-BhRFo0hY.js.map
