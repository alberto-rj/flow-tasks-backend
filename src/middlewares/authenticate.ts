import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getAccessTokenPayload, type AuthRequest } from '@/utils/jwt';
import { error } from '@/utils/res-body';

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(error('No token provided.'));
    }

    const payload = getAccessTokenPayload(accessToken);

    if (!payload) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(error('Invalid or expired token.'));
    }

    req.payload = payload;

    next();
  } catch (error) {
    next(error);
  }
}
