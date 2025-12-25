import type { Request } from 'express';

export interface AuthPayload {
  userId: string;
  userEmail: string;
}

export interface AuthRequest extends Request {
  payload?: AuthPayload;
}

export function getAccessToken({ userId, userEmail }: AuthPayload) {
  const sanitizedUserId = userId.toLowerCase().replaceAll(' ', '');
  const sanitizedUserEmail = userEmail.toLowerCase().replaceAll(' ', '');
  return `${sanitizedUserId}-${sanitizedUserEmail}`;
}
