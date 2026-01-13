import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { ApiReorderTodoListBodySchema } from '@/schemas/todo';
import {
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
} from '../common';

export const reorderListRegistry = new OpenAPIRegistry();

reorderListRegistry.registerPath({
  method: 'patch',
  path: '/todos',
  summary: 'Reorder multiple todos',
  description: 'Updates the order of multiple todos.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: ApiReorderTodoListBodySchema,
        },
      },
    },
  },
  responses: {
    [StatusCodes.NO_CONTENT]: { description: 'Todos reordered successfully' },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
