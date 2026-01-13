import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  ApiCreateTodoBodySchema,
  ApiDeleteTodoListQuerySchema,
  ApiDeleteTodoParamsSchemas,
  ApiFindTodoParamsSchemas,
  ApiListTodoQuerySchema,
  ApiReorderTodoListBodySchema,
  ApiToggleTodoParamsSchema,
  ApiUpdateTodoBodySchema,
  ApiUpdateTodoParamsSchema,
  type ApiCreateTodoBody,
  type ApiDeleteTodoListQuery,
  type ApiDeleteTodoParams,
  type ApiFindTodoParams,
  type ApiListTodoQuery,
  type ApiReorderTodoListBody,
  type ApiToggleTodoParams,
  type ApiUpdateTodoBody,
  type ApiUpdateTodoParams,
} from '@/schemas/todo';
import {
  makeCreateTodoUseCase,
  makeDeleteTodoListUseCase,
  makeDeleteTodoUseCase,
  makeFindTodoUseCase,
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

    const { title } = parse<ApiCreateTodoBody>(
      ApiCreateTodoBodySchema,
      req.body,
    );

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

    const { todoId } = parse<ApiToggleTodoParams>(
      ApiToggleTodoParamsSchema,
      req.params,
    );

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

    const { todos } = parse<ApiReorderTodoListBody>(
      ApiReorderTodoListBodySchema,
      req.body,
    );

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

    const { todoId } = parse<ApiUpdateTodoParams>(
      ApiUpdateTodoParamsSchema,
      req.params,
    );
    const { title, order } = parse<ApiUpdateTodoBody>(
      ApiUpdateTodoBodySchema,
      req.body,
    );

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

    const { todoId } = parse<ApiDeleteTodoParams>(
      ApiDeleteTodoParamsSchemas,
      req.params,
    );

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

    const { filter } = parse<ApiDeleteTodoListQuery>(
      ApiDeleteTodoListQuerySchema,
      req.query,
    );

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

    const { filter, sortBy, order, query } = parse<ApiListTodoQuery>(
      ApiListTodoQuerySchema,
      req.query,
    );

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

async function find(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const { todoId } = parse<ApiFindTodoParams>(
      ApiFindTodoParamsSchemas,
      req.params,
    );

    const useCase = makeFindTodoUseCase();
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

export const todoController = {
  create,
  list,
  find,
  stats,
  reorderList,
  toggle,
  update,
  remove,
  removeList,
};
