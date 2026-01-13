import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from '../common';
import { ApiDeleteTodoListQuerySchema } from '@/schemas/todo';

export const deleteListRegistry = new OpenAPIRegistry();

deleteListRegistry.registerPath({
  method: 'delete',
  path: '/api/todos',
  summary: 'Delete todos',
  description: 'Deletes todos of the authenticated user based on the filter.',
  security: [{ cookieAuth: [] }],
  request: {
    query: ApiDeleteTodoListQuerySchema,
  },
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description: 'Todos deleted',
    },
    ...unauthorizedResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
