import type { Todo } from '@/entities';
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

  updateById(params: TodoUpdateByIdDto): Promise<Todo | null>;

  reorderById: (params: TodoReorderByIdDto) => Promise<Todo | null>;

  toggleById: (params: TodoToggleByIdDto) => Promise<Todo | null>;
}
