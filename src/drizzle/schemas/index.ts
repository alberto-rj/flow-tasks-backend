import { sql } from 'drizzle-orm';
import {
  integer,
  pgSequence,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const createdAt = timestamp('created_at', { withTimezone: true })
  .notNull()
  .defaultNow();

const updatedAt = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdateFn(() => new Date());

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt,
  updatedAt,
});

export const todosOrderSeq = pgSequence('todos_order_seq', {
  startWith: 1,
  increment: 1,
});

export const todos = pgTable('todos', {
  todoId: uuid('todo_id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  order: integer('order')
    .default(sql`nextval('todos_order_seq')`)
    .notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt,
  updatedAt,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
});
