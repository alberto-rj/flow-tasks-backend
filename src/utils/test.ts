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
        id: createdItem.id,
        userId: createdItem.userId,
      });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.toggleById({
        id: createdItem.id,
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
        id: createdItem.id,
        userId,
      });
    }

    if (canCompleteOdd && i % 2 !== 0) {
      await todoRepository.toggleById({
        id: createdItem.id,
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
