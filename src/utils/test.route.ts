import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { expect } from 'vitest';

import { app } from '@/app';
import { load } from '@/config/env';
import type { ApiLoginBody, ApiRegisterBody } from '@/schemas/auth';
import type { ApiCreateTodoBody, ApiUpdateTodoBody } from '@/schemas/todo';
import { makeTodoRepository, makeUserRepository } from '@/utils/factory';
import { isIsoDate, isUUID } from '@/utils/test';
import type { TodoDto } from '@/dtos/todo';
import type { TodoStats } from '@/entities';

export const env = load('test');

export type SuperTestAgent = Awaited<ReturnType<typeof getAuthenticatedAgent>>;

/* Auth endpoints */
export const AUTH_BASE_ROUTE = '/api/auth';
export const registerEndpoint = '/api/auth/register';
export const loginEndpoint = '/api/auth/login';
export const logoutEndpoint = '/api/auth/logout';
export const refreshEndpoint = '/api/auth/refresh';
export const profileEndpoint = '/api/auth/me';

/* Todo endpoints */
export const TODOS_BASE_ROUTE = '/api/todos';

export function newApiRegisterBody(
  options: {
    includeLeadingWhiteSpace: boolean;
    includeTrailingWhiteSpace: boolean;
  } = {
    includeLeadingWhiteSpace: false,
    includeTrailingWhiteSpace: false,
  },
): ApiRegisterBody {
  let name = 'John Doe';
  let email = 'johndoe@example.com';
  let password = 'johnDoe1234';
  const emptySpace = '    ';

  const { includeLeadingWhiteSpace, includeTrailingWhiteSpace } = options;

  if (includeLeadingWhiteSpace) {
    name = `${emptySpace}${name}`;
    email = `${emptySpace}${email}`;
    password = `${emptySpace}${password}`;
  }

  if (includeTrailingWhiteSpace) {
    name = `${name}${emptySpace}`;
    email = `${email}${emptySpace}`;
    password = `${password}${emptySpace}`;
  }

  return {
    name,
    email,
    password,
  };
}

export function newApiCreateTodoBody(
  options: {
    includeLeadingWhiteSpace: boolean;
    includeTrailingWhiteSpace: boolean;
  } = {
    includeLeadingWhiteSpace: false,
    includeTrailingWhiteSpace: false,
  },
): ApiCreateTodoBody {
  let title = 'My todo';
  const emptySpace = '    ';

  const { includeLeadingWhiteSpace, includeTrailingWhiteSpace } = options;

  if (includeLeadingWhiteSpace) {
    title = `${emptySpace}${title}`;
  }

  if (includeTrailingWhiteSpace) {
    title = `${title}${emptySpace}`;
  }

  return {
    title,
  };
}

export function newApiUpdateTodoBody(
  options: {
    includeLeadingWhiteSpace: boolean;
    includeTrailingWhiteSpace: boolean;
  } = {
    includeLeadingWhiteSpace: false,
    includeTrailingWhiteSpace: false,
  },
): ApiUpdateTodoBody {
  let title = 'My new todo';
  const order = 100;

  const emptySpace = '    ';

  const { includeLeadingWhiteSpace, includeTrailingWhiteSpace } = options;

  if (includeLeadingWhiteSpace) {
    title = `${emptySpace}${title}`;
  }

  if (includeTrailingWhiteSpace) {
    title = `${title}${emptySpace}`;
  }

  return {
    title,
    order,
  };
}

export function newApiLoginBody(): ApiLoginBody {
  return {
    email: 'johndoe@example.com',
    password: 'johnDoe1234',
  };
}

export async function cleanup() {
  await makeTodoRepository().clear();
  await makeUserRepository().clear();
}

export function expectSuccess(response: supertest.Response) {
  expect(response.body.success).toBe(true);
}

export function expectResultsWithLength(
  response: supertest.Response,
  length: number,
) {
  expect(response.body.data.results).toHaveLength(length);
}

export function expectAuthCookie(response: supertest.Response) {
  const cookies = response.headers['set-cookie'] as unknown as string[];

  expect(cookies.length).toBeGreaterThan(0);

  const authCookie = cookies.find((cookie) =>
    cookie.startsWith('accessToken='),
  );

  expect(typeof authCookie).toBe('string');
  expect(authCookie).toContain('HttpOnly');
  expect(authCookie).toContain('Path=/');
}

