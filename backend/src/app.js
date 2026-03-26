import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { config } from "./config/env.js";

import authRoutes from "./routes/auth.js";
import eventsRoutes from "./routes/events.js";
import sponsorsRoutes from "./routes/sponsors.js";
import analyticsRoutes from "./routes/analytics.js";
import ingestionRoutes from "./routes/ingestion.js";
import reportsRoutes from "./routes/reports.js";
import systemMetricsRoutes from "./routes/system-metrics.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

/*
 SECURITY
*/

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimitMax,
  message: "Too many requests, please try again later."
});

app.use(limiter);

/*
 CORS
*/

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
);

/*
 LOGGING
*/

app.use(morgan("dev"));

/*
 BODY PARSER
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 HEALTH CHECK
*/

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "eventiq-backend",
    timestamp: new Date().toISOString()
  });
});

/*
 API ROUTES
*/

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/data-ingestion", ingestionRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/system-metrics", systemMetricsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/reports", express.static("reports"));

/*
 404 HANDLER
*/

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

/*
 GLOBAL ERROR HANDLER
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

export default app;