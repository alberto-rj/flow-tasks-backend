import dotenv from 'dotenv';
import { z } from 'zod';

type LoadFileType = 'development' | 'test' | 'production' | 'default';

const envPaths: Record<LoadFileType, string> = {
  development: '.env.development',
  test: '.env.test',
  production: '.env.production',
  default: '.env',
};

const instructionsURL = 'https://github.com/alberto-rj/flow-tasks-backend';

const envSchema = z.object({
  PORT: z.coerce.number().default(4224),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  JWT_ACCESS_SECRET: z.string().default('secret'),
  JWT_ACCESS_EXPIRES_IN_DAYS: z.coerce.number().default(7),
});

export function load(type: LoadFileType = 'default') {
  const path = envPaths[type];

  dotenv.config({ path, quiet: true });

  const envResult = envSchema.safeParse(process.env);

  if (!envResult.success) {
    throw new Error(
      `Please refer to the instructions at ${instructionsURL} to configure the environment variables correctly.`,
    );
  }

  return envResult.data;
}
