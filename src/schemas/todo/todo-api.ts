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
