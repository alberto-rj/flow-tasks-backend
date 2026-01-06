import type { TodoReorderManyByUserIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { ExistingOrderError, ResourceNotFoundError } from '@/utils/errors';

export interface ReorderTodoListUseCaseParams {
  data: TodoReorderManyByUserIdDto;
}

export class ReorderTodoListUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    data: { userId, todos },
  }: ReorderTodoListUseCaseParams): Promise<void> {
    for (const { todoId, order } of todos) {
      const foundTodoWithOrder =
        await this.todoRepository.findByUserIdWithOrder({
          userId,
          order,
        });

      const isExistingTodoOrder =
        foundTodoWithOrder !== null && foundTodoWithOrder.todoId !== todoId;

      if (isExistingTodoOrder) {
        throw new ExistingOrderError();
      }

      const updatedTodo = await this.todoRepository.reorderById({
        todoId,
        order,
        userId,
      });

      if (updatedTodo === null) {
        throw new ResourceNotFoundError();
      }
    }
  }
}
