import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Missing required env variable: ${env}`);
    process.exit(1);
  }
});

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
  nodeEnv: process.env.NODE_ENV || "development"
};