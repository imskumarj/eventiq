import express from "express";
import { getSystemMetricsController } from "../controllers/system-metrics.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getSystemMetricsController);

export default router;