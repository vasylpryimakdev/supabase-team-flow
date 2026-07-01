const BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

export const api = {
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, "POST", body, token),

  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, "PUT", body, token),

  del: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, "DELETE", body, token),

  get: <T>(path: string, token?: string) =>
    request<T>(path, "GET", undefined, token),
};
