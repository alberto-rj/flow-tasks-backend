import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { isUUID, isIsoDate } from '@/utils/test';
import {
  AUTH_PROFILE_ROUTE,
  cleanup,
  expectError,
  expectResultsWithLength,
  expectSuccess,
  getAuthenticatedAgent,
} from '@/utils/test.route';

describe(`POST ${AUTH_PROFILE_ROUTE}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should return user profile data', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .get(AUTH_PROFILE_ROUTE)
        .expect(StatusCodes.OK);

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

      const response = await agent
        .get(AUTH_PROFILE_ROUTE)
        .expect(StatusCodes.OK);

      expectSuccess(response);
      expectResultsWithLength(response, 1);

      const userProfile = response.body.data.results[0];

      expect(userProfile).not.toHaveProperty('password');
    });

    it('should reject returning profile data for an unauthenticated user', async () => {
      const response = await supertest(app)
        .get(AUTH_PROFILE_ROUTE)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });
});
