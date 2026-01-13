import type { TodoDto, TodoFindByIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';
import { toTodoDto } from './to-todo-dto';

export interface FindTodoUseCaseParams {
  data: TodoFindByIdDto;
}

export interface FindTodoUseCaseResult {
  item: TodoDto;
}

export class FindTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    data: { todoId, userId },
  }: FindTodoUseCaseParams): Promise<FindTodoUseCaseResult> {
    const foundTodo = await this.todoRepository.findById({ todoId, userId });

    if (!foundTodo) {
      throw new ResourceNotFoundError();
    }

    return {
      item: toTodoDto(foundTodo),
    };
  }
}
