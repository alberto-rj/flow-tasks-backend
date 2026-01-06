import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { app } from '@/app';
import { newApiRegisterBody } from '@/utils/test';

const endpoint = '/api/auth/register';

describe(`POST ${endpoint}`, () => {
  describe('success cases', () => {
    it('should return created user with correct structure', async () => {
      const data = newApiRegisterBody();

      const response = await request(app)
        .post(endpoint)
        .send(data)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual({
        success: true,
        data: {
          results: [
            expect.objectContaining({
              id: expect.any(String),
              name: data.name,
              email: data.email,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ],
        },
      });
    });
  });

  /*describe('validation errors', () => {
    it('should reject invalid email format', async () => {
      const data = { ...newApiRegisterBody(), email: 'invalid-email' };

      const response = await request(app)
        .post(endpoint)
        .send(data)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);

      expect(response.body).toEqual({
        success: false,
        data: {
          error: expect.objectContaining({
            properties: {
              email: {
                errors: [expect.any(String)],
              },
            },
          }),
        },
      });
    });
    it('should reject weak password', async () => {});
    it('should reject missing required fields', async () => {});
  });*/

  describe('business logic errors', () => {
    it('should reject duplicated email', async () => {
      const data = newApiRegisterBody();

      await request(app).post(endpoint).send(data);

      const response = await request(app)
        .post(endpoint)
        .send(data)
        .expect(StatusCodes.CONFLICT);

      expect(response.body).toEqual({
        success: false,
        data: {
          error: {
            message: expect.any(String),
          },
        },
      });
    });
  });

  /*describe('edge cases', () => {
    it('should handle special characters in name', async () => {});
  });*/
});
