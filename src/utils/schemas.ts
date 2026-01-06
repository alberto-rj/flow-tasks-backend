import z from '@/config/zod';

export const isoDateSchema = z.iso.datetime();

export const uuidSchema = z.guid();
