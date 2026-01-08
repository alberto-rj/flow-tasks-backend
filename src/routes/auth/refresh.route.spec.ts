import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { afterEach, describe, it } from 'vitest';

import { app } from '@/app';
import {
  getAuthenticatedAgent,
  refreshEndpoint,
  profileEndpoint,
  expectAuthCookie,
  cleanup,
  expectError,
} from '@/utils/test';

describe(`POST ${refreshEndpoint}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should update authentication cookie on refresh', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .post(refreshEndpoint)
        .expect(StatusCodes.NO_CONTENT);

      expectAuthCookie(response);

      await agent.get(profileEndpoint).expect(StatusCodes.OK);
    });

    it('should reject updating for an unauthenticated user', async () => {
      const response = await supertest(app)
        .post(refreshEndpoint)
        .expect(StatusCodes.UNAUTHORIZED);

      expectError(response);
    });
  });
});
