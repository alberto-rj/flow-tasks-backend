import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import type {
  UserCreateDto,
  UserFindByEmailDto,
  UserFindByIdDto,
} from '@/dtos/user';
import { uuid } from '@/utils/uuid';

const items: Map<string, User> = new Map();

export class GlobalUserRepository implements UserRepository {
  async create(params: UserCreateDto) {
    const newItem: User = {
      ...params,
      userId: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    items.set(newItem.userId, newItem);

    return newItem;
  }

  async findById({ userId }: UserFindByIdDto) {
    const foundItem = items.get(userId);

    if (typeof foundItem === 'undefined') {
      return null;
    }

    return foundItem;
  }

  async findByEmail({ email }: UserFindByEmailDto) {
    for (const [, item] of items) {
      if (item.email === email) {
        return item;
      }
    }

    return null;
  }

  async clear() {
    items.clear();
  }
}
