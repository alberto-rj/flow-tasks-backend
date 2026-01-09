/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, afterEach, beforeEach } from 'vitest';

import { app } from '@/app';
import { newString } from '@/utils/test';
import {
  cleanup,
  expectCreatedTodo,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  expectValidationError,
  getAuthenticatedAgent,
  newApiCreateTodoBody,
  TODOS_CREATE_ROUTE,
} from '@/utils/test.route';

describe(`POST ${TODOS_CREATE_ROUTE}`, () => {
  let agent: Awaited<ReturnType<typeof getAuthenticatedAgent>>;

  beforeEach(async () => {
    agent = await getAuthenticatedAgent();
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return created todo with correct structure', async () => {
      const creationData = newApiCreateTodoBody();

      const response = await agent
        .post(TODOS_CREATE_ROUTE)
        .send(creationData)
        .expect(StatusCodes.CREATED);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      expectCreatedTodo(response, creationData);
    });

    it('should allow todo creation when title includes leading/trailing spaces', async () => {
      const creationDataWithWhiteSpace = newApiCreateTodoBody({
        includeLeadingWhiteSpace: true,
        includeTrailingWhiteSpace: true,
      });

      const response = await agent
        .post(TODOS_CREATE_ROUTE)
        .send(creationDataWithWhiteSpace)
        .expect(StatusCodes.CREATED);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      expectCreatedTodo(response, {
        ...creationDataWithWhiteSpace,
        title: creationDataWithWhiteSpace.title.trim(),
      });
    });
  });

  describe('validation errors', () => {
    describe('title', () => {
      it('should reject todo creation when title is missing', async () => {
        const { title, ...dataWithoutTitle } = newApiCreateTodoBody();

        const response = await agent
          .post(TODOS_CREATE_ROUTE)
          .send(dataWithoutTitle)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'title');
      });

      it('should reject todo creation when title is not a string', async () => {
        const unexpectedTitleType = true;

        const response = await agent
          .post(TODOS_CREATE_ROUTE)
          .send({ ...newApiCreateTodoBody(), title: unexpectedTitleType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'title');
      });

      it('should reject todo creation when title exceed 225 characters', async () => {
        const exceededTitle = newString({ length: 226 });

        const response = await agent
          .post(TODOS_CREATE_ROUTE)
          .send({ ...newApiCreateTodoBody(), title: exceededTitle })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'title');
      });
    });
  });

  describe('business logic errors', () => {
    it('should reject todo creation when user is not authenticated', async () => {
      const response = await supertest(app)
        .post(TODOS_CREATE_ROUTE)
        .send(newApiCreateTodoBody())
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    describe('title boundaries', () => {
      it('should allow todo creation when title length is exactly 1 character', async () => {
        const minTitle = newString({
          length: 1,
        });
        const creationDataWithMinTitle = {
          ...newApiCreateTodoBody(),
          title: minTitle,
        };

        const response = await agent
          .post(TODOS_CREATE_ROUTE)
          .send(creationDataWithMinTitle)
          .expect(StatusCodes.CREATED);

        expectCreatedTodo(response, creationDataWithMinTitle);
      });

      it('should allow todo creation when title length is exactly 225 characters', async () => {
        const maxTitle = newString({
          length: 225,
        });
        const creationDataWithMaxTitle = {
          ...newApiCreateTodoBody(),
          title: maxTitle,
        };

        const response = await agent
          .post(TODOS_CREATE_ROUTE)
          .send(creationDataWithMaxTitle)
          .expect(StatusCodes.CREATED);

        expectCreatedTodo(response, creationDataWithMaxTitle);
      });
    });
  });
});
