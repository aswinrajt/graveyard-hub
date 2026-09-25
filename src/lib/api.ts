import { createIsomorphicFn } from "@tanstack/react-start";

const DEFAULT_API_URL = import.meta.env.PROD
  ? "https://graveyard-backend.onrender.com"
  : "http://localhost:4100";

const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const getCookieHeader = createIsomorphicFn()
  .client(() => "")
  .server(async () => {
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const req = getRequest();
      return req?.headers.get("cookie") ?? "";
    } catch {
      return "";
    }
  });

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const isForm = init.body instanceof FormData;
  if (!headers.has("Content-Type") && init.body && !isForm) {
    headers.set("Content-Type", "application/json");
  }
  const cookie = await getCookieHeader();
  if (cookie) headers.set("cookie", cookie);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: string }).error)
        : res.statusText;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const apiUrl = API_URL;
