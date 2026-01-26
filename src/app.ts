import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { load } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares';
import { authRoute, healthRoute, todosRoute } from '@/routes';
import { openapi } from '@/openapi';

const { PORT, NODE_ENV, SERVER_URL } = load();

export const app = express();

// Global middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Swagger UI */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapi, {
    customSiteTitle: 'FlowTasks API Documentation',
  }),
);

// API routes
app.use('/api/auth', authRoute);
app.use('/api/todos', todosRoute);
app.use('/api/health', healthRoute);

// Middleware for not found routes
app.use(notFoundHandler);

// Middleware for global error handling
app.use(errorHandler);

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at ${SERVER_URL} in "${NODE_ENV}" mode.`);
    // eslint-disable-next-line no-console
    console.log(`Swagger UI is available at ${SERVER_URL}/api-docs`);
  });
}
