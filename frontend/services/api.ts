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

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,

    headers: {
      // ✅ ONLY set JSON header if NOT FormData
      ...(!isFormData && {
        "Content-Type": "application/json",
      }),

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

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eventiq_token");
      localStorage.removeItem("eventiq_user");
    }

    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return { data };
}