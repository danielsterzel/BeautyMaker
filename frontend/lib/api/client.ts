import { env } from "../env";
import { useAuthStore } from "../storage";

const API_BASE_URL = `${env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/v1`;

type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
};

type ErrorPayload = {
  detail?: unknown;
  message?: unknown;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
    public readonly detail?: unknown,
  ) {
    super(typeof detail === "string" ? detail : `API error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

let refreshRequest: Promise<string> | null = null;

async function createApiError(response: Response) {
  let payload: ErrorPayload | null = null;

  try {
    payload = (await response.json()) as ErrorPayload;
  } catch {
    // Some upstream errors do not include a JSON response body.
  }

  return new ApiError(
    response.status,
    response.statusText,
    payload?.detail ?? payload?.message,
  );
}

export async function refreshSession(): Promise<string> {
  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      useAuthStore.getState().clearTokens();
      throw await createApiError(response);
    }

    const payload = (await response.json()) as {
      accessToken?: unknown;
      access_token?: unknown;
    };
    const accessToken = payload.accessToken ?? payload.access_token;

    if (typeof accessToken !== "string" || !accessToken) {
      useAuthStore.getState().clearTokens();
      throw new ApiError(500, "Invalid refresh response");
    }

    useAuthStore.getState().setToken(accessToken);
    return accessToken;
  })().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  canRetry = true,
): Promise<T> {
  const { method = "GET", body, headers } = options;
  const token = useAuthStore.getState().accessToken;
  const requestHeaders = new Headers(headers);
  let requestBody: string | undefined;

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
  });

  const isAuthenticationRequest =
    endpoint === "auth/login" || endpoint === "auth/refresh";

  if (response.status === 401 && canRetry && !isAuthenticationRequest) {
    try {
      await refreshSession();
      return request<T>(endpoint, options, false);
    } catch {
      useAuthStore.getState().clearTokens();
    }
  }

  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
