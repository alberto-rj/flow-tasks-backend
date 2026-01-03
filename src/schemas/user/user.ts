import z from '@/config/zod';

import { CreatedAtSchema, UpdatedAtSchema } from '../shared/shared';

export const UserIdSchema = z
  .uuidv4({
    error: 'invalid ID.',
  })
  .openapi({
    type: 'string',
    format: 'uuid',
    title: 'userId',
    description: 'User ID.',
    example: 'UUID.v4',
  });

export const UserNameSchema = z
  .string({
    error: 'name must be string.',
  })
  .trim()
  .min(1, {
    error: 'name cannot be empty.',
  })
  .max(125, {
    error: 'name cannot exceed 125 characters.',
  })
  .openapi({
    type: 'string',
    title: 'name',
    description: 'Full name.',
    example: 'John Doe',
  });

export const UserEmailSchema = z
  .email({
    error: 'Invalid email address.',
  })
  .trim()
  .toLowerCase()
  .openapi({
    type: 'string',
    title: 'email',
    description: 'E-email address.',
    example: 'johndoe@example.com',
  });

export const UserPasswordSchema = z
  .string({
    error: 'password must be string.',
  })
  .trim()
  .min(6, {
    error: 'password must have at least 6 characters.',
  })
  .max(20, {
    error: 'password cannot exceed 20 characters.',
  })
  .openapi({
    title: 'password',
    description: 'Strong password',
    example: 'john#$@DOE12',
  });

export const ApiUserCreateSchema = z.object({
  name: UserNameSchema,
  email: UserEmailSchema,
  password: UserPasswordSchema,
});

export const ApiUserSchema = z.object({
  id: UserIdSchema,
  name: UserNameSchema,
  email: UserEmailSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export type UserCreateParams = z.infer<typeof ApiUserCreateSchema>;
