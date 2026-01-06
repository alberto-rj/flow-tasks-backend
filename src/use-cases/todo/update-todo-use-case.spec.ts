import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { UpdateTodoUseCase } from '@/use-cases/todo';
import { ResourceNotFoundError } from '@/utils/errors';
import { isIsoDate, newTodoRepository } from '@/utils/test';

describe('[Use Case] Todo / Update', () => {
  let todoRepository: TodoRepository;
  let userId: string;
  let sut: UpdateTodoUseCase;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    userId = 'existing-user-id';
    sut = new UpdateTodoUseCase(todoRepository);
  });

  describe('success cases', () => {
    it('should update both title and order', async () => {
      const createdTodo = await todoRepository.create({
        title: 'My todo',
        userId,
      });

      const { item } = await sut.execute({
        data: {
          todoId: createdTodo.todoId,
          userId,
          title: 'New title',
          order: 10,
        },
      });

      expect(item).toEqual(
        expect.objectContaining({
          todoId: createdTodo.todoId,
          userId: createdTodo.userId,
          title: 'New title',
          order: 10,
        }),
      );
    });

    it('should update only title without change order', async () => {
      const createdTodo = await todoRepository.create({
        title: 'My title',
        userId,
      });

      const { item } = await sut.execute({
        data: {
          todoId: createdTodo.todoId,
          userId,
          title: 'My new title',
        },
      });

      expect(item).toEqual(
        expect.objectContaining({
          todoId: createdTodo.todoId,
          userId: createdTodo.userId,
          title: 'My new title',
          order: createdTodo.order,
        }),
      );
    });

    it('should return todo with valid ISO timestamps', async () => {
      const createdTodo = await todoRepository.create({
        title: 'My todo',
        userId,
      });

      const { item } = await sut.execute({
        data: {
          todoId: createdTodo.todoId,
          userId,
          title: 'Updated',
          order: 10,
        },
      });

      expect(isIsoDate(item.createdAt)).toBe(true);
      expect(isIsoDate(item.updatedAt)).toBe(true);
      if (typeof item.completedAt === 'string') {
        expect(isIsoDate(item.completedAt)).toBe(true);
      } else {
        expect(item.completedAt).toBeNullable();
      }
    });
  });

  describe('failure cases', () => {
    it('should throw ResourceNotFoundError when todo does not exists', async () => {
      await expect(
        sut.execute({
          data: {
            todoId: 'non-existing-todo-id',
            userId,
            title: 'My new title',
          },
        }),
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw ResourceNotFoundError when todo belongs to another user', async () => {
      const anotherTodo = await todoRepository.create({
        title: 'Another user todo',
        userId: 'another-user-id',
      });

      await expect(
        sut.execute({
          data: {
            todoId: anotherTodo.todoId,
            userId,
            title: 'Hacked title',
            order: 10,
          },
        }),
      ).rejects.toThrow(ResourceNotFoundError);
    });
  });
});
