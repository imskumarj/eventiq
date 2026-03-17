import { apiRequest } from "./api";

export async function generateReport(type: string, format: string) {
  return apiRequest("/reports/generate", {
    method: "POST",
    body: JSON.stringify({ type, format }),
  });
}

export async function getReports() {
  return apiRequest("/reports", {
    method: "GET",
  });
}

export async function downloadReport(id: string) {
  return apiRequest(`/reports/${id}/download`, {
    method: "GET",
  });
}