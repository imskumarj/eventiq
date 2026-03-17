import prisma from "../config/db.js";

/* ---------------- GET SPONSORS ---------------- */

export async function getSponsors({ search }) {

  const sponsorships = await prisma.sponsorship.findMany({
    include: {
      sponsor: true,
      event: true
    },
    orderBy: {
      id: "desc"
    }
  });

  let data = sponsorships.map((s) => {

    const roi =
      s.investment > 0
        ? ((s.leads * 1000) / s.investment) * 100
        : 0;

    return {
      id: s.id,
      name: s.sponsor.name,
      event: s.event.name,
      amount: s.investment,
      boothVisits: s.boothVisits,
      leads: s.leads,
      roi: Math.round(roi),

      status:
        s.leads > 100
          ? "Active"
          : s.leads > 50
          ? "Pending"
          : "Completed"
    };
  });

  /* -------- Search Filter -------- */

  if (search) {
    data = data.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.event.toLowerCase().includes(search.toLowerCase())
    );
  }

  return data;
}

/* ---------------- CREATE SPONSOR ---------------- */

export async function createSponsor(data) {

  const sponsor = await prisma.sponsor.create({
    data: {
      name: data.name
    }
  });

  const sponsorship = await prisma.sponsorship.create({
    data: {
      sponsorId: sponsor.id,
      eventId: data.eventId,
      investment: Number(data.amount),
      boothVisits: 0,
      leads: 0
    }
  });

  return { sponsor, sponsorship };
}