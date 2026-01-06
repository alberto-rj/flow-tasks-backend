import {
  ApiCreateTodoBodySchema,
  ApiUpdateTodoBodySchema,
  ApiReorderTodoListBodySchema,
  ApiTodoSchema,
  ApiTodoFilterSchema,
  ApiTodoSortBySchema,
  ApiTodoOrderSchema,
  ApiTodoQuerySchema,
  ApiListTodoQuerySchema,
  ApiDeleteTodoListQuerySchema,
} from '@/schemas/todo';
import z from '@/config/zod';

export type TodoFilterDto = z.infer<typeof ApiTodoFilterSchema>;

export type TodoSortByDto = z.infer<typeof ApiTodoSortBySchema>;

export type TodoOrderDto = z.infer<typeof ApiTodoOrderSchema>;

export type TodoQueryDto = z.infer<typeof ApiTodoQuerySchema>;

export type TodoCreateDto = z.infer<typeof ApiCreateTodoBodySchema> & {
  userId: string;
};

export type TodoDeleteByIdDto = {
  todoId: string;
  userId: string;
};

export type TodoDeleteManyByUserIdDto = z.infer<
  typeof ApiDeleteTodoListQuerySchema
> & {
  userId: string;
};

export type TodoFindByIdDto = {
  todoId: string;
  userId: string;
};

export type TodoFindByUserIdWithOrderDto = {
  userId: string;
  order: number;
};

export type TodoFindManyByUserIdDto = z.infer<typeof ApiListTodoQuerySchema> & {
  userId: string;
};

export type TodoUpdateByIdDto = z.infer<typeof ApiUpdateTodoBodySchema> & {
  todoId: string;
  userId: string;
};

export type TodoReorderByIdDto = {
  todoId: string;
  order: number;
  userId: string;
};

export type TodoReorderManyByUserIdDto = z.infer<
  typeof ApiReorderTodoListBodySchema
> & {
  userId: string;
};

export type TodoToggleByIdDto = {
  todoId: string;
  userId: string;
};

export type TodoGetStatsByUserIdDto = {
  userId: string;
};

export type TodoDto = z.infer<typeof ApiTodoSchema>;
