import type { UserDto } from '@/dtos/user';
import type { User } from '@/entities';

export function toUserDto(user: User): UserDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;

  const userDto: UserDto = {
    ...userWithoutPassword,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  return userDto;
}
