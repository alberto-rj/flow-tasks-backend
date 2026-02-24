import { defineConfig } from 'drizzle-kit';

import { load } from './src/config/env';

const { DATABASE_URL } = load();

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
