import { describe, it, expect, beforeEach } from 'vitest';

import {
  LoginUseCase,
  type LoginUseCaseParseResult,
  type LoginUseCaseResult,
} from '@/use-cases/auth';
import type { UserRepository } from '@/repositories';
import { InvalidCredentialsError } from '@/utils/errors';
import { newRegisterDto, newUserRepository } from '@/utils/test';
import type { RegisterDto } from '@/dtos/auth';
import { getHash } from '@/utils/password';

describe('[Use Case] Auth / Login', () => {
  let sut: LoginUseCase;
  let userRepository: UserRepository;
  let data: RegisterDto;

  beforeEach(async () => {
    userRepository = newUserRepository();
    sut = new LoginUseCase(userRepository);
    data = newRegisterDto();
    const passwordHash = await getHash(data.password);
    await userRepository.create({ ...data, password: passwordHash });
  });

  describe('[function] execute', () => {
    describe('[success cases]', () => {
      it('should login a user successfully', async () => {
        const result = await sut.execute({ data });

        expect(result.user).toEqual(
          expect.objectContaining({
            userId: expect.any(String),
            name: data.name,
            email: data.email,
          }),
        );
      });
    });

    describe('[failure cases]', () => {
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

  describe('[function] parse', () => {
    let result: LoginUseCaseResult;
    let parsedResult: LoginUseCaseParseResult;

    beforeEach(async () => {
      result = await sut.execute({ data });
      parsedResult = sut.parse(result);
    });

    it('should return an object with the user data', () => {
      expect(parsedResult).toEqual(expect.any(Object));

      expect(parsedResult.user).toEqual(
        expect.objectContaining({
          userId: result.user.userId,
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
