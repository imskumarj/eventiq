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