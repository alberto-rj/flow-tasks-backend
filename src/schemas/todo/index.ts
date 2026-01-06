import z from '@/config/zod';
import { CreatedAtSchema, UpdatedAtSchema } from '@/schemas/shared';
import { UserIdSchema } from '@/schemas/user';

export const TodoIdSchema = z
  .guid({
    error: 'todoId must be a valid UUID.',
  })
  .openapi({
    title: 'todoId',
    description: 'Unique identifier of the todo.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  });

export const TodoTitleSchema = z
  .string({
    error: 'title must be a string.',
  })
  .trim()
  .min(1, {
    error: 'title is required.',
  })
  .max(225, {
    error: 'title cannot exceed 225 characters.',
  })
  .openapi({
    title: 'title',
    description: 'Title of the todo item.',
    example: 'Buy groceries',
  });

export const TodoCompletedAtSchema = z.string().openapi({
  title: 'completedAt',
  description: 'Date and time when the todo was completed.',
  format: 'date-time',
  example: '2025-12-11T20:10:34Z',
});

export const TodoOrderSchema = z
  .int({
    error: 'order must be an integer.',
  })
  .min(0, {
    error: 'order must be at least 0.',
  })
  .openapi({
    title: 'order',
    description: 'The position of the todo item in the list.',
    example: 0,
    minimum: 0,
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
      todoId: TodoIdSchema,
      order: TodoOrderSchema,
    }),
  ),
});

export const ApiTodoIdParamsSchema = z.object({
  todoId: TodoIdSchema,
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
  todoId: TodoIdSchema,
  title: TodoTitleSchema,
  completedAt: TodoCompletedAtSchema.optional(),
  order: TodoOrderSchema,
  userId: UserIdSchema,
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
