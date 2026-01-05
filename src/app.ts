import cookieParser from 'cookie-parser';
import express from 'express';

import { load } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares';
import { authRoute, healthRoute, todosRoute } from '@/routes';

const { PORT, NODE_ENV } = load();

export const app = express();

// global middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoute);
app.use('/api/todos', todosRoute);
app.use('/api/health', healthRoute);

// middleware for not found routes
app.use(notFoundHandler);

// middleware for global error handling
app.use(errorHandler);

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT} in "${NODE_ENV}" mode.`,
    );
  });
}
