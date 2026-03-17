import prisma from "../config/db.js";
import { generateReportFile } from "../utils/reportGenerator.js";

/* -------- GENERATE REPORT -------- */

export async function generateReport(type, format) {

  const filePath = await generateReportFile(type, format);

  const report = await prisma.report.create({
    data: {
      name: `${type.toUpperCase()} Report`,
      type,
      format,
      fileUrl: filePath,
    },
  });

  return report;
}

/* -------- GET REPORTS -------- */

export async function getReports() {

  return prisma.report.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

}

/* -------- GET SINGLE REPORT -------- */

export async function getReportById(id) {

  return prisma.report.findUnique({
    where: { id },
  });

}