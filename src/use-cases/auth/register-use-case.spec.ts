import { describe, it, expect, beforeEach } from 'vitest';

import type { RegisterDto } from '@/dtos/auth';
import type { UserRepository } from '@/repositories';
import {
  RegisterUseCase,
  type RegisterUseCaseParseResult,
  type RegisterUseCaseResult,
} from '@/use-cases/auth';
import { ExistingEmailError } from '@/utils/errors';
import { hasCorrectHash } from '@/utils/password';
import { createRegisterDto, createUserRepository, isJWT } from '@/utils/test';

describe('[Use Case] Auth / Register', () => {
  let sut: RegisterUseCase;
  let result: RegisterUseCaseResult;
  let userRepository: UserRepository;
  let data: RegisterDto;

  beforeEach(async () => {
    userRepository = createUserRepository();
    sut = new RegisterUseCase(userRepository);
    data = createRegisterDto();
    result = await sut.execute({ data });
  });

  describe('[function] execute', () => {
    describe('Success cases', () => {
      it('should register a user successfully', async () => {
        expect(result).toHaveProperty('user');
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
        } = result;

        const isValidHash = await hasCorrectHash(data.password, passwordHash);

        expect(isValidHash).toBe(true);
        expect(passwordHash).not.toBe(data.password);
      });

      it('should return an access token', async () => {
        expect(result).toHaveProperty('accessToken');
        expect(isJWT(result.accessToken)).toBe(true);
      });
    });

    describe('Business rules validations', () => {
      it('should not allow registration with an existing email', async () => {
        await expect(() => sut.execute({ data })).rejects.toBeInstanceOf(
          ExistingEmailError,
        );
      });
    });
  });

  describe('[function] parse', () => {
    let parsedResult: RegisterUseCaseParseResult;

    beforeEach(() => {
      parsedResult = sut.parse(result);
    });

    it('should return an object with the user data and access token', () => {
      expect(parsedResult).toEqual(expect.any(Object));

      expect(isJWT(parsedResult.accessToken)).toBe(true);

      expect(parsedResult.user).toEqual(
        expect.objectContaining({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        }),
      );
    });

    it('should not expose the user password', () => {
      const { user } = parsedResult;
      expect(user).not.toHaveProperty('password');
    });
  });
});
