import z from '@/config/zod';
import type {
  ApiCreateTodoSchema,
  ApiTodoSchema,
  ApiUpdateTodoOrdersSchema,
} from './todo-api';

export type TodoCreateParams = z.infer<typeof ApiCreateTodoSchema> & {
  userId: string;
};

export type TodoUpdateByIdParams = z.infer<typeof ApiUpdateTodoOrdersSchema> & {
  id: string;
  userId: string;
};

export type TodoFindManyByUserIdParams = {
  userId: string;
};

export type TodoDeleteManyCompletedAtParams = {
  userId: string;
};

export type TodoUpdateOrdersParams = z.infer<
  typeof ApiUpdateTodoOrdersSchema
> & {
  userId: string;
};

export type Todo = z.infer<typeof ApiTodoSchema>;
