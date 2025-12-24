import type {
  Todo,
  TodoCreateParams,
  TodoFindManyByUserIdParams,
  TodoUpdateByIdParams,
  TodoUpdateOrdersParams,
  TodoDeleteManyCompletedAtParams,
  TodoDeleteByIdParams,
} from '@/schemas/todo/todo-params';

export interface TodosRepository {
  create: (data: TodoCreateParams) => Promise<Todo>;

  findManyByUserId: (params: TodoFindManyByUserIdParams) => Promise<Todo[]>;

  deleteById: (params: TodoDeleteByIdParams) => Promise<Todo | null>;

  deleteManyCompleted: (
    params: TodoDeleteManyCompletedAtParams,
  ) => Promise<void>;

  updateById(params: TodoUpdateByIdParams): Promise<void>;

  updateMany: (data: TodoUpdateOrdersParams) => Promise<void>;
}

export interface TodosRepositoryFactory {
  create: () => TodosRepository;
}
