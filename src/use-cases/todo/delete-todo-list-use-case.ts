import type { TodoDeleteManyByUserIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';

export interface DeleteTodoListUseCaseParams {
  data: TodoDeleteManyByUserIdDto;
}

export class DeleteTodoListUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({ data }: DeleteTodoListUseCaseParams) {
    await this.todoRepository.deleteManyByUserId(data);
  }
}
