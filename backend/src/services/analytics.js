import prisma from "../config/db.js";

export async function getDashboardAnalytics(user) {

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";
  const isSponsor = user.role === "sponsor";

  /* ---------------- FILTER EVENTS ---------------- */

  let eventFilter = {};

  if (isOrganizer) {
    eventFilter.organizerId = user.id;
  }

  if (isSponsor) {
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId: user.id }
    });

    const sponsorships = await prisma.sponsorship.findMany({
      where: { sponsorId: sponsor?.id },
      select: { eventId: true }
    });

    const eventIds = sponsorships.map(s => s.eventId);

    eventFilter.id = { in: eventIds };
  }

  const events = await prisma.event.findMany({
    where: eventFilter
  });

  /* ---------------- FILTER SPONSORSHIPS ---------------- */

  let sponsorshipFilter = {};

  if (isOrganizer) {
    sponsorshipFilter.event = {
      organizerId: user.id
    };
  }

  if (isSponsor) {
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId: user.id }
    });

    sponsorshipFilter.sponsorId = sponsor?.id;
  }

  const sponsorships = await prisma.sponsorship.findMany({
    where: sponsorshipFilter,
    include: {
      sponsor: true,
      event: true
    }
  });

  /* ---------------- ROI RANKING ---------------- */

  const sponsorMap = {};

  sponsorships.forEach((s) => {
    if (!sponsorMap[s.sponsorId]) {
      sponsorMap[s.sponsorId] = {
        sponsor: s.sponsor.name,
        investment: 0,
        leads: 0,
        events: new Set()
      };
    }

    sponsorMap[s.sponsorId].investment += s.investment;
    sponsorMap[s.sponsorId].leads += s.leads;
    sponsorMap[s.sponsorId].events.add(s.eventId);
  });

  const roiRanking = Object.values(sponsorMap)
    .map((s) => {
      const roi =
        s.investment > 0
          ? ((s.leads * 1000) / s.investment) * 100
          : 0;

      return {
        sponsor: s.sponsor,
        roi: Math.round(roi),
        events: s.events.size
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5)
    .map((s, index) => ({
      rank: index + 1,
      ...s,
      trend: "up"
    }));

  /* ---------------- TOP EVENTS ---------------- */

  const topEvents = events
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5)
    .map(e => ({
      name: e.name,
      score: Math.round(e.engagement),
      revenue: e.revenue,
      attendees: e.attendees
    }));

  /* ---------------- SCATTER ---------------- */

  const scatterData = events.map(e => ({
    engagement: e.engagement,
    revenue: Math.round(e.revenue / 1000),
    z: e.attendees
  }));

  /* ---------------- YOY (DYNAMIC VERSION) ---------------- */

  const yoyMap = {};

  events.forEach((e) => {
    const date = new Date(e.date);
    const year = date.getFullYear();
    const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;

    if (!yoyMap[quarter]) {
      yoyMap[quarter] = { thisYear: 0, lastYear: 0 };
    }

    if (year === new Date().getFullYear()) {
      yoyMap[quarter].thisYear += e.revenue;
    } else {
      yoyMap[quarter].lastYear += e.revenue;
    }
  });

  const yoyData = Object.entries(yoyMap).map(([quarter, val]) => ({
    quarter,
    ...val
  }));

  return {
    roiRanking,
    topEvents,
    scatterData,
    yoyData
  };
}