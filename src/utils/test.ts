import { randomUUID } from 'node:crypto';

import { load } from '@/config/env';
import type { RegisterDto } from '@/dtos/auth';
import type { TodoCreateDto } from '@/dtos/todo';
import {
  createTodoRepository,
  createUserRepository as factoryCreateUserRepository,
} from './factory';
import { isoDateSchema } from './schemas';
import type { TodoRepository } from '@/repositories';
import type { Todo } from '@/entities';

export const env = load('test');

type CreateTodoListParams = {
  todoRepository: TodoRepository;
  userId: string;
  limit?: number;
  title?: string;
  prefix?: string;
  suffix?: string;
  canCompleteEven?: boolean;
  canCompleteOdd?: boolean;
};

export async function createTodoList({
  todoRepository,
  userId,
  limit = 10,
  canCompleteEven = false,
  canCompleteOdd = false,
  title = 'Todo',
  prefix = '',
  suffix = '',
}: CreateTodoListParams): Promise<Todo[]> {
  const items: Todo[] = [];

  for (let i = 0; i < limit; i++) {
    const item = await todoRepository.create({
      title: `${prefix}${title} ${i + 1}${suffix}`,
      userId,
    });

    if (canCompleteEven && i % 2 === 0) {
      await todoRepository.completeById({ id: item.id, userId });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.completeById({ id: item.id, userId });
    }

    items.push(item);
  }

  return items;
}

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
