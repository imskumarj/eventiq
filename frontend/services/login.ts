import { apiRequest } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}