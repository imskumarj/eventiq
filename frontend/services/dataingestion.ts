import { apiRequest } from "./api";

export async function uploadCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/data-ingestion/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getImports() {
  return apiRequest("/data-ingestion/imports", {
    method: "GET",
  });
}