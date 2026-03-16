import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  uploadCsv,
  getImports
} from "../controllers/ingestion.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadCsv
);

router.get(
  "/imports",
  authenticate,
  getImports
);

export default router;