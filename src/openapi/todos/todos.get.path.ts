import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
  notFoundResponse,
} from '../common';
import { ApiFindTodoParamsSchemas } from '@/schemas/todo';

export const getRegistry = new OpenAPIRegistry();

getRegistry.registerPath({
  method: 'get',
  path: '/todos/{todoId}',
  summary: 'Get todo by id',
  description: 'Returns a single todo item owned by the authenticated user.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiFindTodoParamsSchemas,
  },
  responses: {
    [StatusCodes.OK]: {
      description: 'Todo found',
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
