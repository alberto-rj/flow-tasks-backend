import type { ZodObject } from 'zod';

import z from '@/config/zod';
import { ValidationError } from '@/utils/errors';

export const isoDateSchema = z.iso.datetime();

export const uuidSchema = z.guid();

export function parse<T>(schema: ZodObject, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data as T;
  }

  const properties = z.treeifyError(result.error).properties;
  throw new ValidationError(properties);
}
