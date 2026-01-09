import { Router } from 'express';

import { todoController } from '@/controllers';
import { authenticate } from '@/middlewares';

export const todosRoute = Router();

todosRoute.post('/', authenticate, todoController.create);

todosRoute.patch('/:todoId', authenticate, todoController.update);

todosRoute.patch('/:todoId/completed', authenticate, todoController.toggle);

todosRoute.patch('/', authenticate, todoController.reorderList);

todosRoute.delete('/:todoId', authenticate, todoController.remove);

todosRoute.delete('/', authenticate, todoController.removeList);

todosRoute.get('/', authenticate, todoController.list);

todosRoute.get('/stats', authenticate, todoController.stats);
