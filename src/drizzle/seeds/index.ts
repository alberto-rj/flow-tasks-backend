import { db } from '@/drizzle';
import { users } from '@/drizzle/schemas';

async function main() {
  await db.delete(users);

  await db
    .insert(users)
    .values({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    })
    .returning();
}

main();
