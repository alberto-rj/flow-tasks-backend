import type { UserDto } from '@/dtos/user';
import type { UserRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';
import { toUserDto } from './to-user-dto';

interface ProfileUseCaseParams {
  userId: string;
}

interface ProfileUseCaseResult {
  user: UserDto;
}

export class ProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: ProfileUseCaseParams): Promise<ProfileUseCaseResult> {
    const foundUser = await this.userRepository.findById({ userId });

    if (!foundUser) {
      throw new ResourceNotFoundError();
    }

    const userDto = toUserDto(foundUser);

    return {
      user: userDto,
    };
  }
}
