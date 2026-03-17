import express from "express";

import {
  generateReportController,
  getReportsController,
  downloadReportController
} from "../controllers/reports.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate", authenticate, generateReportController);

router.get("/", authenticate, getReportsController);

router.get("/:id/download", authenticate, downloadReportController);

export default router;