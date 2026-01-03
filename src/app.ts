import express from 'express';
import cookieParser from 'cookie-parser';

import { load } from '@/config/env';
import { healthRoutes } from '@/routes';

const { PORT, NODE_ENV } = load();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/health', healthRoutes);

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT} in "${NODE_ENV}" mode.`,
    );
  });
}
