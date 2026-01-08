import { Router } from 'express';

import { authController } from '@/controllers';
import { authenticate } from '@/middlewares';

export const authRoute = Router();

authRoute.post('/register', authController.register);

authRoute.post('/login', authController.login);

authRoute.get('/me', authenticate, authController.profile);

authRoute.post('/refresh', authenticate, authController.refresh);

authRoute.post('/logout', authenticate, authController.logout);
