import { beforeEach, describe, expect, it } from 'vitest';

import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';
import { ListTodoUseCase } from '@/use-cases/todo';
import { newTodoRepository } from '@/utils/test';

type CreateTodoListParams = {
  todoRepository: TodoRepository;
  userId: string;
  limit?: number;
  canCompleteEven?: boolean;
  canCompleteOdd?: boolean;
};

async function createTodoList({
  todoRepository,
  userId,
  limit = 10,
  canCompleteEven = false,
  canCompleteOdd = false,
}: CreateTodoListParams): Promise<Todo[]> {
  const items: Todo[] = [];

  for (let i = 0; i < limit; i++) {
    const item = await todoRepository.create({
      title: `Todo ${i + 1}`,
      userId,
    });

    if (canCompleteEven && i % 2 === 0) {
      await todoRepository.completeById({ id: item.id, userId });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.completeById({ id: item.id, userId });
    }

    items.push(item);
  }

  return items;
}

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

      describe('[filter]', () => {
        it('should return all todos when the filter is all', async () => {
          await createTodoList({
            todoRepository,
            userId,
            limit: 5,
            canCompleteEven: false,
            canCompleteOdd: false,
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
            canCompleteOdd: false,
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
            canCompleteEven: false,
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
      });
    });
  });
});
