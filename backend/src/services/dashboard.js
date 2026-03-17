import prisma from "../config/db.js";

/* ---------------- DASHBOARD DATA ---------------- */

export async function getDashboardData() {

  /* -------- KPIs -------- */

  const totalEvents = await prisma.event.count();

  const totalSponsors = await prisma.sponsor.count();

  const totalRevenueAgg = await prisma.event.aggregate({
    _sum: { revenue: true }
  });

  const totalRevenue = totalRevenueAgg._sum.revenue || 0;

  /* -------- ROI -------- */

  const sponsorships = await prisma.sponsorship.findMany();

  let totalROI = 0;

  sponsorships.forEach((s) => {
    if (s.investment > 0) {
      totalROI += (s.leads * 1000) / s.investment;
    }
  });

  const avgROI =
    sponsorships.length > 0
      ? Math.round(totalROI / sponsorships.length)
      : 0;

  /* -------- Revenue Trend (Monthly) -------- */

  const events = await prisma.event.findMany();

  const revenueMap = {};

  events.forEach((e) => {
    const month = new Date(e.date).toLocaleString("default", {
      month: "short"
    });

    if (!revenueMap[month]) {
      revenueMap[month] = 0;
    }

    revenueMap[month] += e.revenue;
  });

  const revenueData = Object.entries(revenueMap).map(
    ([month, revenue]) => ({
      month,
      revenue
    })
  );

  /* -------- ROI Per Sponsor -------- */

  const roiData = await prisma.sponsorship.findMany({
    include: { sponsor: true }
  });

  const roiFormatted = roiData.map((s) => ({
    sponsor: s.sponsor.name,
    roi:
      s.investment > 0
        ? Math.round((s.leads * 1000) / s.investment)
        : 0
  }));

  return {
    kpis: {
      totalEvents,
      totalSponsors,
      totalRevenue,
      avgROI
    },
    revenueData,
    roiData: roiFormatted
  };
}