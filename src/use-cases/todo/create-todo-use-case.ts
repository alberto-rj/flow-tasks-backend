import type { TodoCreateDto, TodoDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { toTodoDto } from './todo-parser';

export interface CreateTodoUseCaseParams {
  data: TodoCreateDto;
}

export interface CreateTodoUseCaseResult {
  todo: TodoDto;
}

export class CreateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({ data }: CreateTodoUseCaseParams) {
    const createdTodo = await this.todoRepository.create(data);

    return {
      todo: toTodoDto(createdTodo),
    };
  }
}
