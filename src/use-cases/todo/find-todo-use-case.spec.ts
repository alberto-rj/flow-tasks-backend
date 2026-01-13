import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { FindTodoUseCase } from '@/use-cases/todo';
import { newTodoCreateDto, newTodoRepository } from '@/utils/test';
import { ResourceNotFoundError } from '@/utils/errors';
import { toTodoDto } from './to-todo-dto';

describe('[Use Case] Todo / Find', () => {
  let todoRepository: TodoRepository;
  let userId: string;
  let sut: FindTodoUseCase;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    userId = 'existing-user-id';
    sut = new FindTodoUseCase(todoRepository);
  });

  describe('success cases', () => {
    it('should get user todo successfully', async () => {
      const createdTodo = await todoRepository.create({
        ...newTodoCreateDto(),
        userId,
      });

      const { item: foundTodo } = await sut.execute({
        data: { todoId: createdTodo.todoId, userId },
      });

      expect(foundTodo).toStrictEqual(toTodoDto(createdTodo));
    });
  });

  describe('failure cases', () => {
    it('should throw ResourceNotFoundError when trying to get todo from another user', async () => {
      const otherUserCreatedTodo = await todoRepository.create({
        ...newTodoCreateDto(),
        userId: 'another-existing-user-id',
      });

      await expect(
        sut.execute({
          data: {
            todoId: otherUserCreatedTodo.todoId,
            userId,
          },
        }),
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw ResourceNotFoundError when trying to get non-existing todo', async () => {
      await todoRepository.create({
        ...newTodoCreateDto(),
        userId,
      });

      await expect(
        sut.execute({
          data: { todoId: 'non-existing-todo-id', userId },
        }),
      ).rejects.toThrow(ResourceNotFoundError);
    });
  });
});
