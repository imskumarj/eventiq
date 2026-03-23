import prisma from "../config/db.js";

/* ---------------- GET EVENTS ---------------- */

export async function getEvents({ search, page = 1, limit = 10, user }) {

  const skip = (page - 1) * limit;

  /* ---------------- ROLE-BASED FILTER ---------------- */

  let roleFilter = {};

  if (user.role === "admin") {
    roleFilter = {}; // no restriction
  }

  if (user.role === "organizer") {
    roleFilter = {
      organizerId: user.id
    };
  }

  if (user.role === "sponsor") {
    roleFilter = {
      sponsors: {
        some: {
          sponsor: {
            userId: user.id
          }
        }
      }
    };
  }

  /* ---------------- SEARCH FILTER ---------------- */

  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } }
        ]
      }
    : {};

  /* ---------------- FINAL WHERE ---------------- */

  const where = {
    AND: [
      roleFilter,
      searchFilter
    ]
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),

    prisma.event.count({ where })
  ]);

  return {
    events,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}

/* ---------------- GET EVENT BY ID ---------------- */

export async function getEventById(id, user) {

  /* -------- FETCH EVENT WITH RELATIONS -------- */

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      sponsors: {
        include: {
          sponsor: true
        }
      }
    }
  });

  if (!event) {
    throw new Error("Event not found");
  }

  /* ---------------- RBAC CHECK ---------------- */

  if (user.role === "organizer") {
    if (event.organizerId !== user.id) {
      throw new Error("Unauthorized access");
    }
  }

  if (user.role === "sponsor") {
    const isLinked = event.sponsors.some(
      (s) => s.sponsor.userId === user.id
    );

    if (!isLinked) {
      throw new Error("Unauthorized access");
    }
  }

  /* ---------------- FORMAT SPONSORS ---------------- */

  const sponsors = event.sponsors.map((s) => {

    const roi =
      s.investment > 0
        ? Math.round((s.leads * 1000) / s.investment)
        : 0;

    return {
      id: s.id,
      name: s.sponsor.name,
      investment: s.investment,
      boothVisits: s.boothVisits,
      leads: s.leads,
      roi
    };
  });

  /* ---------------- RETURN CLEAN DATA ---------------- */

  return {
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    revenue: event.revenue,
    attendees: event.attendees,
    engagement: event.engagement,

    organizer: event.organizer,

    sponsors
  };
}

/* ---------------- CREATE EVENT ---------------- */

export async function createEvent(data, userId) {

  const event = await prisma.event.create({
    data: {
      name: data.name,
      date: new Date(data.date),
      location: data.location,
      attendees: Number(data.attendees),
      revenue: Number(data.revenue),

      engagement: 0, // calculated later

      organizerId: userId
    }
  });

  return event;
}

/* ---------------- UPDATE EVENT ---------------- */

export async function updateEvent(id, data) {

  return prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      date: new Date(data.date),
      location: data.location,
      attendees: Number(data.attendees),
      revenue: Number(data.revenue)
    }
  });

}

/* ---------------- DELETE EVENT ---------------- */

export async function deleteEvent(id) {

  return prisma.event.delete({
    where: { id }
  });

}