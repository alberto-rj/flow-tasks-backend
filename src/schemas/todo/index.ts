import z from '@/config/zod';
import { CreatedAtSchema, UpdatedAtSchema } from '@/schemas/shared';

export const TodoIdSchema = z
  .string({
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
  .string({
    error: 'invalid ID.',
  })
  .openapi({
    title: 'userId',
    description: 'User ID.',
    example: 'UUID.v4',
  });

export const ApiTodoFilterSchema = z.enum(['all', 'active', 'completed']);

export const ApiTodoSortBySchema = z.enum([
  'title',
  'order',
  'createdAt',
  'updatedAt',
]);

export const ApiTodoOrderSchema = z.enum(['asc', 'desc']);

export const ApiTodoQuerySchema = z.string().optional();

export const ApiCreateTodoBodySchema = z.object({
  title: TodoTitleSchema,
});

export const ApiUpdateTodoBodySchema = ApiCreateTodoBodySchema.extend({
  order: z.number().int().min(0).optional(),
});

export const ApiReorderTodoListBodySchema = z.object({
  todos: z.array(
    z.object({
      id: TodoIdSchema,
      order: TodoOrderSchema,
    }),
  ),
});

export const ApiTodoIdParamsSchema = z.object({
  id: TodoIdSchema,
});

export const ApiListTodoQuerySchema = z.object({
  query: ApiTodoQuerySchema.optional(),
  filter: ApiTodoFilterSchema.optional(),
  sortBy: ApiTodoSortBySchema.optional(),
  order: ApiTodoOrderSchema.optional(),
});

export const ApiDeleteTodoListQuerySchema = z.object({
  filter: ApiTodoFilterSchema.optional(),
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

export type ApiCreateTodoBody = z.infer<typeof ApiCreateTodoBodySchema>;

export type ApiUpdateTodoBody = z.infer<typeof ApiUpdateTodoBodySchema>;

export type ApiReorderTodoListBody = z.infer<
  typeof ApiReorderTodoListBodySchema
>;

export type ApiTodoIdParams = z.infer<typeof ApiTodoIdParamsSchema>;

export type ApiListTodoQuery = z.infer<typeof ApiListTodoQuerySchema>;

export type ApiDeleteTodoListQuery = z.infer<
  typeof ApiDeleteTodoListQuerySchema
>;
