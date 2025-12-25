import z from '@/config/zod';
import { ApiLoginBodySchema, ApiRegisterBodySchema } from '@/schemas/auth';

export type RegisterDto = z.infer<typeof ApiRegisterBodySchema>;

export type LoginDto = z.infer<typeof ApiLoginBodySchema>;
