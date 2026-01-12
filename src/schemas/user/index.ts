import z from '@/config/zod';
import {
  createApiResultResponseSchema,
  CreatedAtSchema,
  UpdatedAtSchema,
} from '@/schemas/common';

export const UserIdSchema = z
  .string({
    error: 'userId must be a string.',
  })
  .trim()
  .regex(z.regexes.guid, {
    error: 'userId must be a valid UUID.',
  })
  .openapi({
    title: 'userId',
    description: 'Unique identifier of the user.',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  });

export const UserNameSchema = z
  .string({
    error: 'name must be a string.',
  })
  .trim()
  .min(1, {
    error: 'name is required.',
  })
  .max(125, {
    error: 'name cannot exceed 125 characters.',
  })
  .openapi({
    title: 'name',
    description: 'User full name.',
    example: 'John Doe',
  });

export const UserEmailSchema = z
  .string({
    error: 'email must be a string.',
  })
  .trim()
  .regex(z.regexes.email, {
    error: 'email must be a valid email address.',
  })
  .openapi({
    title: 'email',
    description: 'E-email address.',
    format: 'email',
    example: 'johndoe@example.com',
  });

export const UserPasswordSchema = z
  .string({
    error: 'password must be a string.',
  })
  .trim()
  .min(8, {
    error: 'password must have at least 8 characters.',
  })
  .max(64, {
    error: 'password cannot exceed 64 characters.',
  })
  .regex(/(?=.*[a-z])/, {
    error: 'password must include at least 1 lowercase letter.',
  })
  .regex(/(?=.*[A-Z])/, {
    error: 'password must include at least 1 uppercase letter.',
  })
  .regex(/(?=.*\d)/, {
    error: 'password must include at least 1 digit.',
  })
  .openapi({
    title: 'password',
    description:
      'A strong password with at least 8 characters, including uppercase, lowercase and numbers.',
    example: 'JohnDoe12',
  });

export const ApiUserCreateBodySchema = z.object({
  name: UserNameSchema,
  email: UserEmailSchema,
  password: UserPasswordSchema,
});

export const ApiUserSchema = z.object({
  userId: UserIdSchema,
  name: UserNameSchema,
  email: UserEmailSchema,
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema,
});

export const ApiUserResultResponseSchema =
  createApiResultResponseSchema(ApiUserSchema);
