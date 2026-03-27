import prisma from "../config/db.js";

/* ---------------- GET SPONSORS ---------------- */

export async function getSponsors({ search, user }) {

  /* ---------------- ROLE FILTER ---------------- */

  let where = {};

  if (user.role === "organizer") {
    where = {
      event: {
        organizerId: user.id
      }
    };
  }

  if (user.role === "sponsor") {
    where = {
      sponsor: {
        userId: user.id
      }
    };
  }

  // admin → no filter (sees all)

  /* ---------------- FETCH ---------------- */

  const sponsorships = await prisma.sponsorship.findMany({
    where,
    include: {
      sponsor: true,
      event: true
    },
    orderBy: {
      id: "desc"
    }
  });

  /* ---------------- FORMAT ---------------- */

  let data = sponsorships.map((s) => {

    const revenue = s.leads * 1000;

    const roi =
      s.investment > 0
        ? ((revenue - s.investment) / s.investment) * 100
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

  /* ---------------- SEARCH ---------------- */

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

  const { name, email, eventId, amount } = data;

  /* -------- 1. CHECK USER -------- */

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("User not registered");
  }

  if (user.role !== "sponsor") {
    throw new Error("User is not registered as sponsor");
  }

  /* -------- 2. CHECK IF ALREADY LINKED -------- */

  let sponsor = await prisma.sponsor.findUnique({
    where: { userId: user.id }
  });

  /* -------- 3. CREATE SPONSOR IF NOT EXISTS -------- */

  if (!sponsor) {
    sponsor = await prisma.sponsor.create({
      data: {
        name,
        userId: user.id
      }
    });
  }

  /* -------- 4. VALIDATE EVENT -------- */

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    throw new Error("Invalid event ID");
  }

  /* -------- 5. CREATE SPONSORSHIP -------- */

  const sponsorship = await prisma.sponsorship.create({
    data: {
      sponsorId: sponsor.id,
      eventId,
      investment: Number(amount),
      boothVisits: 0,
      leads: 0
    }
  });

  return {
    success: true,
    data: {
      sponsor,
      sponsorship
    }
  };
}