import prisma from "../config/db.js";
import { generateReportFile } from "../utils/reportGenerator.js";

/* -------- GENERATE REPORT -------- */

export async function generateReport(type, format, user) {

  let data = [];

  if (type === "roi") {
    const rows = await prisma.sponsorship.findMany({
      include: { sponsor: true, event: true }
    });

    data = rows.map(r => ({
      sponsor: r.sponsor.name,
      event: r.event.name,
      investment: r.amount,
      revenue: r.revenue || 0,
      roi: ((r.revenue || 0) - r.amount)
    }));
  }

  if (type === "event") {
    const rows = await prisma.event.findMany();

    data = rows.map(e => ({
      name: e.name,
      location: e.location,
      date: e.date,
      attendees: e.attendees,
      revenue: e.revenue
    }));
  }

  if (type === "sponsor") {
    const rows = await prisma.sponsor.findMany({
      include: { sponsorships: true }
    });

    data = rows.map(s => ({
      name: s.name,
      totalDeals: s.sponsorships.length,
      totalInvestment: s.sponsorships.reduce((a, b) => a + b.amount, 0)
    }));
  }

  if (type === "custom") {
    const rows = await prisma.event.findMany();

    data = rows.map(e => ({
      name: e.name,
      attendees: e.attendees,
      revenue: e.revenue,
      revenuePerUser: e.revenue / (e.attendees || 1)
    }));
  }

  const filePath = await generateReportFile(type, format, data);

  const report = await prisma.report.create({
    data: {
      name: `${type.toUpperCase()} Report`,
      type,
      format,
      fileUrl: filePath,
      userId: user.id
    }
  });

  return report;
}

/* -------- GET REPORTS -------- */

export async function getReports(user) {

  if (user.role === "admin") {
    return prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  return prisma.report.findMany({
    where: {
      userId: user.id // 👈 IMPORTANT (we’ll add this field)
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}

/* -------- GET SINGLE REPORT -------- */

export async function getReportById(id) {

  return prisma.report.findUnique({
    where: { id },
  });

}