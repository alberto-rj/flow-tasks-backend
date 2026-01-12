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
  path: '/api/todos',
  summary: 'Create a new todo item',
  description:
    'Creates a new todo item associated with the currently authenticated user.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      required: true,
      description:
        'Todo creation payload containing the required fields to create a new todo item.',
      content: {
        'application/json': {
          schema: ApiCreateTodoBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.CREATED]: {
      description:
        'Todo item successfully created and associated with the authenticated user.',
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
