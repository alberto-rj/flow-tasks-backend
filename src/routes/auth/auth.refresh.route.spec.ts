import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { afterEach, describe, it } from 'vitest';

import { app } from '@/app';
import { cleanup } from '@/utils/test';
import {
  AUTH_PROFILE_ROUTE,
  AUTH_REFRESH_ROUTE,
  expectAuthCookie,
  expectError,
  getAuthenticatedAgent,
} from '@/utils/test.route';

describe(`POST ${AUTH_REFRESH_ROUTE}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should update authentication cookie on refresh', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .post(AUTH_REFRESH_ROUTE)
        .expect(StatusCodes.NO_CONTENT);

      expectAuthCookie(response);

      await agent.get(AUTH_PROFILE_ROUTE).expect(StatusCodes.OK);
    });

    it('should reject updating for an unauthenticated user', async () => {
      const response = await supertest(app)
        .post(AUTH_REFRESH_ROUTE)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });
});
