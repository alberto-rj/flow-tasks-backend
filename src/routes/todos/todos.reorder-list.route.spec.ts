import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach, expect } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  expectValidationError,
  getAuthenticatedAgent,
  getCreatedTodo,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';
import { uuid } from '@/utils/uuid';
import type { TodoDto } from '@/dtos/todo';

async function getItemsToReorder(agent: SuperTestAgent, limit: number) {
  const newItems: TodoDto[] = [];

  for (let i = 0; i < limit; i++) {
    const item = await getCreatedTodo(agent);
    newItems.push(item);
  }

  return newItems.map(({ todoId, order }) => ({
    todoId,
    order: order + 100,
  }));
}

function expectItemsReordered(
  response: supertest.Response,
  itemsToReorder: Awaited<ReturnType<typeof getItemsToReorder>>,
) {
  expectSuccess(response);
  expectResultsWithLength(response, itemsToReorder.length);

  const itemsReordered = response.body.data.results as TodoDto[];

  itemsToReorder.forEach((itemToReorder) => {
    const itemReordered = itemsReordered.find(
      (item) => item.todoId === itemToReorder.todoId,
    );

    expect(itemReordered?.todoId).toBe(itemToReorder.todoId);
    expect(itemReordered?.order).toBe(itemToReorder.order);
  });
}

describe(`PATCH ${TODOS_BASE_ROUTE} (reorder todos)`, () => {
  let agent: SuperTestAgent;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 204 and update the todo orders', async () => {
      const totalItems = 3;
      const itemsToReorder = await getItemsToReorder(agent, totalItems);

      await agent
        .patch(TODOS_BASE_ROUTE)
        .send({ todos: itemsToReorder })
        .expect(StatusCodes.NO_CONTENT);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.OK);

      expectItemsReordered(response, itemsToReorder);
    });
  });

  describe('validation errors', () => {
    describe('body validation', () => {
      describe('todoId', () => {
        it('should return 422 when a todoId is not provided', async () => {
          const totalItems = 3;

          const itemsToReorder = (await getItemsToReorder(agent, totalItems))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ todoId, ...itemWithoutTodoIdProps }) => ({
              ...itemWithoutTodoIdProps,
            }));

          const response = await agent
            .patch(TODOS_BASE_ROUTE)
            .send({ todos: itemsToReorder })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todos');
        });

        it('should return 422 when a todoId is not valid UUID', async () => {
          const totalItems = 3;
          const invalidTodoId = 'invalid-todo-id';

          const itemsToReorder = (
            await getItemsToReorder(agent, totalItems)
          ).map((item) => ({ ...item, todoId: invalidTodoId }));

          const response = await agent
            .patch(TODOS_BASE_ROUTE)
            .send({ todos: itemsToReorder })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todos');
        });
      });

      describe('order', () => {
        it('should return 422 when a order is not provided', async () => {
          const totalItems = 3;

          const itemsToReorder = (await getItemsToReorder(agent, totalItems))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ order, ...itemWithoutOrder }) => ({ ...itemWithoutOrder }));

          const response = await agent
            .patch(TODOS_BASE_ROUTE)
            .send({ todos: itemsToReorder })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todos');
        });

        it('should return 422 when a order is not a non-negative integer', async () => {
          const totalItems = 3;
          const unexpectedOrderType = -1;

          const itemsToReorder = (
            await getItemsToReorder(agent, totalItems)
          ).map((item) => ({ ...item, order: unexpectedOrderType }));

          const response = await agent
            .patch(TODOS_BASE_ROUTE)
            .send({ todos: itemsToReorder })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todos');
        });
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .patch(TODOS_BASE_ROUTE)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });

    it('should return 409 when trying to reorder a todo with duplicated or existing order for a user', async () => {
      const duplicatedOrder = 20;
      const totalItems = 3;

      const itemsToReorder = (await getItemsToReorder(agent, totalItems)).map(
        (item) => ({ ...item, order: duplicatedOrder }),
      );

      const response = await agent
        .patch(TODOS_BASE_ROUTE)
        .send({ todos: itemsToReorder })
        .expect(StatusCodes.CONFLICT);

      expectError(response);
    });

    it('should return 404 when there is a non-existing todo', async () => {
      const nonExistingTodoId = uuid();
      const totalItems = 3;

      const itemsToReorder = (await getItemsToReorder(agent, totalItems)).map(
        (item) => ({ ...item, todoId: nonExistingTodoId }),
      );

      const response = await agent
        .patch(TODOS_BASE_ROUTE)
        .send({ todos: itemsToReorder })
        .expect(StatusCodes.NOT_FOUND);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    it('should return 204 and do nothing when providing an empty array', async () => {
      const totalItems = 0;
      const itemsToReorder = await getItemsToReorder(agent, totalItems);

      await agent
        .patch(TODOS_BASE_ROUTE)
        .send({ todos: itemsToReorder })
        .expect(StatusCodes.NO_CONTENT);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.OK);

      expectItemsReordered(response, itemsToReorder);
    });

    it('should return 204 and do reordering when proving a single todo', async () => {
      const totalItems = 1;
      const itemsToReorder = await getItemsToReorder(agent, totalItems);

      await agent
        .patch(TODOS_BASE_ROUTE)
        .send({ todos: itemsToReorder })
        .expect(StatusCodes.NO_CONTENT);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.OK);

      expectItemsReordered(response, itemsToReorder);
    });
  });
});
