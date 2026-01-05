import type {
  UserCreateDto,
  UserFindByEmailDto,
  UserFindByIdDto,
} from '@/dtos/user';
import type { User } from '@/entities';

export interface UserRepository {
  create(params: UserCreateDto): Promise<User>;
  findById(params: UserFindByIdDto): Promise<User | null>;
  findByEmail(params: UserFindByEmailDto): Promise<User | null>;
}
