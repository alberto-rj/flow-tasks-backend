import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { ApiRegisterBodySchema } from '@/schemas/auth';
import { ApiErrorResponseSchema } from '@/schemas/common';
import { ApiUserResultResponseSchema } from '@/schemas/user';
import {
  internalServerErrorResponse,
  unprocessableEntityResponse,
} from '../common';

export const registerRegistry = new OpenAPIRegistry();

registerRegistry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  summary: 'Create a new user account',
  description:
    'Creates a new user account and sets an authentication cookie on success.',
  request: {
    body: {
      required: true,
      description: 'User registration payload',
      content: {
        'application/json': {
          schema: ApiRegisterBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.CREATED]: {
      description:
        'User account successfully created. An authentication cookie is set in the response.',
      content: {
        'application/json': {
          schema: ApiUserResultResponseSchema,
        },
      },
    },
    [StatusCodes.CONFLICT]: {
      description:
        'The provided email address is already associated with an existing account.',
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
