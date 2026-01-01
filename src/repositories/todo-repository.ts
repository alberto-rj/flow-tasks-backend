import type { Todo } from '@/entities';
import type {
  TodoCreateDto,
  TodoFindByIdDto,
  TodoFindManyByUserIdDto,
  TodoUpdateByIdDto,
  TodoDeleteManyByUserIdDto,
  TodoDeleteByIdDto,
  TodoUpdateManyByUserIdDto,
  TodoToggleByIdDto,
} from '@/dtos/todo';

export interface TodoRepository {
  create: (params: TodoCreateDto) => Promise<Todo>;

  findById: (params: TodoFindByIdDto) => Promise<Todo | null>;

  findManyByUserId: (params: TodoFindManyByUserIdDto) => Promise<Todo[]>;

  deleteById: (params: TodoDeleteByIdDto) => Promise<Todo | null>;

  deleteManyByUserId: (params: TodoDeleteManyByUserIdDto) => Promise<void>;

  updateById(params: TodoUpdateByIdDto): Promise<Todo | null>;

  updateManyByUserId: (
    params: TodoUpdateManyByUserIdDto,
  ) => Promise<void | null>;

  toggleById: (params: TodoToggleByIdDto) => Promise<Todo | null>;
}
