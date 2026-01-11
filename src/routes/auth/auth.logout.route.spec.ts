import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { cleanup } from '@/utils/test';
import {
  AUTH_LOGOUT_ROUTE,
  AUTH_PROFILE_ROUTE,
  expectError,
  getAuthenticatedAgent,
} from '@/utils/test.route';

describe(`POST ${AUTH_LOGOUT_ROUTE}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should clear cookie on logout', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .post(AUTH_LOGOUT_ROUTE)
        .expect(StatusCodes.NO_CONTENT);

      const cookies = response.headers['set-cookie'] as unknown as string[];

      const authCookie = cookies.find((cookie) =>
        cookie.startsWith('accessToken='),
      );

      expect(typeof authCookie).toBe('string');
      expect(authCookie).toContain('accessToken=;');

      await agent.get(AUTH_PROFILE_ROUTE).expect(StatusCodes.UNAUTHORIZED);
    });

    it('should reject clearing for an unauthenticated user', async () => {
      const response = await supertest(app)
        .post(AUTH_LOGOUT_ROUTE)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });
});
