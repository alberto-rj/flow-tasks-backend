import { StatusCodes } from 'http-status-codes';

import { type ResBodyError, error } from '../res-body';

export abstract class AppError<T> extends Error {
  public statusCode: number;

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

export class BadRequestError extends AppError<ResBodyError> {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
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

export class ResourceNotFoundError extends AppError<ResBodyError> {
  constructor(message: string = 'Resource not found.') {
    super(message, StatusCodes.NOT_FOUND);
  }

  format(): ResBodyError {
    return error(this.message);
  }
}
