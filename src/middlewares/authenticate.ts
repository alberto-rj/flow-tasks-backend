import type { Response, NextFunction } from 'express';

import { getAccessTokenPayload, type AuthRequest } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new UnauthorizedError('No token provided.');
    }

    const payload = getAccessTokenPayload(accessToken);

    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token.');
    }

    req.payload = payload;

    next();
  } catch (error) {
    next(error);
  }
}
