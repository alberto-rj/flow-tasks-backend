import type { RegisterDto } from '@/dtos/auth';
import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import { ExistingEmailError } from '@/utils/errors';
import { getAccessToken } from '@/utils/jwt';
import { getHash } from '@/utils/password';

export interface RegisterUseCaseParams {
  data: RegisterDto;
}

export interface RegisterUseCaseResult {
  user: User;
  accessToken: string;
}

export interface RegisterUseCaseParseResult {
  user: UserDto;
  accessToken: string;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    data: { name, email, password },
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResult> {
    const hasUserWithExistingEmail =
      (await this.userRepository.findByEmail({
        email,
      })) !== null;

    if (hasUserWithExistingEmail) {
      throw new ExistingEmailError();
    }

    const passwordHash = await getHash(password);

    const createdUser = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    const accessToken = getAccessToken({
      userId: createdUser.id,
      userEmail: email,
    });

    return { user: createdUser, accessToken };
  }

  parse({
    user,
    accessToken,
  }: RegisterUseCaseResult): RegisterUseCaseParseResult {
    const userDto: UserDto = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
    };

    return {
      user: userDto,
      accessToken,
    };
  }
}
