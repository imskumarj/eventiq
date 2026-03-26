import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/db.js";

/* ---------------- VALIDATION ---------------- */

function validateRow(row) {
  if (!row.name) return "Missing name";
  if (!row.date || isNaN(new Date(row.date))) return "Invalid date";
  return null;
}

/* ---------------- MAIN PROCESS ---------------- */

export async function processCsv(filePath, filename, userId) {
  return new Promise((resolve, reject) => {

    const rows = [];
    const errors = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))

      .on("end", async () => {
        try {

          const validData = [];

          for (const row of rows) {

            const error = validateRow(row);

            if (error) {
              errors.push({
                row,
                error
              });
              continue;
            }

            /* ---- DUPLICATE CHECK ---- */
            const exists = await prisma.event.findFirst({
              where: {
                name: row.name,
                date: new Date(row.date),
                organizerId: userId
              }
            });

            if (exists) {
              errors.push({
                row,
                error: "Duplicate event"
              });
              continue;
            }

            validData.push({
              name: row.name,
              location: row.location || "",
              date: new Date(row.date),
              attendees: Number(row.attendees || 0),
              revenue: Number(row.revenue || 0),
              engagement: 0,
              organizerId: userId
            });
          }

          /* ---- BULK INSERT ---- */
          if (validData.length > 0) {
            await prisma.event.createMany({
              data: validData
            });
          }

          /* ---- LOG ---- */
          const log = await prisma.importLog.create({
            data: {
              filename,
              rows: validData.length,
              status: errors.length > 0 ? "partial" : "success"
            }
          });

          resolve({
            log,
            inserted: validData.length,
            failed: errors.length,
            errors: errors.slice(0, 10) // limit response
          });

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
          fs.unlink(filePath, () => {});
        }

      })

      .on("error", reject);

  });
}

/* ---------------- GET IMPORT LOGS ---------------- */

export async function getImportLogs() {
  return prisma.importLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });
}