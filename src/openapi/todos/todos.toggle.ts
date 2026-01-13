import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
  notFoundResponse,
} from '../common';
import {
  ApiTodoResultResponseSchema,
  ApiToggleTodoParamsSchema,
} from '@/schemas/todo';

export const toggleRegistry = new OpenAPIRegistry();

toggleRegistry.registerPath({
  method: 'patch',
  path: '/api/todos/{todoId}/completed',
  summary: 'Toggle todo completion',
  description:
    'Toggles the completion state of a todo owned by the authenticated user.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiToggleTodoParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: {
      description: 'Todo completion state updated',
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
