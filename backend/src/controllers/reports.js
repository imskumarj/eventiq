import {
  generateReport,
  getReports,
  getReportById
} from "../services/reports.js";

/* -------- GENERATE -------- */

export async function generateReportController(req, res) {

  try {

    const { type, format } = req.body;

    const report = await generateReport(type, format);

    res.status(201).json(report);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to generate report"
    });

  }

}

/* -------- GET ALL -------- */

export async function getReportsController(req, res) {

  try {

    const reports = await getReports();

    res.json(reports);

  } catch {

    res.status(500).json({
      message: "Failed to fetch reports"
    });

  }

}

/* -------- DOWNLOAD -------- */

export async function downloadReportController(req, res) {

  try {

    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found"
      });
    }

    res.download(report.fileUrl);

  } catch {

    res.status(500).json({
      message: "Download failed"
    });

  }

}