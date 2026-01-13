import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { ApiLoginBodySchema } from '@/schemas/auth';
import { ApiUserResultResponseSchema } from '@/schemas/user';
import { ApiErrorResponseSchema } from '@/schemas/common';
import {
  internalServerErrorResponse,
  unprocessableEntityResponse,
} from '../common';

export const loginRegistry = new OpenAPIRegistry();

loginRegistry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'Authenticate a user',
  description:
    'Authenticates a user using email and password. On success, an authentication cookie is set, allowing access to protected endpoints.',
  request: {
    body: {
      required: true,
      description: 'User login payload.',
      content: {
        'application/json': {
          schema: ApiLoginBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description:
        'Authentication successful. An authentication cookie is set in the response.',
      content: {
        'application/json': {
          schema: ApiUserResultResponseSchema,
        },
      },
    },
    [StatusCodes.UNAUTHORIZED]: {
      description: 'Invalid email or password.',
      content: {
        'application/json': {
          schema: ApiErrorResponseSchema,
        },
      },
    },
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Authentication'],
});
