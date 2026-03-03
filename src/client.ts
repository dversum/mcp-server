import { getRequestToken } from "./context.js";

export class DversumClient {
  private baseUrl: string;
  private fallbackToken: string;

  constructor(baseUrl: string, fallbackToken: string) {
    this.baseUrl = baseUrl;
    this.fallbackToken = fallbackToken;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      params?: Record<string, string>;
      body?: unknown;
    }
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);

    const token = getRequestToken() ?? this.fallbackToken;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchOptions: RequestInit = { method, headers };

    if (options?.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorMessage = `API error ${response.status}: ${response.statusText}`;
      try {
        const errorBody = (await response.json()) as { error?: string };
        if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
  }

  async delete(path: string): Promise<void> {
    await this.request<void>("DELETE", path);
  }
}
