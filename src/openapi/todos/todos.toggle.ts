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
  summary: 'Toggle the completed state of a todo item',
  description:
    'Toggles the completed status of an existing todo item. If the todo is incomplete, it will be marked as completed; if it is already completed, it will be marked as incomplete.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiToggleTodoParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: {
      description:
        'Todo item successfully updated. The completedAt field is set or unset depending on its previous state.',
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
