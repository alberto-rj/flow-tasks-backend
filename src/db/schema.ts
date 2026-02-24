import { relations, sql } from 'drizzle-orm';
import {
  integer,
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
  .defaultNow();

export const users = pgTable('users', {
  userId: uuid('user_id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt,
  updatedAt,
});

export const todos = pgTable('todos', {
  todoId: uuid('todo_id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 255 }).notNull(),
  order: integer('order').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt,
  updatedAt,
  userId: uuid()
    .notNull()
    .references(() => users.userId),
});

export const userRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.userId],
  }),
}));
