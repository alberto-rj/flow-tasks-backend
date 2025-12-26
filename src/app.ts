import express from 'express';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';

import { load } from '@/config/env';

const { PORT, NODE_ENV } = load();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Hello world',
  });
});

app.get('/api/health', (_, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    mode: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `Server is running at http://localhost:${PORT} in "${NODE_ENV}" mode.`,
    );
  });
}
