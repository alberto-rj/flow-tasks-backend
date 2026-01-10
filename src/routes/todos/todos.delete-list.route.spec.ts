import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectTodoStats,
  expectValidationError,
  getAuthenticatedAgent,
  getCompletedTodo,
  getCreatedTodo,
  getTodoStatsResponse,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';

describe(`DELETE ${TODOS_BASE_ROUTE}`, () => {
  let agent: SuperTestAgent;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 204 and remove all active and completed todos when filter is "all"', async () => {
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);
      await getCompletedTodo(agent);

      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 0, active: 0, completed: 0 });
    });

    it('should return 204 and remove only active todos when filter is "active"', async () => {
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);
      await getCompletedTodo(agent);

      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=active`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 1, active: 0, completed: 1 });
    });

    it('should return 204 and remove only completed todos when filter is "completed"', async () => {
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);
      await getCompletedTodo(agent);

      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=completed`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 2, active: 2, completed: 0 });
    });
  });

  describe('validation errors', () => {
    describe('query validation', () => {
      describe('filter', () => {
        it('should return 422 when filter is not "all", "completed" or "active"', async () => {
          const invalidFilter = 'invalid-filter';

          const response = await agent
            .delete(`${TODOS_BASE_ROUTE}?filter=${invalidFilter}`)
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'filter');
        });
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .delete(`${TODOS_BASE_ROUTE}?filter=all`)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    it('should return 204 and remove completed todos by default when filter is not provided', async () => {
      await getCreatedTodo(agent);
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);

      await agent.delete(`${TODOS_BASE_ROUTE}`).expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 1, active: 1, completed: 0 });
    });

    it('should return 204 and do nothing when user has no todos', async () => {
      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=completed`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 0, active: 0, completed: 0 });
    });

    it('should return 204 and do nothing when trying to delete completed todos but user has none', async () => {
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);

      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=completed`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 3, active: 3, completed: 0 });
    });

    it('should return 204 and do nothing when trying to delete active todos but user has none', async () => {
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);

      await agent
        .delete(`${TODOS_BASE_ROUTE}?filter=active`)
        .expect(StatusCodes.NO_CONTENT);

      const response = await getTodoStatsResponse(agent);

      expectTodoStats(response, { total: 3, active: 0, completed: 3 });
    });
  });
});
