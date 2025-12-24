import express from 'express';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello world',
  });
});

app.get('/api/health', (_, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
