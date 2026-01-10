import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach, expect } from 'vitest';

import { app } from '@/app';
import type { TodoDto } from '@/dtos/todo';
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

describe(`PATCH ${TODOS_BASE_ROUTE}/:todoId/completed`, () => {
  let agent: SuperTestAgent;
  let createdTodo: TodoDto;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
    createdTodo = await getCreatedTodo(agent);
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 200 and set completedAt when todo is initially incomplete', async () => {
      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}/completed`)
        .expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const updatedTodo = response.body.data.results[0];

      expect(updatedTodo).toStrictEqual({
        ...createdTodo,
        updatedAt: updatedTodo.updatedAt,
        completedAt: updatedTodo.completedAt,
      });
    });

    it('should return 200 and unset completedAt when todo is already completed', async () => {
      await agent
        .patch(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}/completed`)
        .expect(StatusCodes.OK);

      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}/completed`)
        .expect(StatusCodes.OK);

      const updatedTodo = response.body.data.results[0];
      expect(updatedTodo.completedAt).toBeNullable();
    });
  });

  describe('validation errors', () => {
    describe('params validation', () => {
      describe('todoId', () => {
        it('should return 422 when todoId is not a valid UUID', async () => {
          const invalidTodoId = 'invalid-todo-id';

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${invalidTodoId}/completed`)
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todoId');
        });
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .patch(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}/completed`)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });

    it('should return 404 when todo does not exist', async () => {
      const nonExistingTodoId = uuid();

      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${nonExistingTodoId}/completed`)
        .expect(StatusCodes.NOT_FOUND);

      expectError(response);
    });
  });
});
