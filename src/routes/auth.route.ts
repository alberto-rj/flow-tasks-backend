import { Router } from 'express';

import { authController } from '@/controllers';
import { authenticate, validateRequest } from '@/middlewares';
import { ApiLoginBodySchema, ApiRegisterBodySchema } from '@/schemas/auth';

export const authRoute = Router();

authRoute.post(
  '/register',
  validateRequest.body(ApiRegisterBodySchema),
  authController.register,
);

authRoute.post(
  '/login',
  validateRequest.body(ApiLoginBodySchema),
  authController.login,
);

authRoute.get('/me', authenticate, authController.profile);

authRoute.post('/refresh', authenticate, authController.refresh);

authRoute.post('/logout', authenticate, authController.logout);
