import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
  notFoundResponse,
} from '../common';
import {
  ApiUpdateTodoBodySchema,
  ApiTodoResultResponseSchema,
  ApiUpdateTodoParamsSchema,
} from '@/schemas/todo';

export const updateRegistry = new OpenAPIRegistry();

updateRegistry.registerPath({
  method: 'patch',
  path: '/api/todos/{todoId}',
  summary: 'Update todo',
  description: 'Updates fields of a todo owned by the authenticated user.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiUpdateTodoParamsSchema,
    body: {
      required: true,
      description: 'Todo update payload',
      content: {
        'application/json': {
          schema: ApiUpdateTodoBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: 'Todo updated',
      content: {
        'application/json': {
          schema: ApiTodoResultResponseSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
