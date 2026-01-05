import { Router } from 'express';

import { todoController } from '@/controllers';
import { authenticate, validateRequest } from '@/middlewares';
import {
  ApiCreateTodoBodySchema,
  ApiDeleteTodoListQuerySchema,
  ApiListTodoQuerySchema,
  ApiReorderTodoListBodySchema,
  ApiTodoIdParamsSchema,
  ApiUpdateTodoBodySchema,
} from '@/schemas/todo';

export const todosRoute = Router();

todosRoute.post(
  '/',
  authenticate,
  validateRequest.body(ApiCreateTodoBodySchema),
  todoController.create,
);

todosRoute.patch(
  '/:id',
  authenticate,
  validateRequest.params(ApiTodoIdParamsSchema),
  validateRequest.body(ApiUpdateTodoBodySchema),
  todoController.update,
);

todosRoute.patch(
  '/:id/completed',
  authenticate,
  validateRequest.params(ApiTodoIdParamsSchema),
  todoController.toggle,
);

todosRoute.patch(
  '/',
  authenticate,
  validateRequest.body(ApiReorderTodoListBodySchema),
  todoController.reorderList,
);

todosRoute.delete(
  '/:id',
  authenticate,
  validateRequest.params(ApiTodoIdParamsSchema),
  todoController.remove,
);

todosRoute.delete(
  '/',
  authenticate,
  validateRequest.query(ApiDeleteTodoListQuerySchema),
  todoController.removeList,
);

todosRoute.get(
  '/',
  authenticate,
  validateRequest.query(ApiListTodoQuerySchema),
  todoController.list,
);

todosRoute.get('/stats', authenticate, todoController.stats);
