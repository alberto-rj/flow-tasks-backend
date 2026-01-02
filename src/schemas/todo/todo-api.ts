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
});

export const ApiUpdateTodoBodySchema = ApiCreateTodoBodySchema.extend({
  order: z.number().int().positive().optional(),
});

export const ApiReorderTodoListSchema = z.object({
  todos: z.array(
    z.object({
      id: TodoIdSchema,
      order: TodoOrderSchema,
    }),
  ),
});

export const ApiTodoFilterSchema = z.enum(['all', 'active', 'completed']);

export const ApiTodoSortBySchema = z
  .enum(['title', 'order', 'createdAt', 'updatedAt'])
  .default('order');

export const ApiTodoOrderSchema = z.enum(['asc', 'desc']).default('asc');

export const ApiTodoQuerySchema = z.string().optional();

export const ApiTodoSchema = z.object({
  id: TodoIdSchema,
  title: TodoTitleSchema,
  completedAt: TodoCompletedAtSchema.optional(),
  order: TodoOrderSchema,
  userId: TodoUserIdSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});
