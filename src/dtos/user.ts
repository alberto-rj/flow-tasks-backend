import z from '@/config/zod';
import { ApiUserCreateBodySchema, ApiUserSchema } from '@/schemas/user';

export type UserCreateDto = z.infer<typeof ApiUserCreateBodySchema>;

export type UserFindByIdDto = {
  id: string;
};

export type UserFindByEmailDto = {
  email: string;
};

export type UserDto = z.infer<typeof ApiUserSchema>;
