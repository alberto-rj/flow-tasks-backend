import { StatusCodes } from 'http-status-codes';
import { afterEach, describe, it } from 'vitest';

import {
  getAuthenticatedAgent,
  refreshEndpoint,
  profileEndpoint,
  expectAuthCookie,
  cleanup,
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
  });
});
