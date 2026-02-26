import {
  GlobalTodoRepository,
  GlobalUserRepository,
  InMemoryTodoRepository,
  InMemoryUserRepository,
  PgTodoRepository,
  PgUserRepository,
  type TodoRepository,
  type UserRepository,
} from '@/repositories';
import {
  LoginUseCase,
  ProfileUseCase,
  RegisterUseCase,
} from '@/use-cases/auth';
import {
  CreateTodoUseCase,
  DeleteTodoListUseCase,
  DeleteTodoUseCase,
  FindTodoUseCase,
  GetTodoStatsUseCase,
  ListTodoUseCase,
  ReorderTodoListUseCase,
  ToggleTodoUseCase,
  UpdateTodoUseCase,
} from '@/use-cases/todo';

type RepositoryType = 'pg' | 'in-memory' | 'global';

const defaultUserRepository: RepositoryType = 'pg';
const defaultTodoRepository: RepositoryType = 'pg';

export function makeUserRepository(
  type: RepositoryType = defaultUserRepository,
): UserRepository {
  const userRepositories: Record<RepositoryType, UserRepository> = {
    'in-memory': new InMemoryUserRepository(),
    global: new GlobalUserRepository(),
    pg: new PgUserRepository(),
  };

  return userRepositories[type];
}

export function makeTodoRepository(
  type: RepositoryType = defaultTodoRepository,
): TodoRepository {
  const todoRepositories: Record<RepositoryType, TodoRepository> = {
    'in-memory': new InMemoryTodoRepository(),
    global: new GlobalTodoRepository(),
    pg: new PgTodoRepository(),
  };

  return todoRepositories[type];
}

export function makeRegisterUseCase(
  userRepository: UserRepository = makeUserRepository(),
) {
  return new RegisterUseCase(userRepository);
}

export function makeLoginUseCase(
  userRepository: UserRepository = makeUserRepository(),
) {
  return new LoginUseCase(userRepository);
}

export function makeProfileUseCase(
  userRepository: UserRepository = makeUserRepository(),
) {
  return new ProfileUseCase(userRepository);
}

export function makeCreateTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new CreateTodoUseCase(todoRepository);
}

export function makeListTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new ListTodoUseCase(todoRepository);
}

export function makeFindTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new FindTodoUseCase(todoRepository);
}

export function makeUpdateTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new UpdateTodoUseCase(todoRepository);
}

export function makeToggleTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new ToggleTodoUseCase(todoRepository);
}

export function makeReorderTodoListUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new ReorderTodoListUseCase(todoRepository);
}

export function makeGetTodoStatsUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new GetTodoStatsUseCase(todoRepository);
}

export function makeDeleteTodoUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new DeleteTodoUseCase(todoRepository);
}

export function makeDeleteTodoListUseCase(
  todoRepository: TodoRepository = makeTodoRepository(),
) {
  return new DeleteTodoListUseCase(todoRepository);
}
