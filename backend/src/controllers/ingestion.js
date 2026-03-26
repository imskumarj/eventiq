import { processCsv, getImportLogs } from "../services/ingestion.js";

/* ---------------- UPLOAD ---------------- */

export async function uploadCsv(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const result = await processCsv(
      req.file.path,
      req.file.originalname,
      req.user.id
    );

    res.json({
      success: true,
      message: "File processed successfully",
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to process CSV"
    });

  }
}

/* ---------------- GET IMPORTS ---------------- */

export async function getImports(req, res) {
  try {

    const logs = await getImportLogs();

    res.json({
      success: true,
      data: logs
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed to fetch imports"
    });

  }
}