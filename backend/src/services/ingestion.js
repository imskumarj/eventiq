import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/db.js";

export async function processCsv(filePath, filename) {
  return new Promise((resolve, reject) => {

    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        rows.push(data);
      })

      .on("end", async () => {
        try {

          const rowCount = rows.length;

          // Example: insert events if columns exist
          for (const row of rows) {

            if (row.name && row.date) {

              await prisma.event.create({
                data: {
                  name: row.name,
                  location: row.location || "",
                  date: new Date(row.date),
                  attendees: Number(row.attendees || 0),
                  revenue: Number(row.revenue || 0)
                }
              });

            }

          }

          const log = await prisma.importLog.create({
            data: {
              filename,
              rows: rowCount,
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