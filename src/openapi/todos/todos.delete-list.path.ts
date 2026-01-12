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
  summary: 'Delete multiple todos based on filter',
  description:
    'Deletes multiple todos of the authenticated user based on the provided filter. By default, only completed todos are deleted if the filter is not specified. Valid filter values: "all", "active", "completed".',
  security: [{ cookieAuth: [] }],
  request: {
    query: ApiDeleteTodoListQuerySchema,
  },
  responses: {
    [StatusCodes.NO_CONTENT]: {
      description: 'Todos successfully deleted. No content is returned.',
    },
    ...unauthorizedResponse,
    ...unprocessableEntityResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
