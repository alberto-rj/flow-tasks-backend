import z from '@/config/zod';

export const TodoIdSchema = z
  .uuidv4({
    error: 'invalid ID.',
  })
  .openapi({
    title: 'TodoId',
    description: 'Todo ID.',
    example: 'UUID.v4',
  });

export const TodoTitleSchema = z
  .string({
    error: 'title must be string.',
  })
  .min(1, {
    error: 'title must cannot be empty.',
  })
  .max(255, {
    error: 'title must cannot exceed 255 characters.',
  })
  .openapi({
    type: 'string',
    minimum: 1,
    maximum: 255,
    title: 'title',
    description: 'Title for todo.',
    example: 'Todo title',
  });

export const TodoCompletedAtSchema = z
  .string({
    error: 'completedAt must be ISO date',
  })
  .openapi({
    type: 'string',
    format: 'datetime',
    title: 'completedAt',
    description: 'Completion date',
    example: '2025-12-11T20:10:34Z',
  });

export const TodoOrderSchema = z
  .int({ error: 'order must be integer.' })
  .min(0, { error: 'order must be at least 0.' })
  .default(0)
  .openapi({
    type: 'number',
    title: 'order',
    description: 'Todo order.',
    example: 0,
    minimum: 0,
    default: 0,
  });

export const TodoUserIdSchema = z
  .uuidv4({
    error: 'invalid ID.',
  })
  .openapi({
    title: 'userId',
    description: 'User ID.',
    example: 'UUID.v4',
  });
