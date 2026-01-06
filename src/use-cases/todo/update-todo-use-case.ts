import type { TodoDto, TodoUpdateByIdDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';
import { toTodoDto } from './to-todo-dto';

export interface UpdateTodoUseCaseParams {
  data: TodoUpdateByIdDto;
}

export interface UpdateTodoUseCaseResult {
  item: TodoDto;
}

export class UpdateTodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async execute({
    data,
  }: UpdateTodoUseCaseParams): Promise<UpdateTodoUseCaseResult> {
    const updatedTodo = await this.todoRepository.updateById(data);

    if (updatedTodo === null) {
      throw new ResourceNotFoundError();
    }

    return {
      item: toTodoDto(updatedTodo),
    };
  }
}
