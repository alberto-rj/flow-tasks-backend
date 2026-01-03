import {
  GlobalTodoRepository,
  GlobalUserRepository,
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

type RepositoryType = 'pg' | 'in-memory' | 'global';

const defaultUserRepository: RepositoryType = 'global';
const defaultTodoRepository: RepositoryType = 'global';

export function createUserRepository(
  type: RepositoryType = defaultUserRepository,
): UserRepository {
  if (type === 'in-memory') {
    return new InMemoryUserRepository();
  }
  if (type === 'global') {
    return new GlobalUserRepository();
  }
  return new GlobalUserRepository();
}

export function createTodoRepository(
  type: RepositoryType = defaultTodoRepository,
): TodoRepository {
  if (type === 'in-memory') {
    return new InMemoryTodoRepository();
  }
  if (type === 'global') {
    return new GlobalTodoRepository();
  }
  return new GlobalTodoRepository();
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
