import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/user.model';

export function getApiErrorMessage(error: HttpErrorResponse, fallback = 'Something went wrong.'): string {
  const body = error.error;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    const apiError = body as ApiErrorResponse;
    if (apiError.message) {
      return apiError.message;
    }

    const validation = body as Record<string, string>;
    const messages = Object.values(validation).filter((value) => typeof value === 'string');
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  if (error.status === 0) {
    return 'Cannot reach the server. Make sure the backend is running on port 8081.';
  }

  return fallback;
}
