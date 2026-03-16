import { processCsv, getImportLogs } from "../services/ingestion.js";

export async function uploadCsv(req, res) {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const result = await processCsv(
      req.file.path,
      req.file.originalname
    );

    res.json({
      message: "File processed successfully",
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to process CSV"
    });

  }

}

export async function getImports(req, res) {

  try {

    const logs = await getImportLogs();

    res.json(logs);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch imports"
    });

  }

}