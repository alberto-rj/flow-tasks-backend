import type { User } from '@/entities';
import type { UserCreateParams } from '@/schemas/user/user';

type UserFindByIdParams = {
  id: string;
};

type UserFindByEmailParams = {
  email: string;
};

export interface UserRepository {
  create(params: UserCreateParams): Promise<User>;
  findById(params: UserFindByIdParams): Promise<User | null>;
  findByEmail(params: UserFindByEmailParams): Promise<User | null>;
}
