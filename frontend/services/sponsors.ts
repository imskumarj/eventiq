import { apiRequest } from "./api";

export async function getSponsors(search = "") {
  return apiRequest(`/sponsors?search=${search}`, {
    method: "GET",
  });
}

export async function createSponsor(data: {
  name: string;
  eventId: string;
  amount: number;
}) {
  return apiRequest("/sponsors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}