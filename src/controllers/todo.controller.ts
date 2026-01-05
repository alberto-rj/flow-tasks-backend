import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import type {
  ApiCreateTodoBody,
  ApiDeleteTodoListQuery,
  ApiListTodoQuery,
  ApiReorderTodoListBody,
  ApiTodoIdParams,
  ApiUpdateTodoBody,
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

async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;
    const { title } = req.body as ApiCreateTodoBody;

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
    const { id } = req.params as ApiTodoIdParams;

    const useCase = makeToggleTodoUseCase();
    const { item } = await useCase.execute({
      data: {
        id,
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
    const { todos } = req.body as ApiReorderTodoListBody;

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
    const { id } = req.params as ApiTodoIdParams;
    const { title, order } = req.body as ApiUpdateTodoBody;

    const useCase = makeUpdateTodoUseCase();
    const { item } = await useCase.execute({
      data: {
        id,
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
    const { id } = req.params as ApiTodoIdParams;

    const useCase = makeDeleteTodoUseCase();
    await useCase.execute({
      data: {
        id,
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
    const { filter } = req.query as ApiDeleteTodoListQuery;

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
    const { filter, sortBy, order, query } = req.query as ApiListTodoQuery;

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
