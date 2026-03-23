import express from "express";

import {
  getEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController
} from "../controllers/events.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/* ---------------- ROUTES ---------------- */

router.get("/", authenticate, getEventsController);

router.get("/:id", authenticate, getEventByIdController);

router.post("/", authenticate, createEventController);

router.put("/:id", authenticate, updateEventController);

router.delete("/:id", authenticate, deleteEventController);

export default router;