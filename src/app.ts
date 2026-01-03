import cookieParser from 'cookie-parser';
import express from 'express';

import { load } from '@/config/env';
import { handleError } from '@/middlewares';
import { authRoute, healthRoute } from '@/routes';

const { PORT, NODE_ENV } = load();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRoute);
app.use('/api/health', healthRoute);

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT} in "${NODE_ENV}" mode.`,
    );
  });
}

// global error handler
app.use(handleError);
