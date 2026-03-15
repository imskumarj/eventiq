import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"]
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default prisma;