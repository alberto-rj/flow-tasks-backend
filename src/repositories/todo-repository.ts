import type { Todo, TodoStats } from '@/entities';
import type {
  TodoCreateDto,
  TodoFindByIdDto,
  TodoFindByUserIdWithOrderDto,
  TodoFindManyByUserIdDto,
  TodoUpdateByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoDeleteByIdDto,
  TodoToggleByIdDto,
  TodoReorderByIdDto,
  TodoGetStatsByUserIdDto,
} from '@/dtos/todo';

export interface TodoRepository {
  create: (params: TodoCreateDto) => Promise<Todo>;

  findById: (params: TodoFindByIdDto) => Promise<Todo | null>;

  findByUserIdWithOrder: (
    params: TodoFindByUserIdWithOrderDto,
  ) => Promise<Todo | null>;

  findManyByUserId: (params: TodoFindManyByUserIdDto) => Promise<Todo[]>;

  deleteById: (params: TodoDeleteByIdDto) => Promise<Todo | null>;

  deleteManyByUserId: (params: TodoDeleteManyByUserIdDto) => Promise<void>;

  updateById: (params: TodoUpdateByIdDto) => Promise<Todo | null>;

  reorderById: (params: TodoReorderByIdDto) => Promise<Todo | null>;

  toggleById: (params: TodoToggleByIdDto) => Promise<Todo | null>;

  getStats: (params: TodoGetStatsByUserIdDto) => Promise<TodoStats>;

  clear: () => Promise<void>;
}
