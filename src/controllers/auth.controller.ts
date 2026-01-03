import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { LoginDto, RegisterDto } from '@/dtos/auth';
import { createLoginUseCase, createRegisterUseCase } from '@/utils/factory';
import {
  clearAccessTokenCookie,
  getAccessToken,
  setAccessTokenCookie,
  type AuthPayload,
  type AuthRequest,
} from '@/utils/jwt';
import { item } from '@/utils/res-body';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = req.body as RegisterDto;
    const useCase = createRegisterUseCase();
    const result = await useCase.execute({ data });
    const { accessToken, user } = useCase.parse(result);

    setAccessTokenCookie(res, accessToken);

    res.status(StatusCodes.OK).json(item('user', user));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as LoginDto;
    const useCase = createLoginUseCase();
    const result = await useCase.execute({ data });
    const { accessToken, user } = useCase.parse(result);

    setAccessTokenCookie(res, accessToken);

    res.status(StatusCodes.OK).json(item('user', user));
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.payload as AuthPayload;
    const accessToken = getAccessToken(payload);
    setAccessTokenCookie(res, accessToken);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    clearAccessTokenCookie(res);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
}
