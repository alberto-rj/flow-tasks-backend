/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, expect, afterEach } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  expectValidationError,
  isIsoDate,
  isUUID,
  newApiRegisterBody,
  loginEndpoint,
  registerEndpoint,
  newApiLoginBody,
  expectAuthCookie,
  registerAndLogin,
} from '@/utils/test';

describe(`POST ${loginEndpoint}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return user with correct structure', async () => {
      const { registerData, response } = await registerAndLogin();

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const createdUser = response.body.data.results[0];
      expect(createdUser).toMatchObject({
        name: registerData.name,
        email: registerData.email,
      });
      expect(isUUID(createdUser.userId)).toBe(true);
      expect(isIsoDate(createdUser.createdAt)).toBe(true);
      expect(isIsoDate(createdUser.updatedAt)).toBe(true);
    });

    it('should not expose password after login', async () => {
      const { response } = await registerAndLogin();

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const createdUser = response.body.data.results[0];
      expect(createdUser).not.toHaveProperty('password');
    });

    it('should return access token and set authentication cookie after login', async () => {
      const { response } = await registerAndLogin();

      expectAuthCookie(response);
    });

    it('should allow login when email and password include leading/trailing spaces', async () => {
      const { registerData: dataWithWhiteSpace, response } =
        await registerAndLogin({
          registerData: newApiRegisterBody({
            includeLeadingWhiteSpace: true,
            includeTrailingWhiteSpace: true,
          }),
        });

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const createdUser = response.body.data.results[0];
      expect(createdUser.name).toBe(dataWithWhiteSpace.name.trim());
      expect(createdUser.email).toBe(dataWithWhiteSpace.email.trim());
    });
  });

  describe('validation errors', () => {
    describe('email', () => {
      it('should reject login when email is missing', async () => {
        const { email, ...dataWithoutEmail } = newApiLoginBody();

        const response = await supertest(app)
          .post(loginEndpoint)
          .send(dataWithoutEmail)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });

      it('should reject login when email is not a string', async () => {
        const unexpectedEmailType = false;

        const response = await supertest(app)
          .post(loginEndpoint)
          .send({ ...newApiLoginBody(), email: unexpectedEmailType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });

      it('should reject login when email is invalid', async () => {
        const invalidEmail = 'john doe#example,com';
        const data = {
          ...newApiLoginBody(),
          email: invalidEmail,
        };

        const response = await supertest(app)
          .post(loginEndpoint)
          .send(data)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });
    });

    describe('password', () => {
      it('should reject login when password is missing', async () => {
        const { password, ...dataWithoutPassword } = newApiLoginBody();

        const response = await supertest(app)
          .post(loginEndpoint)
          .send(dataWithoutPassword)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });

      it('should reject login when password is not a string', async () => {
        const unexpectedPasswordType = true;

        const response = await supertest(app)
          .post(loginEndpoint)
          .send({ ...newApiLoginBody(), password: unexpectedPasswordType })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });

      it('should reject login when password is weak', async () => {
        const weakPassword = '1234';
        const dataWithWeakPassword = {
          ...newApiLoginBody(),
          password: weakPassword,
        };

        const response = await supertest(app)
          .post(loginEndpoint)
          .send(dataWithWeakPassword)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });
    });
  });

  describe('business logic errors', () => {
    it('should reject login when email is wrong', async () => {
      const wrongEmail = 'wrong_email@example.com';
      const registerData = newApiRegisterBody();
      const { password } = registerData;

      await supertest(app)
        .post(registerEndpoint)
        .send(registerData)
        .expect(StatusCodes.CREATED);

      const response = await supertest(app)
        .post(loginEndpoint)
        .send({ email: wrongEmail, password })
        .expect(StatusCodes.BAD_REQUEST);

      expectError(response);
    });

    it('should reject login when password is wrong', async () => {
      const wrongPassword = 'wrongPASS1234';
      const registerData = newApiRegisterBody();
      const { email } = registerData;

      await supertest(app)
        .post(registerEndpoint)
        .send(registerData)
        .expect(StatusCodes.CREATED);

      const response = await supertest(app)
        .post(loginEndpoint)
        .send({ email, password: wrongPassword })
        .expect(StatusCodes.BAD_REQUEST);

      expectError(response);
    });

    it('should not allow login for a non-existing user', async () => {
      const response = await supertest(app)
        .post(loginEndpoint)
        .send(newApiLoginBody())
        .expect(StatusCodes.BAD_REQUEST);

      expectError(response);
    });
  });
});
