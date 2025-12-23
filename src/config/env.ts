import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  throw new Error('Invalid environment variables.');
}

export const env = envResult.data;
