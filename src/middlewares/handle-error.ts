/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { load } from '@/config/env';
import { AppError } from '@/utils/errors';
import { error } from '@/utils/res-body';

const { NODE_ENV } = load();

export function handleError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (NODE_ENV === 'development') {
    console.log(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.format());
  }

  const message = 'Something went wrong.';

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error(message));
}
