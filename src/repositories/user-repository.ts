import type { UserCreateParams } from '@/schemas/user/user';

export interface UserRepository {
  create(params: UserCreateParams): Promise<User>;
  findById(params: UserFindByIdParams): Promise<User | null>;
}
