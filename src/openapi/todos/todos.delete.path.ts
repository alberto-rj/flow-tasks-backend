import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
  unprocessableEntityResponse,
  notFoundResponse,
} from '../common';
import { ApiDeleteTodoParamsSchemas } from '@/schemas/todo';

export const deleteRegistry = new OpenAPIRegistry();

deleteRegistry.registerPath({
  method: 'delete',
  path: '/api/todos/{todoId}',
  summary: 'Delete an existing todo item',
  description:
    'Deletes a todo item identified by todoId. Only the owner of the todo can delete it.',
  security: [{ cookieAuth: [] }],
  request: {
    params: ApiDeleteTodoParamsSchemas,
  },
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description: 'Todo item successfully deleted. No content is returned.',
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
