import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectTodoStats,
  getAuthenticatedAgent,
  getCompletedTodo,
  getCreatedTodo,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';

describe(`GET ${TODOS_BASE_ROUTE}/stats`, () => {
  let agent: SuperTestAgent;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 200 and correct stats when there is only active todos', async () => {
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);
      await getCreatedTodo(agent);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}/stats`)
        .expect(StatusCodes.OK);

      expectTodoStats(response, {
        total: 3,
        completed: 0,
        active: 3,
      });
    });

    it('should return 200 and correct stats for mixed todos', async () => {
      await getCreatedTodo(agent);
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}/stats`)
        .expect(StatusCodes.OK);

      expectTodoStats(response, {
        total: 3,
        completed: 2,
        active: 1,
      });
    });

    it('should return 200 and correct stats when there is only completed todos', async () => {
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);
      await getCompletedTodo(agent);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}/stats`)
        .expect(StatusCodes.OK);

      expectTodoStats(response, {
        total: 3,
        completed: 3,
        active: 0,
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .get(`${TODOS_BASE_ROUTE}/stats`)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    it('should return zero stats when user has no todos', async () => {
      const response = await agent
        .get(`${TODOS_BASE_ROUTE}/stats`)
        .expect(StatusCodes.OK);

      expectTodoStats(response, {
        total: 0,
        completed: 0,
        active: 0,
      });
    });
  });
});
