import { authService } from "./auth.service";

const BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown,
): Promise<T> {
  const token = await authService.getToken();

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
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body: unknown) => request<T>(path, "PUT", body),
  patch: <T>(path: string, body: unknown) => request<T>(path, "PATCH", body),
  del: <T>(path: string, body?: unknown) => request<T>(path, "DELETE", body),
  get: <T>(path: string) => request<T>(path, "GET"),
};
