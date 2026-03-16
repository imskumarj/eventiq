import { apiRequest } from "./api";

export async function getAnalyticsDashboard() {
  return apiRequest("/analytics/dashboard");
}