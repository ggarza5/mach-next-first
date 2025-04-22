import { NextResponse } from 'next/server'; // adjust the path if needed
import { ApiError } from '../types/api-error';

interface ErrorResponse {
  message: string;
  error?: string;
  details?: unknown;
}

export const handleApiError = (error: unknown) => {
  const apiError =
    error instanceof ApiError
      ? error
      : error instanceof Error
      ? new ApiError(error.message, 500)
      : new ApiError('Unknown error', 500);

  console.error(`❌ API Error: ${apiError.message}`, apiError.stack);

  const { message, statusCode, stack, details } = apiError;

  const response: ErrorResponse = {
    message: statusCode === 500 ? 'Internal Server Error' : message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = stack;
  }

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status: statusCode });
};
