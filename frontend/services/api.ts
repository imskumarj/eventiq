const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("eventiq_token")
      : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      // ✅ Attach JWT
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  /* ✅ AUTO HANDLE AUTH FAIL */
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return { data };
}