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
  summary: 'Update an existing todo item',
  description:
    'Updates one or more fields of an existing todo item associated with the currently authenticated user. Only the provided fields are updated.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiUpdateTodoParamsSchema,
    body: {
      required: true,
      description:
        'Todo update payload. Only the provided fields will be updated.',
      content: {
        'application/json': {
          schema: ApiUpdateTodoBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: 'Todo item successfully updated.',
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
