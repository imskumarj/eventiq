import prisma from "../config/db.js";
import { generateReportFile } from "../utils/reportGenerator.js";

/* -------- GENERATE REPORT -------- */

export async function generateReport(type, format, user) {

  let data = {};

  if (type === "roi") {
    data = await prisma.sponsorship.findMany({
      include: { sponsor: true, event: true }
    });
  }

  if (type === "event") {
    data = await prisma.event.findMany();
  }

  if (type === "sponsor") {
    data = await prisma.sponsor.findMany({
      include: { sponsorships: true }
    });
  }

  const filePath = await generateReportFile(type, format, data);

  const report = await prisma.report.create({
    data: {
      name: `${type.toUpperCase()} Report`,
      type,
      format,
      fileUrl: filePath,
      userId: user.id // 🔥 IMPORTANT
    },
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