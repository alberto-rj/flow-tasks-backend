import {
  InMemoryTodoRepository,
  InMemoryUserRepository,
  type TodoRepository,
  type UserRepository,
} from '@/repositories';

type RepositoryType = 'pg' | 'in-memory';

export function createUserRepository(
  type: RepositoryType = 'pg',
): UserRepository {
  if (type === 'in-memory') {
    return new InMemoryUserRepository();
  }
  return new InMemoryUserRepository();
}

export function createTodoRepository(
  type: RepositoryType = 'pg',
): TodoRepository {
  if (type === 'in-memory') {
    return new InMemoryTodoRepository();
  }
  return new InMemoryTodoRepository();
}
