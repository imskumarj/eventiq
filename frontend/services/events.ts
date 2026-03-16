import { apiRequest } from "./api";

export async function getEvents() {
  return apiRequest("/events", {
    method: "GET",
  });
}

export async function createEvent(data: {
  name: string;
  date: string;
  location: string;
  attendees: number;
  revenue: number;
}) {
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id: string, data: any) {
  return apiRequest(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string) {
  return apiRequest(`/events/${id}`, {
    method: "DELETE",
  });
}