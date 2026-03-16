import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getAnalyticsDashboard
} from "../controllers/analytics.js";

const router = express.Router();

router.get("/dashboard", authenticate, getAnalyticsDashboard);

export default router;