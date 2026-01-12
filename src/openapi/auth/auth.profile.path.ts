import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { ApiUserResultResponseSchema } from '@/schemas/user';
import { internalServerErrorResponse, unauthorizedResponse } from '../common';

export const profileRegistry = new OpenAPIRegistry();

profileRegistry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  summary: 'Get authenticated user profile',
  description:
    'Returns the profile information of the currently authenticated user based on the active authentication cookie.',
  security: [{ cookieAuth: [] }],
  responses: {
    [StatusCodes.OK]: {
      description: 'Authenticated user profile retrieved successfully.',
      content: {
        'application/json': {
          schema: ApiUserResultResponseSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Authentication'],
});
