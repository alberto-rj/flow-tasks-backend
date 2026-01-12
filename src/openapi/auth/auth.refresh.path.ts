import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { internalServerErrorResponse, unauthorizedResponse } from '../common';

export const refreshRegistry = new OpenAPIRegistry();

refreshRegistry.registerPath({
  method: 'post',
  path: '/api/auth/refresh',
  summary: 'Refresh authentication session',
  description:
    'Refreshes the authentication session by issuing a new authentication cookie for the currently authenticated user.',
  security: [{ cookieAuth: [] }],
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description:
        'Authentication session refreshed successfully. A new authentication cookie is set in the response.',
    },
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Authentication'],
});
