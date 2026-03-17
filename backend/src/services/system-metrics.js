import prisma from "../config/db.js";

/* ---------------- MAIN METRICS ---------------- */

export async function getSystemMetrics() {

  /* -------- DB Health -------- */

  const start = Date.now();

  await prisma.$queryRaw`SELECT 1`;

  const dbLatency = Date.now() - start;

  /* -------- Mock / Derived Metrics -------- */

  const apiRequests = Math.floor(Math.random() * 15000) + 5000;

  const errorRate = Number((Math.random() * 1).toFixed(2));

  const avgResponseTime = Math.floor(Math.random() * 100) + 100;

  /* -------- Traffic Graph -------- */

  const traffic = Array.from({ length: 7 }).map((_, i) => ({
    hour: `${i * 4}`,
    requests: Math.floor(Math.random() * 600)
  }));

  /* -------- Error Graph -------- */

  const errors = Array.from({ length: 7 }).map((_, i) => ({
    hour: `${i * 4}`,
    rate: Number((Math.random() * 1.5).toFixed(2))
  }));

  return {
    kpis: {
      apiRequests,
      dbConnections: dbLatency,
      errorRate,
      avgResponseTime
    },
    traffic,
    errors
  };
}