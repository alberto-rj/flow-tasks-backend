import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { internalServerErrorResponse, unauthorizedResponse } from '../common';
import { ApiTodoStatsResultResponseSchema } from '@/schemas/todo';

export const statsRegistry = new OpenAPIRegistry();

statsRegistry.registerPath({
  method: 'get',
  path: '/api/todos/stats',
  summary: 'Get todo statistics',
  description:
    'Returns total, active, and completed todos counts for the user.',
  security: [{ cookieAuth: [] }],
  responses: {
    [StatusCodes.OK]: {
      description: 'User todo statistics',
      content: {
        'application/json': {
          schema: ApiTodoStatsResultResponseSchema,
        },
      },
    },
    ...unauthorizedResponse,
    ...internalServerErrorResponse,
  },
  tags: ['Todos'],
});
