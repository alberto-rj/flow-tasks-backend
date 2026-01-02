import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { DeleteTodoListUseCase } from '@/use-cases/todo';
import { createTodoList, newTodoRepository } from '@/utils/test';

describe('[Use Case] Todo / Delete List', () => {
  let sut: DeleteTodoListUseCase;
  let todoRepository: TodoRepository;
  let userId: string;

  beforeEach(async () => {
    todoRepository = newTodoRepository();
    sut = new DeleteTodoListUseCase(todoRepository);
    userId = 'existing-user-id';
  });

  describe('[function] execute', () => {
    describe('success cases', () => {
      it('should delete all user todos when filter is "all"', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'all',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        expect(remainingTodos).toEqual([]);
      });

      it('should delete only completed todos when filter is "completed"', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'completed',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        expect(remainingTodos).toHaveLength(3);
        remainingTodos.forEach((todo) => {
          expect(todo.completedAt).toBeNullable();
        });
      });

      it('should delete only active todos when filter is "active"', async () => {
        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'active',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        remainingTodos.forEach((todo) => {
          expect(todo.completedAt).toEqual(expect.any(Date));
        });
      });
    });

    describe('edge cases', () => {
      it('should not affect todos from another users', async () => {
        const otherUserId = 'another-existing-user-id';
        const anotherUserTodos = await createTodoList({
          todoRepository,
          userId: otherUserId,
          limit: 6,
          canCompleteEven: true,
        });

        await createTodoList({
          todoRepository,
          userId,
          limit: 6,
          canCompleteEven: true,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'all',
          },
        });

        const otherUserRemainingTodos = await todoRepository.findManyByUserId({
          userId: otherUserId,
          filter: 'all',
        });

        expect(otherUserRemainingTodos).toHaveLength(anotherUserTodos.length);
        otherUserRemainingTodos.forEach((todo) => {
          expect(todo.userId).toBe(otherUserId);
        });
      });

      it('should handle deletion when user has no todos', async () => {
        await sut.execute({
          data: {
            userId,
            filter: 'all',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        expect(remainingTodos).toEqual([]);
      });

      it('should handle deletion when trying to delete completed todos but user has none', async () => {
        const activeTodosCount = 6;
        await createTodoList({
          todoRepository,
          userId,
          limit: activeTodosCount,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'completed',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        expect(remainingTodos).toHaveLength(activeTodosCount);
      });

      it('should handle deletion when trying to delete active todos but user has none', async () => {
        const completedTodosCount = 6;
        await createTodoList({
          todoRepository,
          userId,
          limit: completedTodosCount,
          canCompleteEven: true,
          canCompleteOdd: true,
        });

        await sut.execute({
          data: {
            userId,
            filter: 'active',
          },
        });

        const remainingTodos = await todoRepository.findManyByUserId({
          userId,
          filter: 'all',
        });

        expect(remainingTodos).toHaveLength(completedTodosCount);
      });
    });
  });
});
