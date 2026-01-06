import type { TodoDto, TodoToggleByIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';
import { toTodoDto } from './to-todo-dto';

export interface ToggleTodoUseCaseParams {
  data: TodoToggleByIdDto;
}

export interface ToggleTodoUseCaseResult {
  item: TodoDto;
}

export class ToggleTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    data,
  }: ToggleTodoUseCaseParams): Promise<ToggleTodoUseCaseResult> {
    const updatedTodo = await this.todoRepository.toggleById(data);

    if (updatedTodo === null) {
      throw new ResourceNotFoundError();
    }

    return {
      item: toTodoDto(updatedTodo),
    };
  }
}
