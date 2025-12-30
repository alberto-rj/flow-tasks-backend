import type { TodoDto, TodoFindManyByUserIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { toTodoDto } from './todo-parser';

export interface ListTodoUseCaseParams {
  data: TodoFindManyByUserIdDto;
}

export interface ListTodoUseCaseResult {
  items: TodoDto[];
}

export class ListTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({ data }: ListTodoUseCaseParams) {
    const foundTodos = await this.todoRepository.findManyByUserId(data);

    const parsedTodos = foundTodos.map(toTodoDto);

    return {
      items: parsedTodos,
    };
  }
}
