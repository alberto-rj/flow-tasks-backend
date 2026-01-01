import type { TodoDeleteByIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';

export interface DeleteTodoUseCaseParams {
  data: TodoDeleteByIdDto;
}

export class DeleteTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({ data }: DeleteTodoUseCaseParams) {
    const deletedTodo = await this.todoRepository.deleteById(data);

    if (deletedTodo === null) {
      throw new ResourceNotFoundError();
    }
  }
}
