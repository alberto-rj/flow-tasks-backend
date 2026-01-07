import { StatusCodes } from 'http-status-codes';
import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanup,
  getAuthenticatedAgent,
  logoutEndpoint,
  profileEndpoint,
} from '@/utils/test';

describe(`POST ${logoutEndpoint}`, () => {
  afterEach(async () => {
    await cleanup();
  });

  describe('success cases', () => {
    it('should clear cookie on logout', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .post(logoutEndpoint)
        .expect(StatusCodes.NO_CONTENT);

      const cookies = response.headers['set-cookie'] as unknown as string[];

      const authCookie = cookies.find((cookie) =>
        cookie.startsWith('accessToken='),
      );

      expect(typeof authCookie).toBe('string');
      expect(authCookie).toContain('accessToken=;');

      await agent.get(profileEndpoint).expect(StatusCodes.UNAUTHORIZED);
    });
  });
});
