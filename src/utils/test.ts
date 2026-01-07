import supertest from 'supertest';
import { expect } from 'vitest';

import { load } from '@/config/env';
import type { RegisterDto } from '@/dtos/auth';
import type { TodoCreateDto } from '@/dtos/todo';
import type { Todo } from '@/entities';
import type { TodoRepository } from '@/repositories';
import type { ApiLoginBody, ApiRegisterBody } from '@/schemas/auth';
import { makeTodoRepository, makeUserRepository } from './factory';
import { isoDateSchema, uuidSchema } from './schemas';
import { uuid } from './uuid';
import { app } from '@/app';

export const env = load('test');

export const registerEndpoint = '/api/auth/register';
export const loginEndpoint = '/api/auth/login';
export const logoutEndpoint = '/api/auth/logout';
export const refreshEndpoint = '/api/auth/refresh';
export const profileEndpoint = '/api/auth/me';

type CreateTodoListParams = {
  todoRepository: TodoRepository;
  userId: string;
  limit?: number;
  title?: string;
  canCompleteEven?: boolean;
  canCompleteOdd?: boolean;
};

type CreateDetailedTodoListParams = {
  todoRepository: TodoRepository;
  items: TodoCreateDto[];
  canCompleteEven?: boolean;
  canCompleteOdd?: boolean;
};

export async function createDetailedTodoList({
  todoRepository,
  items,
  canCompleteEven = false,
  canCompleteOdd = false,
}: CreateDetailedTodoListParams): Promise<Todo[]> {
  const newItems: Todo[] = [];

  for (let i = 0; i < items.length; i++) {
    const newItem: TodoCreateDto = items[i] as TodoCreateDto;
    const createdItem = await todoRepository.create(newItem);

    if (canCompleteEven && i % 2 === 0) {
      await todoRepository.toggleById({
        todoId: createdItem.todoId,
        userId: createdItem.userId,
      });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.toggleById({
        todoId: createdItem.todoId,
        userId: createdItem.userId,
      });
    }

    newItems.push(createdItem);

    await sleep();
  }

  return newItems;
}

export async function createTodoList({
  todoRepository,
  userId,
  limit = 10,
  title = 'Todo',
  canCompleteEven = false,
  canCompleteOdd = false,
}: CreateTodoListParams): Promise<Todo[]> {
  const newItems: Todo[] = [];

  for (let i = 0; i < limit; i++) {
    const newItem: TodoCreateDto = {
      title: `${title} ${i + 1}`,
      userId,
    };
    const createdItem = await todoRepository.create(newItem);

    if (canCompleteEven && i % 2 === 0) {
      await todoRepository.toggleById({
        todoId: createdItem.todoId,
        userId,
      });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.toggleById({
        todoId: createdItem.todoId,
        userId,
      });
    }

    newItems.push(createdItem);

    await sleep();
  }

  return newItems;
}

export async function sleep() {
  const begin = 10;
  const end = 15;
  const delay = Math.floor(begin + Math.random() * (end - begin + 1));
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function newString({
  length,
  includeLowercase = true,
  includeUppercase = true,
  includeSymbols = false,
  includeDigits = false,
}: {
  length: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeDigits?: boolean;
  includeSymbols?: boolean;
}) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '#@-<>()[],.?!^';
  const baseStr = `${letters}${digits}${symbols}`;

  if (
    !includeLowercase &&
    !includeUppercase &&
    !includeDigits &&
    !includeSymbols
  ) {
    throw new Error(
      'randomString must include at least 1 character type: uppercase, lowercase, digit or symbols',
    );
  }

  let newStr = '';

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const symbolsRegex = /[#@\-<>()[\],\.\?!\^]/;

  for (let i = 0; i < length; ) {
    const charIndex = Math.floor(Math.random() * baseStr.length);
    let char = baseStr[charIndex] as string;

    if (lowercaseRegex.test(char) && !includeLowercase) {
      continue;
    } else if (uppercaseRegex.test(char) && !includeUppercase) {
      continue;
    } else if (digitRegex.test(char) && !includeDigits) {
      continue;
    } else if (symbolsRegex.test(char) && !includeSymbols) {
      continue;
    }

    if (lowercaseRegex.test(char)) {
      char = char.toLocaleUpperCase();
    }

    newStr += char;
    i++;
  }

  return newStr;
}

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

export function newApiLoginBody(): ApiLoginBody {
  return {
    email: 'johndoe@example.com',
    password: 'johnDoe1234',
  };
}

export function newRegisterDto(): RegisterDto {
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'johnDoe1234',
  };
}

export function newTodoCreateDto(): TodoCreateDto {
  return {
    title: 'Learn TypeScript',
    userId: uuid(),
  };
}

export function newUserRepository() {
  return makeUserRepository('in-memory');
}

export function newTodoRepository() {
  return makeTodoRepository('in-memory');
}

export function isJWT(value: string) {
  const regex = /^[\w-]+\.[\w-]+\.[\w-]+$/;
  return regex.test(value);
}

export function isIsoDate(value: unknown) {
  const result = isoDateSchema.safeParse(value);
  return result.success;
}

export function isUUID(value: unknown) {
  const result = uuidSchema.safeParse(value);
  return result.success;
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

export async function cleanup() {
  await makeTodoRepository().clear();
  await makeUserRepository().clear();
}

export async function getAuthenticatedAgent() {
  const agent = supertest.agent(app);

  await agent.post(registerEndpoint).send(newApiRegisterBody());

  await agent.post(loginEndpoint).send(newApiLoginBody());

  return agent;
}
