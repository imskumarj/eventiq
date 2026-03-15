import { apiRequest } from "./api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "admin" | "organizer" | "sponsor";
}

export async function registerUser(payload: RegisterPayload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}