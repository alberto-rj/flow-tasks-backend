import z from '@/config/zod';
import { CreatedAtSchema, UpdatedAtSchema } from '../shared/shared';

import {
  TodoIdSchema,
  TodoTitleSchema,
  TodoOrderSchema,
  TodoCompletedAtSchema,
  TodoUserIdSchema,
} from './todo-base';

export const ApiCreateTodoBodySchema = z.object({
  title: TodoTitleSchema,
  order: TodoOrderSchema,
});

export const ApiUpdateTodoBodySchema = ApiCreateTodoBodySchema.extend({
  order: z.number().int().positive().optional(),
});

export const ApiUpdateTodoOrdersSchema = z.object({
  todos: z.array(
    z.object({
      id: TodoIdSchema,
      order: TodoOrderSchema,
    }),
  ),
});

export const ApiUpdateTodoCompletedAtSchema = z.object({
  completedAt: TodoCompletedAtSchema,
});

export const ApiTodoBodySchema = z.object({
  id: TodoIdSchema,
  title: TodoTitleSchema,
  completedAt: TodoCompletedAtSchema.optional(),
  order: TodoOrderSchema,
  userId: TodoUserIdSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export type ApiCreateTodo = z.infer<typeof ApiCreateTodoBodySchema>;

export type ApiUpdateTodo = z.infer<typeof ApiUpdateTodoBodySchema>;

export type ApiUpdateTodoOrders = z.infer<typeof ApiUpdateTodoOrdersSchema>;

export type ApiUpdateTodoCompletedAt = z.infer<
  typeof ApiUpdateTodoCompletedAtSchema
>;

export type ApiTodo = z.infer<typeof ApiTodoBodySchema>;
