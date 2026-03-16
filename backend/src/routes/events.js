import express from "express";

import {
  getEventsController,
  createEventController,
  updateEventController,
  deleteEventController
} from "../controllers/events.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/* ---------------- ROUTES ---------------- */

router.get("/", authenticate, getEventsController);

router.post("/", authenticate, createEventController);

router.put("/:id", authenticate, updateEventController);

router.delete("/:id", authenticate, deleteEventController);

export default router;