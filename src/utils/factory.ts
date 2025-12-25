import { InMemoryUserRepository, type UserRepository } from '@/repositories';

type RepositoryType = 'pg' | 'in-memory';

export function createUserRepository(
  type: RepositoryType = 'pg',
): UserRepository {
  if (type === 'in-memory') {
    return new InMemoryUserRepository();
  }
  return new InMemoryUserRepository();
}
