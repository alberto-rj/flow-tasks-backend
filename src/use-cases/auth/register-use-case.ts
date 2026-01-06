import type { RegisterDto } from '@/dtos/auth';
import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';
import type { UserRepository } from '@/repositories';
import { ExistingEmailError } from '@/utils/errors';
import { getHash } from '@/utils/password';
import { toUserDto } from './to-user-dto';

export interface RegisterUseCaseParams {
  data: RegisterDto;
}

export interface RegisterUseCaseResult {
  user: User;
}

export interface RegisterUseCaseParseResult {
  user: UserDto;
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

    return { user: createdUser };
  }

  parse({ user }: RegisterUseCaseResult): RegisterUseCaseParseResult {
    const userDto = toUserDto(user);

    return {
      user: userDto,
    };
  }
}
