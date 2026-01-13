import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectTodoList,
  expectValidationError,
  getAuthenticatedAgent,
  getCreatedTodo,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';
import { uuid } from '@/utils/uuid';

describe(`GET ${TODOS_BASE_ROUTE}/:todoId`, () => {
  let agent: SuperTestAgent;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 200 and the todo resource', async () => {
      const createdTodo = await getCreatedTodo(agent);

      const response = await agent
        .get(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}`)
        .expect(StatusCodes.OK);

      expectTodoList(response, [createdTodo]);
    });
  });

  describe('validation errors', () => {
    describe('params validation', () => {
      describe('todoId', () => {
        it('should return 422 when todoId is not a valid UUID', async () => {
          const invalidTodoId = 'invalid-todo-id';

          const response = await agent
            .delete(`${TODOS_BASE_ROUTE}/${invalidTodoId}`)
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todoId');
        });
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const createdTodo = await getCreatedTodo(agent);

      const response = await supertest(app)
        .delete(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}`)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });

    it('should return 404 when todo does not exist', async () => {
      const nonExistingTodoId = uuid();

      const response = await agent
        .delete(`${TODOS_BASE_ROUTE}/${nonExistingTodoId}`)
        .expect(StatusCodes.NOT_FOUND);

      expectError(response);
    });
  });
});
