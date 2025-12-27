import { randomUUID } from 'node:crypto';

import { load } from '@/config/env';
import type { RegisterDto } from '@/dtos/auth';
import type { TodoCreateDto } from '@/dtos/todo';
import {
  createTodoRepository,
  createUserRepository as factoryCreateUserRepository,
} from './factory';
import { isoDateSchema } from './schemas';

export const env = load('test');

export function createRegisterDto(): RegisterDto {
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'johnDoe#$@1234',
  };
}

export function newTodoCreateDto(): TodoCreateDto {
  return {
    title: 'Learn TypeScript',
    userId: randomUUID(),
  };
}

export function createUserRepository() {
  return factoryCreateUserRepository('in-memory');
}

export function newTodoRepository() {
  return createTodoRepository('in-memory');
}

export function isJWT(value: string) {
  const regex = /^[\w-]+\.[\w-]+\.[\w-]+$/;
  return regex.test(value);
}

export function isIsoDate(value: unknown) {
  const result = isoDateSchema.safeParse(value);
  return result.success;
}
