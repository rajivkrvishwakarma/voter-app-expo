import { ENV } from '@/constants/env';
import { TokenStorage } from '@/features/auth/services/token.storage';
import {
  ApiError,
  AppError,
  AuthError,
  NetworkError,
  TimeoutError,
  ValidationError,
} from './errors';
import type { ApiErrorPayload, ApiResponse, RequestOptions } from './types';

const DEFAULT_TIMEOUT_MS = 15000;

export type UnauthorizedHandler = (message: string) => void;

class ApiClient {
  private readonly baseUrl: string;
  private onUnauthorizedHandler?: UnauthorizedHandler;

  constructor(baseUrl: string = ENV.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Registers a global handler invoked when any request returns 401 Unauthenticated.
   */
  setOnUnauthorized(handler: UnauthorizedHandler): void {
    this.onUnauthorizedHandler = handler;
  }

  private handleUnauthorized(message: string): void {
    if (this.onUnauthorizedHandler) {
      try {
        this.onUnauthorizedHandler(message);
      } catch {
        // Prevent listener failures from breaking request flow
      }
    }
  }

  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async normalizeError(response: Response): Promise<AppError> {
    let payload: ApiErrorPayload | undefined;
    let rawText = '';

    try {
      rawText = await response.text();
      payload = JSON.parse(rawText) as ApiErrorPayload;
    } catch {
      payload = rawText ? { message: rawText } : undefined;
    }

    const message = payload?.message || `Request failed with status ${response.status}`;
    const code = payload?.code || `HTTP_${response.status}`;

    // Detect 401 unauthenticated response (e.g. {"status":401,"message":"Unauthenticated. Bearer token required."})
    const isUnauthenticated =
      response.status === 401 ||
      response.status === 403 ||
      payload?.status === 401 ||
      (typeof message === 'string' &&
        (message.toLowerCase().includes('unauthenticated') ||
          message.toLowerCase().includes('bearer token required')));

    if (isUnauthenticated) {
      this.handleUnauthorized(message);
      return new AuthError(message, response.status || 401);
    }

    if (response.status === 422) {
      return new ValidationError(message, payload?.errors);
    }

    return new ApiError(message, response.status, code, payload);
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      headers: customHeaders = {},
      timeoutMs = DEFAULT_TIMEOUT_MS,
      signal: customSignal,
    } = options;

    const url = this.buildUrl(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Chain custom signal if provided
    if (customSignal) {
      customSignal.addEventListener('abort', () => controller.abort());
    }

    // Attach stored JWT authentication token if available and not already provided
    let authToken = customHeaders['Authorization'];
    if (!authToken) {
      const storedToken = await TokenStorage.getToken();
      if (storedToken) {
        authToken = `Bearer ${storedToken}`;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(authToken ? { Authorization: authToken } : {}),
      ...customHeaders,
      'Accept-Encoding': 'identity'
    };

    const requestInit: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body !== undefined && method !== 'GET') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.normalizeError(response);
      }

      // Handle empty response bodies (e.g. 204 No Content)
      if (response.status === 204) {
        return {
          data: null as unknown as T,
          status: response.status,
          headers: response.headers,
        };
      }

      const data = (await response.json()) as T;

      // Handle cases where backend returns 200 OK HTTP status but JSON body indicates 401 Unauthenticated
      if (
        data &&
        typeof data === 'object' &&
        'status' in data &&
        (data as Record<string, unknown>).status === 401
      ) {
        const errorMsg =
          (data as Record<string, unknown>).message ||
          'Unauthenticated. Bearer token required.';
        this.handleUnauthorized(String(errorMsg));
        throw new AuthError(String(errorMsg), 401);
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError();
        }
        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          throw new NetworkError();
        }
      }

      throw new AppError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'UNKNOWN_ERROR'
      );
    }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
