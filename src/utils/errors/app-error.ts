import { StatusCodes } from 'http-status-codes';

import {
  type ResBodyDetailedError,
  type ResBodyError,
  detailedError,
  error,
} from '../res-body';

export abstract class AppError<T> extends Error {
  protected statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  abstract format(): T;
}

export class UnauthorizedError extends AppError<ResBodyError> {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }

  format(): ResBodyError {
    return error(this.message);
  }
}

export class ConflictError extends AppError<ResBodyError> {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
  }

  format(): ResBodyError {
    return error(this.message);
  }
}

export class ValidationError extends AppError<ResBodyDetailedError> {
  protected details: { path: string; message: string }[];

  constructor(
    message: string,
    details: {
      path: string;
      message: string;
    }[],
  ) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.details = details;
  }

  format(): ResBodyDetailedError {
    return detailedError(this.details);
  }
}
