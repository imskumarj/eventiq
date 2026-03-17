import { apiRequest } from "./api";

export async function getSystemMetrics() {
  return apiRequest("/system-metrics", {
    method: "GET",
  });
}