import z from '@/config/zod';

export const CreatedAtSchema = z.string().openapi({
  type: 'string',
  format: 'datetime',
  title: 'createdAt',
  description: 'Creation date.',
  example: '2025-01-02T10:20:30Z',
});

export const UpdatedAtSchema = z.string().openapi({
  type: 'string',
  format: 'datetime',
  title: 'updatedAt',
  description: 'Last modified date.',
  example: '2025-01-02T10:20:30Z',
});
