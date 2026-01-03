import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodObject } from 'zod';

import { validationError } from '@/utils/res-body';

function body(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, error: zodError } = schema.safeParse(req.body);

      if (success) {
        return next();
      }

      const properties = z.treeifyError(zodError).properties;

      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationError(properties));
    } catch (err) {
      next(err);
    }
  };
}

function params(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);

      if (result.success) {
        return next();
      }

      const properties = z.treeifyError(result.error).properties;

      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationError(properties));
    } catch (error) {
      next(error);
    }
  };
}

function query(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (result.success) {
        return next();
      }

      const properties = z.treeifyError(result.error).properties;

      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationError(properties));
    } catch (error) {
      next(error);
    }
  };
}

function all(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req);

      if (result.success) {
        return next();
      }

      const properties = z.treeifyError(result.error).properties;

      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(validationError(properties));
    } catch (error) {
      next(error);
    }
  };
}

export const validateRequest = {
  all,
  query,
  body,
  params,
};
