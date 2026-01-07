import type { Request, Response, NextFunction } from 'express';
import { ZodObject, z } from 'zod';

import { parse } from '@/utils/schemas';

function body(schema: ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      parse(schema, req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

function params(schema: ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      parse(schema, req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

function query(schema: ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      parse(schema, req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}

function all({
  params,
  query,
  body,
}: {
  params: ZodObject;
  query: ZodObject;
  body: ZodObject;
}) {
  const schema = z.object({
    params,
    query,
    body,
  });

  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      parse(schema, req);
      next();
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
