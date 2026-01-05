import type { UserDto } from '@/dtos/user';
import type { UserRepository } from '@/repositories';
import { ResourceNotFoundError } from '@/utils/errors';

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
    const foundUser = await this.userRepository.findById({ id: userId });

    if (!foundUser) {
      throw new ResourceNotFoundError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = foundUser;
    const userDto: UserDto = {
      ...userWithoutPassword,
      createdAt: foundUser.createdAt.toISOString(),
      updatedAt: foundUser.updatedAt.toISOString(),
    };

    return {
      user: userDto,
    };
  }
}
