import { describe, it, expect, beforeEach } from 'vitest';

import { LoginUseCase } from '@/use-cases/auth';
import type { UserRepository } from '@/repositories';
import { InvalidCredentialsError } from '@/utils/errors';
import { createRegisterDto, createUserRepository, isJWT } from '@/utils/test';
import type { RegisterDto } from '@/dtos/auth';
import { getHash } from '@/utils/password';

let sut: LoginUseCase;
let userRepository: UserRepository;
let data: RegisterDto;

beforeEach(async () => {
  userRepository = createUserRepository();
  sut = new LoginUseCase(userRepository);
  data = createRegisterDto();
  const passwordHash = await getHash(data.password);
  await userRepository.create({ ...data, password: passwordHash });
});

describe('Login Use Case', () => {
  describe('Success cases', () => {
    it('should login a user successfully', async () => {
      const result = await sut.execute({ data });

      expect(result.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: data.name,
          email: data.email,
        }),
      );
    });

    it('should return a valid JWT access token', async () => {
      const { accessToken } = await sut.execute({ data });
      const isValid = isJWT(accessToken);
      expect(isValid).toBe(true);
    });
  });

  describe('Failure cases', () => {
    it('should throw InvalidCredentialsError when the user email is incorrect', async () => {
      await expect(() =>
        sut.execute({
          data: {
            email: 'wrongemail@example.com',
            password: data.password,
          },
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should throw InvalidCredentialsError when the user password is incorrect', async () => {
      await expect(() =>
        sut.execute({
          data: {
            email: data.email,
            password: 'wrongPASS#@*%1234',
          },
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
  });
});
