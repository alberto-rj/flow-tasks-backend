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
    minimum: 1,
    maximum: 125,
  });

export const UserEmailSchema = z
  .email({
    error: 'Invalid email address.',
  })
  .min(1, {
    error: 'email cannot be empty.',
  })
  .max(220, {
    error: 'email cannot exceed 220 characters.',
  })
  .transform((email) => email.toLowerCase())
  .openapi({
    type: 'string',
    title: 'email',
    description: 'E-email address.',
    example: 'johndoe@example.com',
    minimum: 1,
    maximum: 220,
  });

export const UserPasswordSchema = z
  .string({
    error: 'password must be string.',
  })
  .min(1, {
    error: 'password cannot be empty.',
  })
  .max(220, {
    error: 'password cannot exceed 220 characters.',
  })
  .transform((email) => email.toLowerCase())
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
