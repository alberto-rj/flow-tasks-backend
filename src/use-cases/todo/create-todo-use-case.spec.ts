import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoCreateDto } from '@/dtos/todo';
import type { TodoRepository } from '@/repositories';
import { CreateTodoUseCase } from '@/use-cases/todo';
import { isIsoDate, newTodoCreateDto, newTodoRepository } from '@/utils/test';

describe('[Use Case] Todo / Create', () => {
  let sut: CreateTodoUseCase;
  let todoRepository: TodoRepository;
  let data: TodoCreateDto;

  beforeEach(() => {
    todoRepository = newTodoRepository();
    data = newTodoCreateDto();
    sut = new CreateTodoUseCase(todoRepository);
  });

  describe('[function] execute', () => {
    describe('success cases', () => {
      it('should create and persist a valid todo', async () => {
        const result = await sut.execute({ data });

        expect(result.todo).toMatchObject({
          title: data.title,
          userId: data.userId,
          todoId: expect.any(String),
          order: expect.any(Number),
        });

        await expect(
          todoRepository.findById({
            todoId: result.todo.todoId,
            userId: data.userId,
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            todoId: result.todo.todoId,
            userId: data.userId,
          }),
        );
      });

      it('should not return a todo for a different user', async () => {
        const { todo } = await sut.execute({ data });

        await expect(
          todoRepository.findById({
            todoId: todo.todoId,
            userId: 'another-user-id',
          }),
        ).resolves.toBeNull();
      });

      describe('[field] order', () => {
        it('should return a todo with a non-negative order generated', async () => {
          const { todo } = await sut.execute({ data });
          expect(todo).toHaveProperty('order');
          expect(todo.order).toBeGreaterThanOrEqual(0);
        });

        it('should return todos with an order consecutively generated', async () => {
          let todoOrders: number[] = [];

          for (let i = 0; i < 10; i++) {
            const result = await sut.execute({ data });
            todoOrders.push(result.todo.order);
          }

          for (let i = 1; i < todoOrders.length; i++) {
            const next = todoOrders[i] as number;
            const prev = todoOrders[i - 1] as number;
            expect(next).toBe(prev + 1);
          }
        });
      });

      describe('[field] completedAt', () => {
        it('should return the todo without completedAt', async () => {
          const result = await sut.execute({ data });

          expect(result.todo.completedAt).toBeNullable();
        });
      });

      describe('[field] createdAt', () => {
        it('should return a todo with a timestamp in ISO format for createdAt', async () => {
          const {
            todo: { createdAt },
          } = await sut.execute({ data });

          expect(isIsoDate(createdAt)).toBe(true);
        });
      });

      describe('[field] updatedAt', () => {
        it('should return a todo with a timestamp in ISO format for updatedAt', async () => {
          const {
            todo: { updatedAt },
          } = await sut.execute({ data });

          expect(isIsoDate(updatedAt)).toBe(true);
        });
      });
    });
  });
});
