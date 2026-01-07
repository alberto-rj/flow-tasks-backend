import { StatusCodes } from 'http-status-codes';
import { describe, it } from 'vitest';

import {
  getAuthenticatedAgent,
  refreshEndpoint,
  profileEndpoint,
  expectAuthCookie,
} from '@/utils/test';

describe(`POST ${refreshEndpoint}`, () => {
  describe('success cases', () => {
    it('should update authentication cookie on refresh', async () => {
      const agent = await getAuthenticatedAgent();

      const response = await agent
        .post(refreshEndpoint)
        .expect(StatusCodes.NO_CONTENT);

      expectAuthCookie(response);

      await agent.get(profileEndpoint).expect(StatusCodes.OK);
    });
  });
});
