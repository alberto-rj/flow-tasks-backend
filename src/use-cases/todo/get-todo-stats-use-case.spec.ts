import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { GetTodoStatsUseCase } from '@/use-cases/todo';
import { createTodoList, newTodoRepository } from '@/utils/test';

describe('[Use Case] Todo / Get Stats', () => {
  let todoRepository: TodoRepository;
  let sut: GetTodoStatsUseCase;
  let userId: string;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    sut = new GetTodoStatsUseCase(todoRepository);
    userId = 'an-existing-user-id';
  });

  describe('[function] execute', () => {
    describe('[success cases]', () => {
      it('should return correct stats for user with mixed todos', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        const { stats } = await sut.execute({
          data: {
            userId,
          },
        });

        expect(stats.active).toBe(3);
        expect(stats.completed).toBe(3);
        expect(stats.total).toBe(6);
      });

      it('should return correct status when user only has active todos', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
        });

        const { stats } = await sut.execute({
          data: {
            userId,
          },
        });

        expect(stats.active).toBe(6);
        expect(stats.completed).toBe(0);
        expect(stats.total).toBe(6);
      });

      it('should return correct stats when user only has completed todos', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
          canCompleteOdd: true,
        });

        const { stats } = await sut.execute({
          data: {
            userId,
          },
        });

        expect(stats.active).toBe(0);
        expect(stats.completed).toBe(6);
        expect(stats.total).toBe(6);
      });

      it('should return stats only for the specified user, excluding other users todos', async () => {
        const otherUserId = 'another-existing-user-id';

        await createTodoList({
          todoRepository,
          userId: otherUserId,
          limit: 3,
          canCompleteEven: true,
        });

        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        const { stats } = await sut.execute({
          data: {
            userId,
          },
        });

        expect(stats.active).toBe(3);
        expect(stats.completed).toBe(3);
        expect(stats.total).toBe(6);
      });

      it('should return stats with numeric values', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 4,
          canCompleteEven: true,
        });

        const { stats } = await sut.execute({
          data: { userId },
        });

        expect(typeof stats.active).toBe('number');
        expect(typeof stats.completed).toBe('number');
        expect(typeof stats.total).toBe('number');
        expect(stats.active).toBeGreaterThanOrEqual(0);
        expect(stats.completed).toBeGreaterThanOrEqual(0);
        expect(stats.total).toBeGreaterThanOrEqual(0);
      });
    });

    describe('[edge cases]', () => {
      it('should return zero stats when user has no todos', async () => {
        const { stats } = await sut.execute({
          data: {
            userId,
          },
        });

        expect(stats.active).toBe(0);
        expect(stats.completed).toBe(0);
        expect(stats.total).toBe(0);
      });
    });
  });
});
