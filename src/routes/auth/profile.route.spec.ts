import { StatusCodes } from 'http-status-codes';
import { afterEach, describe, expect, it } from 'vitest';

import {
  getAuthenticatedAgent,
  profileEndpoint,
  cleanup,
  expectSuccess,
  expectResultsWithLength,
  isUUID,
  isIsoDate,
  newApiRegisterBody,
  registerEndpoint,
  expectError,
} from '@/utils/test';
import supertest from 'supertest';
import { app } from '@/app';

describe(`POST ${profileEndpoint}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return user profile data', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent.get(profileEndpoint).expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const userProfile = response.body.data.results[0];

      expect(isUUID(userProfile.userId)).toBe(true);
      expect(typeof userProfile.email).toBe('string');
      expect(typeof userProfile.name).toBe('string');
      expect(isIsoDate(userProfile.createdAt)).toBe(true);
      expect(isIsoDate(userProfile.updatedAt)).toBe(true);
    });

    it('should not expose password when returning user profile data', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent.get(profileEndpoint).expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const userProfile = response.body.data.results[0];

      expect(userProfile).not.toHaveProperty('password');
    });

    it('should reject returning profile data for a non-logged user', async () => {
      const registerData = newApiRegisterBody();

      await supertest(app)
        .post(registerEndpoint)
        .send(registerData)
        .expect(StatusCodes.CREATED);

      const response = await supertest(app)
        .get(profileEndpoint)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });
});
