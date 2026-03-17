import express from "express";

import {
  getSponsorsController,
  createSponsorController
} from "../controllers/sponsors.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/* ---------------- ROUTES ---------------- */

router.get("/", authenticate, getSponsorsController);

router.post("/", authenticate, createSponsorController);

export default router;