import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { ToggleTodoUseCase } from '@/use-cases/todo';
import { ResourceNotFoundError } from '@/utils/errors';
import { isIsoDate, newTodoRepository, sleep } from '@/utils/test';

describe('[Use Case] Todo / Toggle', () => {
  let todoRepository: TodoRepository;
  let userId: string;
  let sut: ToggleTodoUseCase;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    userId = 'existing-user-id';
    sut = new ToggleTodoUseCase(todoRepository);
  });

  describe('[function] execute', () => {
    describe('success cases', () => {
      it('should mark an active todo as completed', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });

        const { item } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });

        expect(item).toEqual(
          expect.objectContaining({
            todoId: createdTodo.todoId,
            userId: createdTodo.userId,
            title: createdTodo.title,
          }),
        );
        expect(isIsoDate(item.completedAt)).toBe(true);
      });

      it('should mark a completed todo as active', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });

        await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });

        const { item } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });

        expect(item).toEqual(
          expect.objectContaining({
            todoId: createdTodo.todoId,
            userId: createdTodo.userId,
            title: createdTodo.title,
          }),
        );
        expect(item.completedAt).toBeNullable();
      });

      it('should return todo with all required properties', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });

        const { item } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });

        expect(item).toEqual(
          expect.objectContaining({
            todoId: expect.any(String),
            userId: expect.any(String),
            title: expect.any(String),
            order: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
        expect(item).toHaveProperty('completedAt');
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

      it('should update the updatedAt timestamp when toggling', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });
        const before = new Date(createdTodo.updatedAt).getTime();

        await sleep();

        const { item } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });
        const after = new Date(item.updatedAt).getTime();

        expect(after).toBeGreaterThan(before);
      });

      it('should preserve other todo properties when toggling', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });

        const { item } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });

        expect(item).toEqual(
          expect.objectContaining({
            todoId: createdTodo.todoId,
            userId: createdTodo.userId,
            title: createdTodo.title,
            order: createdTodo.order,
            createdAt: createdTodo.createdAt.toISOString(),
          }),
        );
      });

      it('should toggle multiple times correctly', async () => {
        const createdTodo = await todoRepository.create({
          title: 'My todo',
          userId,
        });

        // Toggle 1: active -> completed
        const { item: firstToggle } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });
        expect(isIsoDate(firstToggle.completedAt)).toBe(true);

        // Toggle 2: completed -> active
        const { item: secondToggle } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });
        expect(secondToggle.completedAt).toBeNullable();

        // Toggle 3: active -> completed
        const { item: thirdToggle } = await sut.execute({
          data: {
            todoId: createdTodo.todoId,
            userId,
          },
        });
        expect(isIsoDate(thirdToggle.completedAt)).toBe(true);
      });
    });

    describe('failure cases', () => {
      it('should throw ResourceNotFoundError when todo does not exists', async () => {
        await expect(
          sut.execute({
            data: {
              todoId: 'non-existing-todo-id',
              userId,
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
            },
          }),
        ).rejects.toThrow(ResourceNotFoundError);
      });
    });
  });
});
