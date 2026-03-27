import express from "express";

import {
  getSponsorsController,
  createSponsorController,
  updateLeads
} from "../controllers/sponsors.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/* ---------------- ROUTES ---------------- */

router.get("/", authenticate, getSponsorsController);

router.post("/", authenticate, createSponsorController);

router.patch("/:id/leads", authenticate, updateLeads);

export default router;