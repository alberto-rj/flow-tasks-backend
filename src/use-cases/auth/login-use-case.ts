import type { LoginDto } from '@/dtos/auth';
import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import { InvalidCredentialsError } from '@/utils/errors';
import { hasCorrectHash } from '@/utils/password';

export interface LoginUseCaseParams {
  data: LoginDto;
}

export interface LoginUseCaseResult {
  user: User;
}

export interface LoginUseCaseParseResult {
  user: UserDto;
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

    return { user: foundUser };
  }

  parse({ user }: LoginUseCaseResult): LoginUseCaseParseResult {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const userDto: UserDto = {
      ...userWithoutPassword,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      user: userDto,
    };
  }
}
