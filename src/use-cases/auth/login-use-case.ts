import type { LoginDto } from '@/dtos/auth';
import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import { InvalidCredentialsError } from '@/utils/errors';
import { getAccessToken } from '@/utils/jwt';
import { hasCorrectHash } from '@/utils/password';

export interface LoginUseCaseParams {
  data: LoginDto;
}

export interface LoginUseCaseResult {
  user: User;
  accessToken: string;
}

export interface LoginUseCaseParseResult {
  user: UserDto;
  accessToken: string;
}

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    data: { email, password },
  }: LoginUseCaseParams): Promise<LoginUseCaseResult> {
    const foundUser = await this.userRepository.findByEmail({
      email,
    });

    if (!foundUser) {
      throw new InvalidCredentialsError();
    }

    const isPasswordCorrectlyHashed = await hasCorrectHash(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrectlyHashed) {
      throw new InvalidCredentialsError();
    }

    const accessToken = getAccessToken({
      userId: foundUser.id,
      userEmail: foundUser.email,
    });

    return { user: foundUser, accessToken };
  }

  parse({ user, accessToken }: LoginUseCaseResult): LoginUseCaseParseResult {
    const { password, ...userWithoutPassword } = user;
    const userDto: UserDto = {
      ...userWithoutPassword,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      user: userDto,
      accessToken,
    };
  }
}
