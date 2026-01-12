import { StatusCodes } from 'http-status-codes';

import {
  ApiErrorResponseSchema,
  ApiValidationErrorResponse,
} from '@/schemas/common';

export const unauthorizedResponse = {
  [StatusCodes.UNAUTHORIZED]: {
    description:
      'Authentication required. The request does not contain a valid authentication cookie.',
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
  },
};

export const notFoundResponse = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Resource not found.',
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
  },
};

export const unprocessableEntityResponse = {
  [StatusCodes.UNPROCESSABLE_ENTITY]: {
    description:
      'The request contains validation errors in the path parameters or request body.',
    content: {
      'application/json': {
        schema: ApiValidationErrorResponse,
      },
    },
  },
};

export const internalServerErrorResponse = {
  [StatusCodes.INTERNAL_SERVER_ERROR]: {
    description: 'An unexpected error occurred while processing the request.',
    content: {
      'application/json': {
        schema: ApiErrorResponseSchema,
      },
    },
  },
};
