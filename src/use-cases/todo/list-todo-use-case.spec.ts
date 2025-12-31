import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { ListTodoUseCase } from '@/use-cases/todo';
import { newTodoRepository, createTodoList } from '@/utils/test';

describe('[Use Case] Todo / List', () => {
  let sut: ListTodoUseCase;
  let todoRepository: TodoRepository;
  let userId: string;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    sut = new ListTodoUseCase(todoRepository);
    userId = 'an-existing-user-id';
  });

  describe('[function] execute', () => {
    describe('success cases', () => {
      it('should return only todos belonging to the user', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 3,
        });

        await createTodoList({
          todoRepository,
          userId: 'an-other-existing-user-id',
          limit: 3,
        });

        const { items } = await sut.execute({
          data: { userId },
        });

        expect(items).toHaveLength(3);
        items.forEach((item) => {
          expect(item.userId).toBe(userId);
        });
      });

      describe('[query]', () => {
        it('should return all todos with title that contain the query "Mobile", not sensitive case', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            prefix: 'Learning-',
            title: 'Web',
            suffix: '-2025',
          });

          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            prefix: 'Learning-',
            title: 'Mobile',
            suffix: '-2026',
          });

          const { items } = await sut.execute({
            data: {
              userId,
              query: 'mOBilE',
            },
          });

          expect(items).toHaveLength(10);
          expect(
            items.every(
              (item) => item.userId === userId && item.title.includes('Mobile'),
            ),
          ).toBe(true);
        });
      });

      describe('[filter]', () => {
        it('should return all todos when the filter is all', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 5,
          });

          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            canCompleteEven: true,
            canCompleteOdd: true,
          });

          const { items } = await sut.execute({
            data: {
              userId,
              filter: 'all',
            },
          });

          expect(items).toHaveLength(15);
          items.forEach((item) => {
            expect(item.userId).toBe(userId);
          });
        });

        it('should return all completed todos when the filter is "completed"', async () => {
          await createTodoList({
            todoRepository,
            userId,
            canCompleteEven: true,
            limit: 10,
          });

          const { items } = await sut.execute({
            data: {
              userId,
              filter: 'completed',
            },
          });

          expect(items).toHaveLength(5);
          expect(
            items.every((item) => item.userId === userId && item.completedAt),
          ).toBe(true);
        });

        it('should return all active todos when the filter is "active"', async () => {
          await createTodoList({
            todoRepository,
            userId,
            canCompleteOdd: true,
            limit: 10,
          });

          const { items } = await sut.execute({
            data: {
              filter: 'active',
              userId,
            },
          });

          expect(items).toHaveLength(5);
          expect(
            items.every((item) => item.userId === userId && !item.completedAt),
          ).toBe(true);
        });
      });

      describe('edge cases', () => {
        it('should return an empty array when user has no todo', async () => {
          const { items } = await sut.execute({
            data: { userId: 'empty-user-id' },
          });
          expect(items).toEqual([]);
        });

        it('should return an empty array when user has no completed todos', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
          });

          const { items } = await sut.execute({
            data: {
              filter: 'completed',
              userId,
            },
          });

          expect(items).toEqual([]);
        });

        it('should return an empty array when user has no active todos', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            canCompleteEven: true,
            canCompleteOdd: true,
          });

          const { items } = await sut.execute({
            data: {
              filter: 'active',
              userId,
            },
          });

          expect(items).toEqual([]);
        });

        it('should return an empty array when user has no todo title that match to the query "Mobile"', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            prefix: 'Learning-',
            title: 'Web',
            suffix: '-2025',
          });

          await createTodoList({
            todoRepository,
            userId,
            limit: 10,
            prefix: 'Learning-',
            title: 'Desktop',
            suffix: '-2026',
          });

          const { items } = await sut.execute({
            data: {
              userId,
              query: 'mOBilE',
            },
          });

          expect(items).toEqual([]);
        });
      });
    });
  });
});
