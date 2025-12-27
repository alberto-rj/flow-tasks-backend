import {
  ApiCreateTodoBodySchema,
  ApiUpdateTodoBodySchema,
  ApiUpdateTodoOrdersSchema,
  ApiTodoBodySchema,
} from '@/schemas/todo';
import z from '@/config/zod';

export type TodoFilterType = 'all' | 'active' | 'inactive';

export type TodoCreateDto = z.infer<typeof ApiCreateTodoBodySchema> & {
  userId: string;
};

export type TodoDeleteByIdDto = {
  id: string;
  userId: string;
};

export type TodoDeleteManyByUserIdDto = {
  filter?: TodoFilterType;
  userId: string;
};

export type TodoFindByIdDto = {
  id: string;
  userId: string;
};

export type TodoFindManyByUserIdDto = {
  filter?: TodoFilterType;
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

export type TodoDto = z.infer<typeof ApiTodoBodySchema>;
