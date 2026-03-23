import { apiRequest } from "./api";

export async function getSponsors(search = "") {
  return apiRequest(`/sponsors?search=${search}`, {
    method: "GET",
  });
}

export async function createSponsor(data: {
  name: string;
  email: string;
  eventId: string;
  amount: number;
}) {
  try {
    return await apiRequest("/sponsors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (err: any) {
    throw new Error(err.message || "Failed to create sponsor");
  }
}