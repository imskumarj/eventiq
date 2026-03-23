import prisma from "../config/db.js";

/* ---------------- DASHBOARD DATA ---------------- */

export async function getDashboardData(user) {

  /* ---------------- ROLE FILTERS ---------------- */

  let eventFilter = {};
  let sponsorshipFilter = {};

  if (user.role === "organizer") {
    eventFilter = { organizerId: user.id };
    sponsorshipFilter = {
      event: { organizerId: user.id }
    };
  }

  if (user.role === "sponsor") {
    eventFilter = {
      sponsors: {
        some: {
          sponsor: {
            userId: user.id
          }
        }
      }
    };

    sponsorshipFilter = {
      sponsor: {
        userId: user.id
      }
    };
  }

  /* ---------------- EVENTS ---------------- */

  const events = await prisma.event.findMany({
    where: eventFilter
  });

  const totalEvents = events.length;

  /* ---------------- SPONSORS ---------------- */

  let totalSponsors = 0;

  if (user.role === "admin") {
    totalSponsors = await prisma.sponsor.count();
  }

  if (user.role === "organizer") {
    const sponsorships = await prisma.sponsorship.findMany({
      where: {
        event: { organizerId: user.id }
      },
      select: { sponsorId: true }
    });

    const uniqueSponsors = new Set(
      sponsorships.map((s) => s.sponsorId)
    );

    totalSponsors = uniqueSponsors.size;
  }

  if (user.role === "sponsor") {
    totalSponsors = 1;
  }

  /* ---------------- REVENUE ---------------- */

  const totalRevenue = events.reduce(
    (sum, e) => sum + (e.revenue || 0),
    0
  );

  /* ---------------- ROI ---------------- */

  const sponsorships = await prisma.sponsorship.findMany({
    where: sponsorshipFilter
  });

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

  /* ---------------- REVENUE TREND ---------------- */

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

  /* ---------------- ROI PER SPONSOR ---------------- */

  const roiDataRaw = await prisma.sponsorship.findMany({
    where: sponsorshipFilter,
    include: { sponsor: true }
  });

  const roiData = roiDataRaw.map((s) => ({
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
    roiData
  };
}