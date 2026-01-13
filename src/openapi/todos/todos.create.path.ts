import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from '../common';
import {
  ApiCreateTodoBodySchema,
  ApiTodoResultResponseSchema,
} from '@/schemas/todo';

export const createRegistry = new OpenAPIRegistry();

createRegistry.registerPath({
  method: 'post',
  path: '/todos',
  summary: 'Create todo',
  description: 'Creates a new todo for the authenticated user.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: ApiCreateTodoBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.CREATED]: {
      description: 'Todo created',
      content: {
        'application/json': {
          schema: ApiTodoResultResponseSchema,
        },
      },
    },
    ...unprocessableEntityResponse,
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
