import { Router } from 'express';

import {
  login,
  logout,
  refresh,
  register,
} from '@/controllers/auth.controller';
import { authenticate, validateRequest } from '@/middlewares';
import { ApiLoginBodySchema, ApiRegisterBodySchema } from '@/schemas/auth';

export const authRoute = Router();

authRoute.post(
  '/register',
  validateRequest.body(ApiRegisterBodySchema),
  register,
);

authRoute.post('/login', validateRequest.body(ApiLoginBodySchema), login);

authRoute.post('/refresh', authenticate, refresh);
authRoute.post('/logout', authenticate, logout);
