import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/db.js";

export async function processCsv(filePath, filename, userId) {
  return new Promise((resolve, reject) => {

    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))

      .on("end", async () => {
        try {

          const validRows = rows
            .filter(r => r.name && r.date)
            .map(r => ({
              name: r.name,
              location: r.location || "",
              date: new Date(r.date),
              attendees: Number(r.attendees || 0),
              revenue: Number(r.revenue || 0),
              engagement: 0,
              organizerId: userId
            }));

          if (validRows.length > 0) {
            await prisma.event.createMany({
              data: validRows
            });
          }

          const log = await prisma.importLog.create({
            data: {
              filename,
              rows: validRows.length,
              status: "success"
            }
          });

          resolve(log);

        } catch (error) {

          await prisma.importLog.create({
            data: {
              filename,
              rows: 0,
              status: "error"
            }
          });

          reject(error);

        } finally {
          fs.unlink(filePath, () => {}); // ✅ delete file
        }

      })

      .on("error", reject);

  });
}

export async function getImportLogs() {

  return prisma.importLog.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 20
  });

}