import type { LoginDto } from '@/dtos/auth';
import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import { InvalidCredentialsError } from '@/utils/errors';
import { hasCorrectHash } from '@/utils/password';
import { toUserDto } from './to-user-dto';

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
    const userDto = toUserDto(user);

    return {
      user: userDto,
    };
  }
}
