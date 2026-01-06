import { beforeEach, describe, expect, it } from 'vitest';

import type { TodoRepository } from '@/repositories';
import { ReorderTodoListUseCase } from '@/use-cases/todo';
import { createTodoList, newTodoRepository, sleep } from '@/utils/test';
import { ExistingOrderError, ResourceNotFoundError } from '@/utils/errors';

describe('[Use Case] Todo / Reorder List', () => {
  let todoRepository: TodoRepository;
  let sut: ReorderTodoListUseCase;
  let userId: string;

  beforeEach(async () => {
    userId = 'existing-user-id';
    todoRepository = newTodoRepository();
    sut = new ReorderTodoListUseCase(todoRepository);
  });

  describe('[function] execute', () => {
    describe('[success cases]', () => {
      it('should reorder todos', async () => {
        const createdTodos = await createTodoList({
          limit: 3,
          todoRepository,
          userId,
        });

        const newTodos = createdTodos.map((item) => ({
          todoId: item.todoId,
          order: item.order + 100,
        }));

        await sut.execute({
          data: {
            userId,
            todos: newTodos,
          },
        });

        for (const newTodo of newTodos) {
          const updatedTodo = await todoRepository.findById({
            todoId: newTodo.todoId,
            userId,
          });
          expect(updatedTodo?.order).toBe(newTodo.order);
        }
      });

      it('should update the updatedAt timestamp when reordering', async () => {
        const createdTodos = await createTodoList({
          limit: 3,
          todoRepository,
          userId,
        });

        const newTodos = createdTodos.map((item) => ({
          todoId: item.todoId,
          order: item.order + 100,
        }));

        await sleep();

        await sut.execute({
          data: {
            userId,
            todos: newTodos,
          },
        });

        for (const createdTodo of createdTodos) {
          const newTodo = await todoRepository.findById({
            todoId: createdTodo.todoId,
            userId,
          });

          expect(newTodo?.updatedAt.getTime()).toBeGreaterThan(
            createdTodo.updatedAt.getTime(),
          );
        }
      });

      it('should preserve other todo properties when reordering', async () => {
        const createdTodos = await createTodoList({
          limit: 3,
          todoRepository,
          userId,
        });

        const newTodos = createdTodos.map((item) => ({
          todoId: item.todoId,
          order: item.order + 100,
        }));

        await sut.execute({
          data: {
            userId,
            todos: newTodos,
          },
        });

        for (const createdTodo of createdTodos) {
          const updatedTodo = await todoRepository.findById({
            todoId: createdTodo.todoId,
            userId,
          });

          expect(updatedTodo?.title).toBe(createdTodo.title);
          expect(updatedTodo?.completedAt).toBe(createdTodo.completedAt);
          expect(updatedTodo?.createdAt).toBe(createdTodo.createdAt);
        }
      });
    });

    describe('[failure cases]', () => {
      it('should throw ExistingOrderError when todos have duplicated orders', async () => {
        const createdTodos = await createTodoList({
          limit: 3,
          todoRepository,
          userId,
        });

        const duplicatedOrder = 1000;
        const newTodos = createdTodos.map((item) => ({
          todoId: item.todoId,
          order: duplicatedOrder,
        }));

        await expect(
          sut.execute({
            data: {
              userId,
              todos: newTodos,
            },
          }),
        ).rejects.toThrowError(ExistingOrderError);
      });

      it('should not reorder a non-existing todo', async () => {
        const createdTodos = await createTodoList({
          limit: 3,
          todoRepository,
          userId,
        });

        const newTodos = createdTodos.map((item) => ({
          todoId: 'non-existing-todo-id',
          order: item.order + 100,
        }));

        await expect(
          sut.execute({
            data: {
              userId,
              todos: newTodos,
            },
          }),
        ).rejects.toThrowError(ResourceNotFoundError);
      });

      it('should not allow to reorder when a todo belongs to another user', async () => {
        const anotherTodo = await todoRepository.create({
          title: 'Another user todo',
          userId: 'another-existing-user-id',
        });

        await expect(
          sut.execute({
            data: {
              todos: [
                {
                  todoId: anotherTodo.todoId,
                  order: anotherTodo.order + 100,
                },
              ],
              userId,
            },
          }),
        ).rejects.toThrow(ResourceNotFoundError);
      });
    });

    describe('[edge cases]', () => {
      it('should handle empty todos array', async () => {
        await expect(
          sut.execute({
            data: {
              userId,
              todos: [],
            },
          }),
        ).resolves.not.toThrow();
      });

      it('should handle reordering single todo', async () => {
        const createdTodo = await todoRepository.create({
          title: 'Single todo',
          userId,
        });

        await sut.execute({
          data: {
            userId,
            todos: [
              {
                todoId: createdTodo.todoId,
                order: 100,
              },
            ],
          },
        });

        const updatedTodo = await todoRepository.findById({
          todoId: createdTodo.todoId,
          userId,
        });

        expect(updatedTodo?.order).toBe(100);
      });
    });
  });
});
