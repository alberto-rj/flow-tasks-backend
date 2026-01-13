import z from '@/config/zod';
import {
  createApiResultListResponseSchema,
  createApiResultResponseSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
} from '@/schemas/common';
import { UserIdSchema } from '@/schemas/user';

/* Base schemas (start) */
export const TodoIdSchema = z
  .string({
    error: 'todoId must be a string.',
  })
  .trim()
  .regex(z.regexes.guid, {
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

export const ApiTodoFilterSchema = z.enum(['all', 'active', 'completed'], {
  error: 'filter must be only "all", "active" or "completed".',
});

export const ApiTodoSortBySchema = z.enum(
  ['title', 'order', 'createdAt', 'updatedAt'],
  { error: 'sortBy must be only "title", "order", "createdAt" or "updatedAt"' },
);

export const ApiTodoOrderSchema = z.enum(['asc', 'desc'], {
  error: 'order must be only "asc" or "dec".',
});

export const ApiTodoQuerySchema = z
  .string({ error: 'query must be a string.' })
  .max(225, { error: 'query cannot exceed 225 characters.' })
  .optional();
/* Base schemas (end) */

/* Common schemas (start) */
export const ApiTodoSchema = z.object({
  todoId: TodoIdSchema,
  title: TodoTitleSchema,
  completedAt: TodoCompletedAtSchema.optional(),
  order: TodoOrderSchema,
  userId: UserIdSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export const ApiTodoIdParamsSchema = z.object({
  todoId: TodoIdSchema,
});
/* Common schemas (end) */

export type ApiTodoIdParams = z.infer<typeof ApiTodoIdParamsSchema>;

/* Creation schemas (start) */
export const ApiCreateTodoBodySchema = z.object({
  title: TodoTitleSchema,
});
export const ApiCreateTodoSchema = z.object({
  body: ApiCreateTodoBodySchema,
});
export type ApiCreateTodo = z.infer<typeof ApiCreateTodoSchema>;
export type ApiCreateTodoBody = ApiCreateTodo['body'];
/* Creation schemas (end) */

/* Updating schemas (start)*/
export const ApiUpdateTodoParamsSchema = ApiTodoIdParamsSchema;
export const ApiUpdateTodoBodySchema = z.object({
  title: TodoTitleSchema,
  order: TodoOrderSchema.optional(),
});
export const ApiUpdateTodoSchema = z.object({
  params: ApiUpdateTodoParamsSchema,
  body: ApiUpdateTodoBodySchema,
});
export type ApiUpdateTodo = z.infer<typeof ApiUpdateTodoSchema>;
export type ApiUpdateTodoParams = z.infer<typeof ApiUpdateTodoParamsSchema>;
export type ApiUpdateTodoBody = z.infer<typeof ApiUpdateTodoBodySchema>;
/* Updating schemas (end) */

/* Toggling schemas (start) */
export const ApiToggleTodoParamsSchema = ApiTodoIdParamsSchema;
export const ApiToggleTodoSchema = z.object({
  params: ApiToggleTodoParamsSchema,
});
export type ApiToggleTodo = z.infer<typeof ApiToggleTodoSchema>;
export type ApiToggleTodoParams = z.infer<typeof ApiToggleTodoParamsSchema>;
/* Toggling schemas (end) */

/*  Reordering schemas (start) */
export const ApiReorderTodoListBodySchema = z.object({
  todos: z.array(
    z.object({
      todoId: TodoIdSchema,
      order: TodoOrderSchema,
    }),
  ),
});
export const ApiReorderTodoListSchema = z.object({
  body: ApiReorderTodoListBodySchema,
});
export type ApiReorderTodoList = z.infer<typeof ApiReorderTodoListSchema>;
export type ApiReorderTodoListBody = z.infer<
  typeof ApiReorderTodoListBodySchema
>;
/*  Reordering schemas (end) */

/* Listing schemas (start) */
export const ApiListTodoQuerySchema = z.object({
  query: ApiTodoQuerySchema.optional(),
  filter: ApiTodoFilterSchema.optional(),
  sortBy: ApiTodoSortBySchema.optional(),
  order: ApiTodoOrderSchema.optional(),
});
export const ApiListTodoSchema = z.object({
  query: ApiListTodoQuerySchema,
});
export type ApiListTodo = z.infer<typeof ApiListTodoSchema>;
export type ApiListTodoQuery = z.infer<typeof ApiListTodoQuerySchema>;
/* Listing schemas (end) */

/* Deletion list schemas (start) */
export const ApiDeleteTodoListQuerySchema = z.object({
  filter: ApiTodoFilterSchema.optional(),
});
export const ApiDeleteTodoListSchema = z.object({
  query: ApiDeleteTodoListQuerySchema,
});
export type ApiDeleteTodoList = z.infer<typeof ApiDeleteTodoListSchema>;
export type ApiDeleteTodoListQuery = z.infer<
  typeof ApiDeleteTodoListQuerySchema
>;
/* Deletion list schemas (end) */

/* Deletion schemas (start) */
export const ApiDeleteTodoParamsSchemas = ApiTodoIdParamsSchema;
export const ApiDeleteTodoSchema = z.object({
  params: ApiDeleteTodoParamsSchemas,
});
export type ApiDeleteTodo = z.infer<typeof ApiDeleteTodoSchema>;
export type ApiDeleteTodoParams = z.infer<typeof ApiDeleteTodoParamsSchemas>;
/* Deletion schemas (end) */

/* Find schemas (start) */
export const ApiFindTodoParamsSchemas = ApiTodoIdParamsSchema;
export const ApiFindTodoSchema = z.object({
  params: ApiFindTodoParamsSchemas,
});
export type ApiFindTodo = z.infer<typeof ApiFindTodoSchema>;
export type ApiFindTodoParams = z.infer<typeof ApiFindTodoParamsSchemas>;
/* Find schemas (end) */

export const ApiTodoResultResponseSchema =
  createApiResultResponseSchema(ApiTodoSchema);

export const ApiTodoResultListResponseSchema =
  createApiResultListResponseSchema(ApiTodoSchema);

export const ApiTodosStatsSchema = z.object({
  total: z.int().min(0),
  active: z.int().min(0),
  completed: z.int().min(0),
});

export const ApiTodoStatsResultResponseSchema =
  createApiResultResponseSchema(ApiTodosStatsSchema);
