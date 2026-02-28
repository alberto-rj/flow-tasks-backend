import { defineConfig } from 'drizzle-kit';

import { load } from './src/config/env';

const { DATABASE_URL } = load();

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
