import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { ListTodoUseCase } from '@/use-cases/todo';
import {
  newTodoRepository,
  createTodoList,
  isIsoDate,
  createDetailedTodoList,
} from '@/utils/test';
import type { TodoDto } from '@/dtos/todo';

describe('[Use Case] Todo / List', () => {
  let sut: ListTodoUseCase;
  let todoRepository: TodoRepository;
  let userId: string;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    sut = new ListTodoUseCase(todoRepository);
    userId = 'an-existing-user-id';
  });

  describe('basic functionality', () => {
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

    it('should return todos with all required fields', async () => {
      await createTodoList({
        todoRepository,
        userId,
        limit: 3,
      });

      const { items } = await sut.execute({
        data: { userId },
      });

      expect(items).toHaveLength(3);
      items.forEach((item) => {
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

        expect(item.order).toBeGreaterThanOrEqual(0);
        expect(isIsoDate(item.createdAt)).toBe(true);
        expect(isIsoDate(item.updatedAt)).toBe(true);

        if (typeof item.completedAt === 'string') {
          expect(isIsoDate(item.completedAt)).toBe(true);
        } else {
          expect(item.completedAt).toBeNullable();
        }
      });
    });

    it('should return an empty array when user has no todos', async () => {
      const { items } = await sut.execute({
        data: { userId: 'empty-user-id' },
      });
      expect(items).toEqual([]);
    });
  });

  describe('filtering by status', () => {
    it('should return all todos when filter is "all"', async () => {
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

    it('should return only completed todos when filter is "completed"', async () => {
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

    it('should return only active todos when filter is "active"', async () => {
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

  describe('search by query', () => {
    it('should filter todos by query in title (case insensitive)', async () => {
      await createTodoList({
        todoRepository,
        userId,
        limit: 3,
        title: 'Mobile',
      });

      await createTodoList({
        todoRepository,
        userId,
        limit: 2,
        title: 'Web',
      });

      const { items } = await sut.execute({
        data: {
          userId,
          query: 'mOBilE',
        },
      });

      expect(items).toHaveLength(3);
      items.forEach((item) => {
        expect(item.title.toLowerCase()).toContain('mobile');
      });
    });

    it('should return empty array when no todos match query', async () => {
      await createTodoList({
        todoRepository,
        userId,
        limit: 3,
        title: 'Mobile',
      });

      await createTodoList({
        todoRepository,
        userId,
        limit: 2,
        title: 'Web',
      });

      const { items } = await sut.execute({
        data: {
          userId,
          query: 'desktop',
        },
      });

      expect(items).toEqual([]);
    });
  });

  describe('sorting functionality', () => {
    describe('when sort by title', () => {
      it('should return todos sorted by title in ascending order when order is "asc"', async () => {
        await createDetailedTodoList({
          todoRepository,
          items: [
            { title: 'E', userId },
            { title: 'D', userId },
            { title: 'C', userId },
            { title: 'B', userId },
            { title: 'A', userId },
          ],
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'title',
            order: 'asc',
          },
        });

        expect(items).toHaveLength(5);
        expect(items.map((item) => item.title)).toEqual([
          'A',
          'B',
          'C',
          'D',
          'E',
        ]);
      });

      it('should return todos sorted by title in descending order when order is "desc"', async () => {
        await createDetailedTodoList({
          todoRepository,
          items: [
            { title: 'A', userId },
            { title: 'B', userId },
            { title: 'C', userId },
            { title: 'D', userId },
            { title: 'E', userId },
          ],
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'title',
            order: 'desc',
          },
        });

        expect(items).toHaveLength(5);
        expect(items.map((item) => item.title)).toEqual([
          'E',
          'D',
          'C',
          'B',
          'A',
        ]);
      });
    });

    describe('when sort by order', () => {
      it('should return todos sorted by order in ascending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'order',
            order: 'asc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = (items[i - 1] as TodoDto).order;
          const curr = (items[i] as TodoDto).order;
          expect(prev).toBeLessThanOrEqual(curr);
        }
      });

      it('should return todos sorted by order in descending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'order',
            order: 'desc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = (items[i - 1] as TodoDto).order;
          const curr = (items[i] as TodoDto).order;
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      });
    });

    describe('when sort by createdAt', () => {
      it('should return todos sorted by createdAt in ascending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'createdAt',
            order: 'asc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = new Date((items[i - 1] as TodoDto).createdAt).getTime();
          const curr = new Date((items[i] as TodoDto).createdAt).getTime();
          expect(prev).toBeLessThanOrEqual(curr);
        }
      });

      it('should return todos sorted by createdAt in descending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'createdAt',
            order: 'desc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = new Date((items[i - 1] as TodoDto).createdAt).getTime();
          const curr = new Date((items[i] as TodoDto).createdAt).getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      });
    });

    describe('when sort by updatedAt', () => {
      it('should return todos sorted by updatedAt in ascending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'updatedAt',
            order: 'asc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = new Date((items[i - 1] as TodoDto).updatedAt).getTime();
          const curr = new Date((items[i] as TodoDto).updatedAt).getTime();
          expect(prev).toBeLessThanOrEqual(curr);
        }
      });

      it('should return todos sorted by updatedAt in descending order', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 5,
        });

        const { items } = await sut.execute({
          data: {
            userId,
            sortBy: 'updatedAt',
            order: 'desc',
          },
        });

        expect(items).toHaveLength(5);
        for (let i = 1; i < items.length; i++) {
          const prev = new Date((items[i - 1] as TodoDto).updatedAt).getTime();
          const curr = new Date((items[i] as TodoDto).updatedAt).getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
      });
    });
  });
});
