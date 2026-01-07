import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  makeLoginUseCase,
  makeProfileUseCase,
  makeRegisterUseCase,
} from '@/utils/factory';
import {
  clearAccessTokenCookie,
  getAccessToken,
  setAccessTokenCookie,
  type AuthPayload,
  type AuthRequest,
} from '@/utils/jwt';
import { result } from '@/utils/res-body';
import {
  ApiLoginBodySchema,
  ApiRegisterBodySchema,
  type ApiLoginBody,
  type ApiRegisterBody,
} from '@/schemas/auth';
import { parse } from '@/utils/schemas';

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = parse<ApiRegisterBody>(ApiRegisterBodySchema, req.body);

    const useCase = makeRegisterUseCase();
    const useCaseResult = await useCase.execute({ data });
    const { user } = useCase.parse(useCaseResult);

    const accessToken = getAccessToken({
      userId: user.userId,
      userEmail: user.email,
    });
    setAccessTokenCookie(res, accessToken);

    res.status(StatusCodes.CREATED).json(result(user));
  } catch (error) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = parse<ApiLoginBody>(ApiLoginBodySchema, req.body);

    const useCase = makeLoginUseCase();
    const useCaseResult = await useCase.execute({ data });
    const { user } = useCase.parse(useCaseResult);

    const accessToken = getAccessToken({
      userId: user.userId,
      userEmail: user.email,
    });
    setAccessTokenCookie(res, accessToken);

    res.status(StatusCodes.OK).json(result(user));
  } catch (error) {
    next(error);
  }
}

async function profile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.payload as AuthPayload;

    const useCase = makeProfileUseCase();
    const { user } = await useCase.execute({ userId });

    res.status(StatusCodes.OK).json(result(user));
  } catch (error) {
    next(error);
  }
}

function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const payload = req.payload as AuthPayload;

    const accessToken = getAccessToken(payload);
    setAccessTokenCookie(res, accessToken);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    clearAccessTokenCookie(res);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

export const authController = {
  register,
  login,
  profile,
  refresh,
  logout,
};
