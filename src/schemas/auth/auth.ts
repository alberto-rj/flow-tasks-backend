import z from '@/config/zod';
import {
  UserNameSchema,
  UserEmailSchema,
  UserPasswordSchema,
} from '../user/user';

export const ApiRegisterBodySchema = z.object({
  name: UserNameSchema,
  email: UserEmailSchema,
  password: UserPasswordSchema,
});

export const ApiLoginBodySchema = z.object({
  email: UserEmailSchema,
  password: UserPasswordSchema,
});
