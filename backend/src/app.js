import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import eventsRoutes from "./routes/events.js";
import sponsorsRoutes from "./routes/sponsors.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;