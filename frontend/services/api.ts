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

  console.log("TOKEN SENT:", token);

  // ✅ AUTH GUARD (skip for auth routes)
  const isAuthRoute = endpoint.startsWith("/auth");

  if (!token && !isAuthRoute) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      // ✅ Attach JWT only if exists
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

  /* ✅ HANDLE 401 FROM BACKEND */
  if (res.status === 401) {
    // optional cleanup (recommended)
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