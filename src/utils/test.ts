import { load } from '@/config/env';
import type { RegisterDto } from '@/dtos/auth';
import type { UserRepository } from '@/repositories';
import { createUserRepository as factoryCreateUserRepository } from './factory';

export const env = load('test');

export function createRegisterDto(): RegisterDto {
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'johnDoe#$@1234',
  };
}

export function createUserRepository(): UserRepository {
  return factoryCreateUserRepository('in-memory');
}

export function isJWT(value: string) {
  const regex = /^[\w-]+\.[\w-]+\.[\w-]+$/;
  return regex.test(value);
}
