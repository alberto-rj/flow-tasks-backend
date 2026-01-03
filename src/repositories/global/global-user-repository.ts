import { randomUUID } from 'node:crypto';

import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import type { UserCreateParams } from '@/schemas/user/user';

const items: Map<string, User> = new Map();

export class GlobalUserRepository implements UserRepository {
  constructor() {}

  async create(params: UserCreateParams) {
    const newItem: User = {
      ...params,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    items.set(newItem.id, newItem);

    return newItem;
  }

  async findById({ id }: { id: string }) {
    const foundItem = items.get(id);

    if (typeof foundItem === 'undefined') {
      return null;
    }

    return foundItem;
  }

  async findByEmail({ email }: { email: string }) {
    for (const [, item] of items) {
      if (item.email === email) {
        return item;
      }
    }

    return null;
  }
}
