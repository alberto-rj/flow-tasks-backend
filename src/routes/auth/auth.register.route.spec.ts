/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, expect, afterEach } from 'vitest';

import { app } from '@/app';
import { cleanup, newString } from '@/utils/test';
import { makeUserRepository } from '@/utils/factory';
import { hasCorrectHash } from '@/utils/password';
import {
  AUTH_BASE_ROUTE,
  expectCreatedUserWithBody,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  expectValidationError,
  newApiRegisterBody,
} from '@/utils/test.route';

const registerEndpoint = `${AUTH_BASE_ROUTE}/register`;

describe(`POST ${registerEndpoint}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return created user with correct structure', async () => {
      const data = newApiRegisterBody();

      const response = await supertest(app)
        .post(registerEndpoint)
        .send(data)
        .expect(StatusCodes.CREATED);

      expectCreatedUserWithBody(response, data);
    });

    it('should return access token and set authentication cookie after registration', async () => {
      const response = await supertest(app)
        .post(registerEndpoint)
        .send(newApiRegisterBody())
        .expect(StatusCodes.CREATED);

      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);

      const authCookie = cookies.find((cookie) =>
        cookie.startsWith('accessToken='),
      );

      expect(authCookie).toBeDefined();
      expect(authCookie).toContain('HttpOnly');
      expect(authCookie).toContain('Path=/');
    });

    it('should trim name, email and password and save them without leading/trailing spaces after registration', async () => {
      const dataWithWhiteSpace = newApiRegisterBody({
        includeLeadingWhiteSpace: true,
        includeTrailingWhiteSpace: true,
      });

      // API response
      const response = await supertest(app)
        .post(registerEndpoint)
        .send(dataWithWhiteSpace)
        .expect(StatusCodes.CREATED);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const createdUser = response.body.data.results[0];
      expect(createdUser.name).toBe(dataWithWhiteSpace.name.trim());
      expect(createdUser.email).toBe(dataWithWhiteSpace.email.trim());

      // persistence
      const savedUser = await makeUserRepository().findById({
        userId: createdUser.userId,
      });
      await expect(
        hasCorrectHash(
          dataWithWhiteSpace.password.trim(),
          savedUser?.password as string,
        ),
      ).resolves.toBe(true);
    });
  });

  describe('validation errors', () => {
    describe('name', () => {
      it('should reject registration when name is missing', async () => {
        const { name, ...dataWithoutName } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutName)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'name');
      });

      it('should reject registration when name is not a string', async () => {
        const unexpectedNameType = 19975;

        const response = await supertest(app)
          .post(registerEndpoint)
          .send({ ...newApiRegisterBody(), name: unexpectedNameType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'name');
      });

      it('should reject registration when name exceed 125 characters', async () => {
        const exceededName = newString({
          length: 126,
          includeDigits: true,
        });
        const dataWithExceededName = {
          ...newApiRegisterBody(),
          name: exceededName,
        };

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithExceededName)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'name');
      });
    });

    describe('email', () => {
      it('should reject registration when email is missing', async () => {
        const { email, ...dataWithoutEmail } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutEmail)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });

      it('should reject registration when email is not a string', async () => {
        const unexpectedEmailType = false;

        const response = await supertest(app)
          .post(registerEndpoint)
          .send({ ...newApiRegisterBody(), email: unexpectedEmailType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });

      it('should reject registration when email is invalid', async () => {
        const invalidEmail = 'john doe#example,com';
        const data = {
          ...newApiRegisterBody(),
          email: invalidEmail,
        };

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(data)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });
    });

    describe('password', () => {
      it('should reject registration when password is missing', async () => {
        const { password, ...dataWithoutPassword } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutPassword)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });

      it('should reject registration when password is not a string', async () => {
        const unexpectedPasswordType = true;

        const response = await supertest(app)
          .post(registerEndpoint)
          .send({ ...newApiRegisterBody(), password: unexpectedPasswordType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });

      it('should reject registration when password is weak', async () => {
        const weakPassword = '1234';
        const dataWithWeakPassword = {
          ...newApiRegisterBody(),
          password: weakPassword,
        };

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithWeakPassword)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });
    });
  });

  describe('business logic errors', () => {
    it('should reject registration when email already exists', async () => {
      const data = newApiRegisterBody();

      await supertest(app).post(registerEndpoint).send(data);

      const response = await supertest(app)
        .post(registerEndpoint)
        .send(data)
        .expect(StatusCodes.CONFLICT);

      expectError(response);
    });
  });

  describe('edge cases', () => {
    it('should ignore unexpected fields upon registration', async () => {
      const data = {
        ...newApiRegisterBody(),
        role: 'admin',
      };

      const response = await supertest(app)
        .post(registerEndpoint)
        .send(data)
        .expect(StatusCodes.CREATED);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const createdUser = response.body.data.results[0];
      expect(createdUser).not.toHaveProperty('role');
    });
  });
});
