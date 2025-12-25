import type { RegisterDto } from '@/dtos/auth';
import type { UserRepository } from '@/repositories';
import { createUserRepository as factoryCreateUserRepository } from './factory';
import { load } from '@/config/env';

export const env = load('test');

export function createRegisterDto(): RegisterDto {
  return {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'jd#$@p1234',
  };
}

export function createUserRepository(): UserRepository {
  return factoryCreateUserRepository('in-memory');
}
