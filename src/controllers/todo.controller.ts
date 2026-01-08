import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  ApiCreateTodoSchema,
  ApiDeleteTodoListSchema,
  ApiDeleteTodoSchema,
  ApiListTodoSchema,
  ApiReorderTodoListSchema,
  ApiToggleTodoSchema,
  ApiUpdateTodoSchema,
  type ApiCreateTodo,
  type ApiDeleteTodo,
  type ApiDeleteTodoList,
  type ApiListTodo,
  type ApiReorderTodoList,
  type ApiToggleTodo,
  type ApiUpdateTodo,
} from '@/schemas/todo';
import {
  makeCreateTodoUseCase,
  makeDeleteTodoListUseCase,
  makeDeleteTodoUseCase,
  makeGetTodoStatsUseCase,
  makeListTodoUseCase,
  makeReorderTodoListUseCase,
  makeToggleTodoUseCase,
  makeUpdateTodoUseCase,
} from '@/utils/factory';
import type { AuthPayload, AuthRequest } from '@/utils/jwt';
import { result, resultList } from '@/utils/res-body';
import { parse } from '@/utils/schemas';

async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      body: { title },
    } = parse<ApiCreateTodo>(ApiCreateTodoSchema, req);

    const useCase = makeCreateTodoUseCase();
    const { todo: item } = await useCase.execute({
      data: {
        title,
        userId,
      },
    });

    res.status(StatusCodes.CREATED).json(result(item));
  } catch (error) {
    next(error);
  }
}

async function toggle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      params: { todoId },
    } = parse<ApiToggleTodo>(ApiToggleTodoSchema, req);

    const useCase = makeToggleTodoUseCase();
    const { item } = await useCase.execute({
      data: {
        todoId,
        userId,
      },
    });

    res.status(StatusCodes.OK).json(result(item));
  } catch (error) {
    next(error);
  }
}

async function reorderList(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      body: { todos },
    } = parse<ApiReorderTodoList>(ApiReorderTodoListSchema, req);

    const useCase = makeReorderTodoListUseCase();
    await useCase.execute({
      data: {
        todos,
        userId,
      },
    });

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      params: { todoId },
      body: { title, order },
    } = parse<ApiUpdateTodo>(ApiUpdateTodoSchema, req);

    const useCase = makeUpdateTodoUseCase();
    const { item } = await useCase.execute({
      data: {
        todoId,
        title,
        order,
        userId,
      },
    });

    res.status(StatusCodes.OK).json(result(item));
  } catch (error) {
    next(error);
  }
}

async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      params: { todoId },
    } = parse<ApiDeleteTodo>(ApiDeleteTodoSchema, req);

    const useCase = makeDeleteTodoUseCase();
    await useCase.execute({
      data: {
        todoId,
        userId,
      },
    });

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

async function removeList(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      query: { filter },
    } = parse<ApiDeleteTodoList>(ApiDeleteTodoListSchema, req);

    const useCase = makeDeleteTodoListUseCase();
    await useCase.execute({
      data: {
        userId,
        filter,
      },
    });

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const {
      query: { filter, sortBy, order, query },
    } = parse<ApiListTodo>(ApiListTodoSchema, req);

    const useCase = makeListTodoUseCase();
    const { items } = await useCase.execute({
      data: {
        userId,
        filter,
        sortBy,
        order,
        query,
      },
    });

    res.status(StatusCodes.OK).json(resultList(items));
  } catch (error) {
    next(error);
  }
}

async function stats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const useCase = makeGetTodoStatsUseCase();
    const { stats } = await useCase.execute({
      data: {
        userId,
      },
    });

    res.status(StatusCodes.OK).json(result(stats));
  } catch (error) {
    next(error);
  }
}

export const todoController = {
  create,
  list,
  stats,
  reorderList,
  toggle,
  update,
  remove,
  removeList,
};
