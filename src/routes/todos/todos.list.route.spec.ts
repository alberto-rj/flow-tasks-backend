import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach, expect } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectTodoList,
  expectTodoListSorted,
  expectValidationError,
  getAuthenticatedAgent,
  getCompletedTodoList,
  getCreatedTodoList,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';
import { newString } from '@/utils/test';

describe(`GET ${TODOS_BASE_ROUTE}`, () => {
  let agent: SuperTestAgent;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    describe('filtering by status', () => {
      it('should return 200 and only active todos when filter is "active"', async () => {
        const activeTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=active`)
          .expect(StatusCodes.OK);

        expectTodoList(response, activeTodos);
      });

      it('should return 200 and all todos when filter is "all"', async () => {
        const activeTodos = await getCreatedTodoList(agent, 1);
        const completedTodos = await getCompletedTodoList(agent, 2);
        const mixedTodos = [...activeTodos, ...completedTodos];

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all`)
          .expect(StatusCodes.OK);

        expectTodoList(response, mixedTodos);
      });

      it('should return 200 and only completed todos when filter is "completed"', async () => {
        await getCreatedTodoList(agent, 1);
        const completedTodos = await getCompletedTodoList(agent, 2);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=completed`)
          .expect(StatusCodes.OK);

        expectTodoList(response, completedTodos);
      });
    });

    describe('search by query', () => {
      it('should return 200 and matching todos when searching by title (case-insensitive)', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);
        const myQuery = 'Y To';

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&query=${myQuery}`)
          .expect(StatusCodes.OK);

        expectTodoList(response, createdTodos);
      });

      it('should return 200 and no todos when no items match the query', async () => {
        await getCreatedTodoList(agent, 3);
        const myQuery = 'no-todo-match-this';

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&query=${myQuery}`)
          .expect(StatusCodes.OK);

        expectTodoList(response, []);
      });
    });

    describe('when sort by title', () => {
      it('should return 200 and todos sorted by title in ascending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=title&order=asc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(prev.title.localeCompare(current.title)).toBeLessThanOrEqual(
            0,
          );
        });
      });

      it('should return 200 and todos sorted by title in descending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=title&order=desc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(
            prev.title.localeCompare(current.title),
          ).toBeGreaterThanOrEqual(0);
        });
      });
    });

    describe('when sorting by order', () => {
      it('should return 200 and todos sorted by order in ascending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=order&order=asc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(prev.order).toBeLessThan(current.order);
        });
      });

      it('should return 200 and todos sorted by order in descending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=order&order=desc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(prev.order).toBeGreaterThan(current.order);
        });
      });
    });

    describe('when sorting by createdAt', () => {
      it('should return 200 and todos sorted by createdAt in ascending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=createdAt&order=asc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(new Date(prev.createdAt).getTime()).toBeLessThanOrEqual(
            new Date(current.createdAt).getTime(),
          );
        });
      });

      it('should return 200 and todos sorted by createdAt in descending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=createdAt&order=desc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(new Date(prev.createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(current.createdAt).getTime(),
          );
        });
      });
    });

    describe('when sorting by updatedAt', () => {
      it('should return 200 and todos sorted by updatedAt in ascending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=updatedAt&order=asc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(new Date(prev.updatedAt).getTime()).toBeLessThanOrEqual(
            new Date(current.updatedAt).getTime(),
          );
        });
      });

      it('should return 200 and todos sorted by updatedAt in descending order', async () => {
        const createdTodos = await getCreatedTodoList(agent, 3);

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=all&sortBy=updatedAt&order=desc`)
          .expect(StatusCodes.OK);

        expectTodoListSorted(response, createdTodos, (prev, current) => {
          expect(new Date(prev.updatedAt).getTime()).toBeGreaterThanOrEqual(
            new Date(current.updatedAt).getTime(),
          );
        });
      });
    });
  });

  describe('validation errors', () => {
    describe('query validation', () => {
      it('should return 422 when query exceeds 225 characters', async () => {
        const exceedQuery = newString({ length: 226 });

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?query=${exceedQuery}`)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'query');
      });

      it('should return 422 when filter is not one of "all", "completed" or "active"', async () => {
        const invalidFilter = 'invalid-filter';

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?filter=${invalidFilter}`)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'filter');
      });

      it('should return 422 when sortBy is not one of "title", "order", "createdAt" or "updatedAt"', async () => {
        const invalidSortBy = 'invalid-sort-by';

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?sortBy=${invalidSortBy}`)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'sortBy');
      });

      it('should return 422 when order is not "asc" or "desc"', async () => {
        const invalidOrder = 'invalid-order';

        const response = await agent
          .get(`${TODOS_BASE_ROUTE}?order=${invalidOrder}`)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'order');
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .get(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    describe('query edge cases', () => {
      describe('filter', () => {
        it('should return 200 and all todos when filter is not provided', async () => {
          const activeTodos = await getCreatedTodoList(agent, 1);
          const completedTodos = await getCompletedTodoList(agent, 2);
          const mixedTodos = [...activeTodos, ...completedTodos];

          const response = await agent
            .get(`${TODOS_BASE_ROUTE}`)
            .expect(StatusCodes.OK);

          expectTodoList(response, mixedTodos);
        });

        it('should return 200 and no todos when user has no todos', async () => {
          const response = await agent
            .get(`${TODOS_BASE_ROUTE}?filter=all`)
            .expect(StatusCodes.OK);

          expectTodoList(response, []);
        });

        it('should return 200 and no todos when there are no completed todos', async () => {
          await getCreatedTodoList(agent, 3);

          const response = await agent
            .get(`${TODOS_BASE_ROUTE}?filter=completed`)
            .expect(StatusCodes.OK);

          expectTodoList(response, []);
        });

        it('should return 200 and no todos when there are no active todos', async () => {
          await getCompletedTodoList(agent, 3);

          const response = await agent
            .get(`${TODOS_BASE_ROUTE}?filter=active`)
            .expect(StatusCodes.OK);

          expectTodoList(response, []);
        });
      });
    });
  });
});
