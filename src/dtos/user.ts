import z from '@/config/zod';
import { ApiUserSchema } from '@/schemas/user';

export type UserDto = z.infer<typeof ApiUserSchema>;
