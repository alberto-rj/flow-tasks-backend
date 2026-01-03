import {
  InMemoryTodoRepository,
  InMemoryUserRepository,
  type TodoRepository,
  type UserRepository,
} from '@/repositories';
import {
  LoginUseCase,
  ProfileUseCase,
  RegisterUseCase,
} from '@/use-cases/auth';

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

export function createRegisterUseCase(
  userRepository: UserRepository = createUserRepository(),
) {
  return new RegisterUseCase(userRepository);
}

export function createLoginUseCase(
  userRepository: UserRepository = createUserRepository(),
) {
  return new LoginUseCase(userRepository);
}

export function createProfileUseCase(
  userRepository: UserRepository = createUserRepository(),
) {
  return new ProfileUseCase(userRepository);
}
