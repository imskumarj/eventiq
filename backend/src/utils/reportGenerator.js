import fs from "fs";
import path from "path";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const REPORTS_DIR = "reports";

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

/* -------- CSV -------- */

export async function generateCSV(data, filename) {
  const parser = new Parser();
  const csv = parser.parse(data);

  const filePath = path.join(REPORTS_DIR, filename);
  fs.writeFileSync(filePath, csv);

  return filePath;
}

/* -------- EXCEL -------- */

export async function generateExcel(data, filename) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = Object.keys(data[0]).map(key => ({
    header: key.toUpperCase(),
    key,
  }));

  sheet.addRows(data);

  const filePath = path.join(REPORTS_DIR, filename);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}

/* -------- PDF -------- */

export async function generatePDF(data, filename) {
  const filePath = path.join(REPORTS_DIR, filename);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Report", { align: "center" });
  doc.moveDown();

  data.forEach((row, i) => {
    doc.fontSize(12).text(`Row ${i + 1}`);
    Object.entries(row).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    doc.moveDown();
  });

  doc.end();

  return filePath;
}

/* -------- MAIN -------- */

export async function generateReportFile(type, format, data) {

  if (!data || data.length === 0) {
    throw new Error("No data available for report");
  }

  const filename = `${type}-${Date.now()}.${format.toLowerCase()}`;

  if (format === "CSV") {
    return generateCSV(data, filename);
  }

  if (format === "Excel") {
    return generateExcel(data, filename);
  }

  if (format === "PDF") {
    return generatePDF(data, filename);
  }

  throw new Error("Invalid format");
}