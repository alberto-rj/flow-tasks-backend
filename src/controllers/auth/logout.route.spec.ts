import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'vitest';

import {
  getAuthenticatedAgent,
  logoutEndpoint,
  profileEndpoint,
} from '@/utils/test';

describe(`POST ${logoutEndpoint}`, () => {
  describe('success cases', () => {
    it('should clear cookie on logout', async () => {
      const agent = await getAuthenticatedAgent();

      await agent.post(logoutEndpoint).expect(StatusCodes.NO_CONTENT);

      await agent.get(profileEndpoint).expect(StatusCodes.UNAUTHORIZED);
    });
  });
});
