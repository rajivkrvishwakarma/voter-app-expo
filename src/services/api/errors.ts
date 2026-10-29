import type { ApiErrorPayload } from './types';

/**
 * Standard typed application error hierarchy.
 */

export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly isTransient: boolean;
  readonly details?: unknown;

  constructor(message: string, code: string, status?: number, isTransient = false, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.isTransient = isTransient;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection unavailable. Please check your connectivity.') {
    super(message, 'NETWORK_ERROR', undefined, true);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'The request timed out. Please try again.') {
    super(message, 'TIMEOUT_ERROR', 408, true);
    this.name = 'TimeoutError';
  }
}

export class AuthError extends AppError {
  constructor(message = 'Session expired or unauthorized. Please sign in again.', status = 401) {
    super(message, 'AUTH_ERROR', status, false);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  readonly fieldErrors?: Record<string, string[]>;

  constructor(message = 'Invalid request payload.', fieldErrors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 422, false, fieldErrors);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class ApiError extends AppError {
  readonly payload?: ApiErrorPayload;

  constructor(message: string, status: number, code = 'API_ERROR', payload?: ApiErrorPayload) {
    super(message, code, status, status >= 500 && status < 600, payload);
    this.name = 'ApiError';
    this.payload = payload;
  }
}
