import { beforeEach, describe, expect, it } from 'vitest';

import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';
import { DeleteTodoUseCase } from '@/use-cases/todo';
import { createTodoList, newTodoRepository } from '@/utils/test';
import { ResourceNotFoundError } from '@/utils/errors';

describe('[Use Case] Todo / Delete', () => {
  let todoRepository: TodoRepository;
  let userId: string;
  let sut: DeleteTodoUseCase;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    userId = 'existing-user-id';
    sut = new DeleteTodoUseCase(todoRepository);
  });

  describe('success cases', () => {
    it('should delete todo successfully', async () => {
      const createdTodos = await createTodoList({
        todoRepository,
        limit: 3,
        userId,
      });
      const todoToDelete = createdTodos[0] as Todo;

      await sut.execute({
        data: { id: todoToDelete.id, userId },
      });

      await expect(
        todoRepository.findById({
          id: todoToDelete.id,
          userId,
        }),
      ).resolves.toBeNull();

      await expect(
        todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        }),
      ).resolves.toHaveLength(2);
    });
  });

  describe('failure cases', () => {
    it('should not delete todo from another user', async () => {
      await createTodoList({
        todoRepository,
        limit: 3,
        userId,
      });

      const anotherUserTodos = await createTodoList({
        todoRepository,
        limit: 3,
        userId: 'another-existing-user-id',
      });
      const todoToDelete = anotherUserTodos[0] as Todo;

      await expect(
        sut.execute({
          data: {
            id: todoToDelete.id,
            userId,
          },
        }),
      ).rejects.toThrow(ResourceNotFoundError);

      await expect(
        todoRepository.findById({
          id: todoToDelete.id,
          userId: 'another-existing-user-id',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: todoToDelete.id,
        }),
      );
    });

    it('should throw error when todo does not exists', async () => {
      await createTodoList({
        todoRepository,
        limit: 3,
        userId,
      });

      await expect(
        sut.execute({
          data: { id: 'non-existing-todo-id', userId },
        }),
      ).rejects.toThrow(ResourceNotFoundError);

      await expect(
        todoRepository.findManyByUserId({
          filter: 'all',
          userId,
        }),
      ).resolves.toHaveLength(3);
    });
  });
});
