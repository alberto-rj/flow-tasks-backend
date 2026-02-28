import { eq } from 'drizzle-orm';

import { load } from '@/config/env';
import type {
  UserCreateDto,
  UserFindByEmailDto,
  UserFindByIdDto,
} from '@/dtos/user';
import { db } from '@/drizzle';
import { users } from '@/drizzle/schemas';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';

const { NODE_ENV } = load();

export class PgUserRepository implements UserRepository {
  async create({ name, email, password }: UserCreateDto) {
    const [createdUser] = await db
      .insert(users)
      .values({ name, email, password })
      .returning();

    return createdUser as User;
  }

  async findById({ userId }: UserFindByIdDto) {
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));

    if (!foundUser) {
      return null;
    }

    return foundUser;
  }

  async findByEmail({ email }: UserFindByEmailDto) {
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!foundUser) {
      return null;
    }

    return foundUser;
  }

  async clear() {
    if (NODE_ENV !== 'test') {
      throw new Error('clear users table only in the test environment');
    }
    await db.delete(users);
  }
}
