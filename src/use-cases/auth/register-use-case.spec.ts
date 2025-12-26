import { describe, it, expect, beforeEach } from 'vitest';

import type { UserRepository } from '@/repositories';
import type { RegisterDto } from '@/dtos/auth';
import { RegisterUseCase } from '@/use-cases/auth';
import { ExistingEmailError } from '@/utils/errors';
import { hasCorrectHash } from '@/utils/password';
import { createRegisterDto, createUserRepository, isJWT } from '@/utils/test';

let sut: RegisterUseCase;
let userRepository: UserRepository;
let data: RegisterDto;

beforeEach(() => {
  userRepository = createUserRepository();
  sut = new RegisterUseCase(userRepository);
  data = createRegisterDto();
});

describe('Register Use Case', () => {
  describe('Success cases', () => {
    it('should register a user successfully', async () => {
      const result = await sut.execute({ data });

      expect(result.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: data.name,
          email: data.email,
        }),
      );
    });

    it('should hash the user password before saving', async () => {
      const {
        user: { password: passwordHash },
      } = await sut.execute({ data });

      const isValidHash = await hasCorrectHash(data.password, passwordHash);

      expect(isValidHash).toBe(true);
      expect(passwordHash).not.toBe(data.password);
    });

    it('should return an access token', async () => {
      const result = await sut.execute({ data });
      const isValid = isJWT(result.accessToken);
      expect(isValid).toBe(true);
    });
  });

  describe('Business rules validations', () => {
    it('should not allow registration with an existing email', async () => {
      await sut.execute({ data });

      await expect(() => sut.execute({ data })).rejects.toBeInstanceOf(
        ExistingEmailError,
      );
    });
  });
});
