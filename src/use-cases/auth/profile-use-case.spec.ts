import { describe, it, expect, beforeEach } from 'vitest';

import { ProfileUseCase } from '@/use-cases/auth';
import { ResourceNotFoundError } from '@/utils/errors';
import { createRegisterDto, createUserRepository } from '@/utils/test';
import { getHash } from '@/utils/password';
import type { User } from '@/entities';

let sut: ProfileUseCase;
let createdUser: User;

beforeEach(async () => {
  const userRepository = createUserRepository();
  sut = new ProfileUseCase(userRepository);
  const data = createRegisterDto();
  const passwordHash = await getHash(data.password);
  createdUser = await userRepository.create({
    ...data,
    password: passwordHash,
  });
});

describe('[Use Case] Profile', () => {
  describe('Success cases', () => {
    it('should return the profile of for an existing user', async () => {
      const result = await sut.execute({ userId: createdUser.id });

      expect(result).toHaveProperty('user');
      expect(result.user).toEqual(
        expect.objectContaining({
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        }),
      );
    });

    it('should not expose the password', async () => {
      const result = await sut.execute({ userId: createdUser.id });

      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('Failure cases', () => {
    it('should not allow retrieving a profile for a non-existing user', async () => {
      await expect(() =>
        sut.execute({ userId: 'inexistent-user-id' }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });
});
