import z from '@/config/zod';
import {
  UserEmailSchema,
  UserPasswordSchema,
  ApiUserCreateBodySchema,
} from '@/schemas/user';

export const ApiRegisterBodySchema = ApiUserCreateBodySchema;

export const ApiLoginBodySchema = z.object({
  email: UserEmailSchema,
  password: UserPasswordSchema,
});

export type ApiRegisterBody = z.infer<typeof ApiRegisterBodySchema>;

export type ApiLoginBody = z.infer<typeof ApiLoginBodySchema>;
