import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  ApiListTodoQuerySchema,
  ApiTodoResultListResponseSchema,
} from '@/schemas/todo';
import { internalServerErrorResponse, unauthorizedResponse } from '../common';

export const listRegistry = new OpenAPIRegistry();

listRegistry.registerPath({
  method: 'get',
  path: '/todos',
  summary: 'List todos',
  description:
    'Returns a list of todos for the authenticated user with optional filtering, search, and sorting.',
  security: [{ cookieAuth: [] }],
  request: {
    query: ApiListTodoQuerySchema,
  },
  responses: {
    [StatusCodes.OK]: {
      description: 'List of todos',
      content: {
        'application/json': {
          schema: ApiTodoResultListResponseSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
