import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { load } from '@/config/env';

const { NODE_ENV } = load();

export const healthRoute = Router();

healthRoute.get('/', (_, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    mode: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
