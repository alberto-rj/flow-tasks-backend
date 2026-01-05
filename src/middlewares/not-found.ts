import type { Request, Response, NextFunction } from 'express';

import { ResourceNotFoundError } from '@/utils/errors';

export function notFound(req: Request, _res: Response, next: NextFunction) {
  const message = `Cannot find ${req.originalUrl} oh this server.`;
  next(new ResourceNotFoundError(message));
}
