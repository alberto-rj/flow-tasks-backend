/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { describe, it, expect, afterEach } from 'vitest';

import { app } from '@/app';
import {
  cleanup,
  expectError,
  expectValidationError,
  isIsoDate,
  isUUID,
  newApiRegisterBody,
  newString,
  registerEndpoint,
} from '@/utils/test';

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

      expect(response.body.success).toBe(true);

      const user = response.body.data.results[0];

      expect(user).toMatchObject({
        name: data.name,
        email: data.email,
      });

      expect(isUUID(user.userId)).toBe(true);
      expect(isIsoDate(user.createdAt)).toBe(true);
      expect(isIsoDate(user.updatedAt)).toBe(true);
    });

    it.todo(
      'should return an access token and set authentication cookie after user registration',
      async () => {},
    );

    it.todo(
      'should trim name, email and password and save them without leading/trailing spaces',
      async () => {},
    );
  });

  describe('validation errors', () => {
    describe('name', () => {
      it('should require name when it is not provided', async () => {
        const { name, ...dataWithoutName } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutName)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'name');
      });

      it('should reject when name exceed 125 characters', async () => {
        const longName = newString({
          length: 126,
          includeDigits: true,
        });
        const dataWithLongName = { ...newApiRegisterBody(), name: longName };

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithLongName)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'name');
      });
    });

    describe('email', () => {
      it('should require email when it is not provided', async () => {
        const { email, ...dataWithoutEmail } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutEmail)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'email');
      });

      it('should reject invalid email address', async () => {
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
      it('should require password when it is not provided', async () => {
        const { password, ...dataWithoutPassword } = newApiRegisterBody();

        const response = await supertest(app)
          .post(registerEndpoint)
          .send(dataWithoutPassword)
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        expectValidationError(response, 'password');
      });

      it('should reject weak password', async () => {
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
    it('should reject duplicated email', async () => {
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
    it('should ignore unexpected fields', async () => {
      const data = {
        ...newApiRegisterBody(),
        role: 'admin',
      };

      const response = await supertest(app)
        .post(registerEndpoint)
        .send(data)
        .expect(StatusCodes.CREATED);

      expect(response.body.data.results[0].role).toBeUndefined();
    });
  });
});