export function expectCreatedTodoWithBody(
  response: supertest.Response,
  data: ApiCreateTodoBody,
) {
  expectSuccess(response);
  expectResultsWithLength(response, 1);

  const createdTodo = response.body.data.results[0];

  expect(createdTodo.title).toBe(data.title);
  expect(isUUID(createdTodo.todoId)).toBe(true);
  expect(createdTodo.order).toBeGreaterThanOrEqual(0);
  expect(isIsoDate(createdTodo.createdAt)).toBe(true);
  expect(isIsoDate(createdTodo.updatedAt)).toBe(true);
}

export function expectUpdatedTodoWithBody(
  response: supertest.Response,
  data: ApiUpdateTodoBody,
) {
  const updatedTodo = response.body.data.results[0];

  expect(updatedTodo.title).toBe(data.title);
  expect(isUUID(updatedTodo.todoId)).toBe(true);
  expect(updatedTodo.order).toBeGreaterThanOrEqual(0);
  expect(isIsoDate(updatedTodo.createdAt)).toBe(true);
  expect(isIsoDate(updatedTodo.updatedAt)).toBe(true);

  if (typeof data.order === 'number') {
    expect(updatedTodo.order).toBe(data.order);
  } else {
    expect(updatedTodo.order).toBeGreaterThanOrEqual(0);
  }
}

export function expectTodoStats(response: supertest.Response, data: TodoStats) {
  expectSuccess(response);
  expectResultsWithLength(response, 1);

  const todoStats = response.body.data.results[0];

  expect(todoStats).toStrictEqual({
    total: data.total,
    completed: data.completed,
    active: data.active,
  });
}

export function expectValidationError(
  response: supertest.Response,
  field: string,
) {
  expect(response.body.success).toBe(false);
  expect(response.body.data.error[field].errors).toBeInstanceOf(Array);
}

export function expectError(response: supertest.Response) {
  expect(response.body.success).toBe(false);
  expect(typeof response.body.data.error.message).toBe('string');
}

export async function registerAndLogin(
  options: {
    registerData?: ApiRegisterBody;
    registerStatus?: number;
    loginStatus?: number;
  } = {},
) {
  const {
    registerData = newApiRegisterBody(),
    registerStatus = StatusCodes.CREATED,
    loginStatus = StatusCodes.OK,
  } = options;

  const loginData = {
    email: registerData.email,
    password: registerData.password,
  };

  await supertest(app)
    .post(registerEndpoint)
    .send(registerData)
    .expect(registerStatus);

  const response = await supertest(app)
    .post(loginEndpoint)
    .send(loginData)
    .expect(loginStatus);

  return { registerData, loginData, response };
}

export async function getAuthenticatedAgent() {
  const agent = supertest.agent(app);

  const registerData = newApiRegisterBody();
  const { email, password } = registerData;

  await agent
    .post(registerEndpoint)
    .send(registerData)
    .expect(StatusCodes.CREATED);

  await agent
    .post(loginEndpoint)
    .send({ email, password })
    .expect(StatusCodes.OK);

  return agent;
}

export async function getCreatedTodo(
  agent: SuperTestAgent,
  data = newApiCreateTodoBody(),
) {
  const response = await agent
    .post(TODOS_BASE_ROUTE)
    .send(data)
    .expect(StatusCodes.CREATED);

  expectSuccess(response);
  expectResultsWithLength(response, 1);

  const createdTodo = response.body.data.results[0];

  return createdTodo as TodoDto;
}

export async function getCompletedTodo(
  agent: SuperTestAgent,
  data = newApiCreateTodoBody(),
) {
  const createdTodo = await getCreatedTodo(agent, data);

  const response = await agent
    .patch(`${TODOS_BASE_ROUTE}/${createdTodo.todoId}/completed`)
    .expect(StatusCodes.OK);

  expectSuccess(response);
  expectResultsWithLength(response, 1);

  const completedTodo = response.body.data.results[0] as TodoDto;

  return completedTodo;
}
