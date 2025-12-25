import { randomUUID } from 'node:crypto';

import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import type { UserCreateParams } from '@/schemas/user/user';

export class InMemoryUserRepository implements UserRepository {
  private items: Map<string, User> = new Map();

  async create(params: UserCreateParams) {
    const newItem: User = {
      ...params,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.set(newItem.id, newItem);

    return newItem;
  }

  async findById({ id }: { id: string }) {
    const foundItem = this.items.get(id);

    if (typeof foundItem === 'undefined') {
      return null;
    }

    return foundItem;
  }

  async findByEmail({ email }: { email: string }) {
    for (const [, item] of this.items) {
      if (item.email === email) {
        return item;
      }
    }

    return null;
  }
}
