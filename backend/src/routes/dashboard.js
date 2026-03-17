import express from "express";
import { getDashboardController } from "../controllers/dashboard.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getDashboardController);

export default router;