import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { internalServerErrorResponse, unauthorizedResponse } from '../common';

export const logoutRegistry = new OpenAPIRegistry();

logoutRegistry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  summary: 'Logout authenticated user',
  description:
    'Logs out the currently authenticated user by clearing the authentication cookie and invalidating the active session.',
  security: [{ cookieAuth: [] }],
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description:
        'Logout completed successfully. The authentication cookie is cleared and the session is terminated.',
    },
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Authentication'],
});
