import fs from "fs";
import path from "path";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

const REPORTS_DIR = "reports";

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

/* -------- Sample Data Generator -------- */

function generateData(type) {
  // Later replace with DB queries

  return [
    { name: "Event A", revenue: 120000, attendees: 2000 },
    { name: "Event B", revenue: 80000, attendees: 1500 },
  ];
}

/* -------- CSV -------- */

export async function generateCSV(data, filename) {
  const parser = new Parser();
  const csv = parser.parse(data);

  const filePath = path.join(REPORTS_DIR, filename);
  fs.writeFileSync(filePath, csv);

  return filePath;
}

/* -------- Excel -------- */

export async function generateExcel(data, filename) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key,
  }));

  sheet.addRows(data);

  const filePath = path.join(REPORTS_DIR, filename);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}

/* -------- MAIN GENERATOR -------- */

export async function generateReportFile(type, format) {

  const data = generateData(type);

  const filename = `${type}-${Date.now()}.${format.toLowerCase()}`;

  if (format === "CSV") {
    return generateCSV(data, filename);
  }

  if (format === "Excel") {
    return generateExcel(data, filename);
  }

  // PDF placeholder
  const filePath = path.join(REPORTS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return filePath;
}