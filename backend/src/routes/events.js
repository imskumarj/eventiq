import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  res.json({ message: "Events list" });
});

router.post("/", authenticate, authorize("admin", "organizer"), async (req, res) => {
  res.json({ message: "Event created" });
});

export default route