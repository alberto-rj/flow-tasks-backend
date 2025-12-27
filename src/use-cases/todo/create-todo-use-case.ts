import type { TodoCreateDto, TodoDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';

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

    let completedAt = undefined;

    if (typeof createdTodo.completedAt != 'undefined') {
      completedAt = createdTodo.completedAt.toISOString();
    }

    const todoDto: TodoDto = {
      id: createdTodo.id,
      title: createdTodo.title,
      order: createdTodo.order,
      userId: createdTodo.userId,
      completedAt: completedAt,
      createdAt: createdTodo.createdAt.toISOString(),
      updatedAt: createdTodo.updatedAt.toISOString(),
    };

    return {
      todo: todoDto,
    };
  }
}
