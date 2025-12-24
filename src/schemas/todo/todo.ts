import z from '@/config/zod';
import { CreatedAtSchema, UpdatedAtSchema } from './shared';

export const TodoIdSchema = z
  .uuidv4({
    error: 'invalid ID.',
  })
  .openapi({
    title: 'TodoId',
    description: 'Todo ID.',
    example: 'UUID.v4',
  });

export const TodoTitleSchema = z
  .string({
    error: 'title must be string.',
  })
  .min(1, {
    error: 'title must cannot be empty.',
  })
  .max(255, {
    error: 'title must cannot exceed 255 characters.',
  })
  .openapi({
    type: 'string',
    minimum: 1,
    maximum: 255,
    title: 'title',
    description: 'Title for todo.',
    example: 'Todo title',
  });

export const TodoCompletedAtSchema = z
  .string({
    error: 'completedAt must be ISO date',
  })
  .openapi({
    type: 'string',
    format: 'datetime',
    title: 'completedAt',
    description: 'Completion date',
    example: '2025-12-11T20:10:34Z',
  });

export const TodoOrderSchema = z
  .int({ error: 'order must be integer.' })
  .min(0, { error: 'order must be at least 0.' })
  .default(0)
  .openapi({
    type: 'number',
    title: 'order',
    description: 'Todo order.',
    example: 0,
    minimum: 0,
    default: 0,
  });

export const TodoUserIdSchema = z
  .uuidv4({
    error: 'invalid ID.',
  })
  .openapi({
    title: 'userId',
    description: 'User ID.',
    example: 'UUID.v4',
  });

export const ApiCreateTodoSchema = z.object({
  title: TodoTitleSchema,
  order: TodoOrderSchema,
});

export const ApiUpdateTodoSchema = z.object({
  title: TodoTitleSchema,
  order: TodoOrderSchema.optional(),
  completedAt: TodoCompletedAtSchema.optional(),
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

export const ApiTodoSchema = z.object({
  id: TodoIdSchema,
  title: TodoTitleSchema,
  completedAt: TodoCompletedAtSchema.optional(),
  order: TodoOrderSchema,
  userId: TodoUserIdSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export type ApiCreateTodo = z.infer<typeof ApiCreateTodoSchema>;

export type ApiUpdateTodo = z.infer<typeof ApiUpdateTodoSchema>;

export type ApiUpdateTodoOrders = z.infer<typeof ApiUpdateTodoOrdersSchema>;

export type ApiUpdateTodoCompletedAt = z.infer<
  typeof ApiUpdateTodoCompletedAtSchema
>;

export type ApiTodo = z.infer<typeof ApiTodoSchema>;
