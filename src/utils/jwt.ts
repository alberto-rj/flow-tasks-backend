import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import { load } from '@/config/env';

const { JWT_EXPIRES_IN_DAYS, JWT_SECRET } = load();

export interface AuthPayload {
  userId: string;
  userEmail: string;
}

export interface AuthRequest extends Request {
  payload?: AuthPayload;
}

export function getAccessToken({ userId, userEmail }: AuthPayload) {
  const accessToken = jwt.sign({ userId, userEmail }, JWT_SECRET, {
    expiresIn: `${JWT_EXPIRES_IN_DAYS}d`,
  });
  return accessToken;
}

export function getAccessTokenPayload(token: string): AuthPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload as AuthPayload;
  } catch (error) {
    return null;
  }
}
