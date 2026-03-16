import prisma from "../config/db.js";

export async function getDashboardAnalytics() {

  const sponsors = await prisma.sponsor.findMany({
    include: {
      events: {
        include: {
          event: true
        }
      }
    }
  });

  const events = await prisma.event.findMany();

  /* ---------------- ROI Ranking ---------------- */

  const roiRanking = sponsors.map((s) => {

    const totalInvestment = s.events.reduce(
      (sum, e) => sum + e.investment,
      0
    );

    const totalRevenue = s.events.reduce(
      (sum, e) => sum + e.event.revenue,
      0
    );

    const roi = totalInvestment === 0
      ? 0
      : ((totalRevenue - totalInvestment) / totalInvestment) * 100;

    return {
      sponsor: s.name,
      roi: Math.round(roi),
      events: s.events.length
    };

  }).sort((a, b) => b.roi - a.roi)
    .slice(0, 5)
    .map((s, index) => ({
      rank: index + 1,
      ...s,
      trend: "up"
    }));


  /* ---------------- Top Events ---------------- */

  const topEvents = events
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5)
    .map(e => ({
      name: e.name,
      score: Math.round(e.engagement),
      revenue: e.revenue,
      attendees: e.attendees
    }));


  /* ---------------- Scatter Data ---------------- */

  const scatterData = events.map(e => ({
    engagement: e.engagement,
    revenue: Math.round(e.revenue / 1000),
    z: e.attendees
  }));


  /* ---------------- YoY Data (example logic) ---------------- */

  const yoyData = [
    { quarter: "Q1", thisYear: 155000, lastYear: 120000 },
    { quarter: "Q2", thisYear: 198000, lastYear: 155000 },
    { quarter: "Q3", thisYear: 237000, lastYear: 180000 },
    { quarter: "Q4", thisYear: 285000, lastYear: 210000 }
  ];


  return {
    roiRanking,
    topEvents,
    scatterData,
    yoyData
  };

}