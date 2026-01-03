import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function handleError(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const message = error.message || 'Something went wrong.';

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message,
    },
  });
}
