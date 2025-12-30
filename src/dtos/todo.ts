import {
  ApiCreateTodoBodySchema,
  ApiUpdateTodoBodySchema,
  ApiUpdateTodoOrdersSchema,
  ApiTodoSchema,
  ApiTodoFilterSchema,
  ApiTodoSortBySchema,
  ApiTodoOrderSchema,
  ApiTodoQuerySchema,
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
  id: string;
  userId: string;
};

export type TodoDeleteManyByUserIdDto = {
  filter?: TodoFilterDto;
  userId: string;
};

export type TodoFindByIdDto = {
  id: string;
  userId: string;
};

export type TodoFindManyByUserIdDto = {
  filter?: TodoFilterDto;
  sortBy?: TodoSortByDto;
  order?: TodoOrderDto;
  query?: TodoQueryDto;
  userId: string;
};

export type TodoUpdateByIdDto = z.infer<typeof ApiUpdateTodoBodySchema> & {
  id: string;
  userId: string;
};

export type TodoUpdateManyByUserIdDto = z.infer<
  typeof ApiUpdateTodoOrdersSchema
> & {
  userId: string;
};

export type TodoCompleteByIdDto = {
  id: string;
  userId: string;
};

export type TodoDto = z.infer<typeof ApiTodoSchema>;
