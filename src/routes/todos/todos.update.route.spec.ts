import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach } from 'vitest';

import { app } from '@/app';
import { newString } from '@/utils/test';
import {
  cleanup,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  expectUpdatedTodoWithBody,
  expectValidationError,
  getAuthenticatedAgent,
  getCreatedTodo,
  newApiUpdateTodoBody,
  TODOS_BASE_ROUTE,
  type SuperTestAgent,
} from '@/utils/test.route';
import { uuid } from '@/utils/uuid';

describe(`PATCH ${TODOS_BASE_ROUTE}/:todoId`, () => {
  let agent: SuperTestAgent;
  let todoId: string;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
    const createdTodo = await getCreatedTodo(agent);
    todoId = createdTodo.todoId;
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return 200 and the updated todo with correct structure', async () => {
      const updatingData = newApiUpdateTodoBody();

      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
        .send(updatingData)
        .expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      expectUpdatedTodoWithBody(response, updatingData);
    });

    it('should return 200 and trim leading and trailing spaces from the title before updating', async () => {
      const updatingDataWithWhiteSpace = newApiUpdateTodoBody({
        includeLeadingWhiteSpace: true,
        includeTrailingWhiteSpace: true,
      });

      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
        .send(updatingDataWithWhiteSpace)
        .expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      expectUpdatedTodoWithBody(response, {
        ...updatingDataWithWhiteSpace,
        title: updatingDataWithWhiteSpace.title.trim(),
      });
    });
  });

  describe('validation errors', () => {
    describe('body validation', () => {
      describe('title', () => {
        it('should return 422 when title is not provided', async () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { title, ...dataWithoutTitle } = newApiUpdateTodoBody();

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
            .send(dataWithoutTitle)
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'title');
        });

        it('should return 422 when title is not a string', async () => {
          const unexpectedTitleType = true;

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
            .send({ ...newApiUpdateTodoBody(), title: unexpectedTitleType })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'title');
        });

        it('should return 422 when title exceeds 225 characters', async () => {
          const exceededTitle = newString({ length: 226 });

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
            .send({ ...newApiUpdateTodoBody(), title: exceededTitle })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'title');
        });
      });

      describe('order', () => {
        it('should return 422 when order is not a non-negative integer', async () => {
          const unexpectedOrderType = true;

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
            .send({ ...newApiUpdateTodoBody(), order: unexpectedOrderType })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'order');
        });
      });
    });

    describe('params validation', () => {
      describe('todoId', () => {
        it('should return 422 when todoId is not a valid UUID', async () => {
          const invalidTodoId = 'invalid-id';

          const response = await agent
            .patch(`${TODOS_BASE_ROUTE}/${invalidTodoId}`)
            .send(newApiUpdateTodoBody())
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);

          expectValidationError(response, 'todoId');
        });
      });
    });
  });

  describe('business logic errors', () => {
    it('should return 401 when user is not authenticated', async () => {
      const response = await supertest(app)
        .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
        .send(newApiUpdateTodoBody())
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });

    it('should return 404 when todo does not exist', async () => {
      const nonExistingTodoId = uuid();

      const response = await agent
        .patch(`${TODOS_BASE_ROUTE}/${nonExistingTodoId}`)
        .send(newApiUpdateTodoBody())
        .expect(StatusCodes.NOT_FOUND);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    describe('title boundaries', () => {
      it('should return 200 and the updated todo when title length is exactly 1 character', async () => {
        const minTitle = newString({
          length: 1,
        });
        const updatingDataWithMinTitle = {
          ...newApiUpdateTodoBody(),
          title: minTitle,
        };

        const response = await agent
          .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
          .send(updatingDataWithMinTitle)
          .expect(StatusCodes.OK);

        expectUpdatedTodoWithBody(response, updatingDataWithMinTitle);
      });

      it('should return 200 and the updated todo when title length is exactly 225 characters', async () => {
        const maxTitle = newString({
          length: 225,
        });
        const updatingDataWithMaxTitle = {
          ...newApiUpdateTodoBody(),
          title: maxTitle,
        };

        const response = await agent
          .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
          .send(updatingDataWithMaxTitle)
          .expect(StatusCodes.OK);

        expectUpdatedTodoWithBody(response, updatingDataWithMaxTitle);
      });
    });

    describe('order', () => {
      it('should return 200 and the updated todo with preserved order when order is not provided', async () => {
        const updatingData = newApiUpdateTodoBody();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { order, ...dataWithoutOrder } = updatingData;

        const response = await agent
          .patch(`${TODOS_BASE_ROUTE}/${todoId}`)
          .send(dataWithoutOrder)
          .expect(StatusCodes.OK);

        expectUpdatedTodoWithBody(response, dataWithoutOrder);
      });
    });
  });
});
