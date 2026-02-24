import { drizzle } from 'drizzle-orm/node-postgres';

import { load } from '@/config/env';

const { DATABASE_URL } = load();

export const db = drizzle(DATABASE_URL);
