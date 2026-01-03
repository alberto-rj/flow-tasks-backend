import { Router } from 'express';

import {
  login,
  logout,
  refresh,
  register,
} from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares';

export const authRoute = Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.post('/refresh', authenticate, refresh);
authRoute.post('/logout', authenticate, logout);
