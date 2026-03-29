import { Inject, Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { Prisma } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserRepository } from '../repository/user.repository';
import { CreateUserUseCase } from './useCase/create-user-usecase';
import { DeleteUserUseCase } from './useCase/delete-user-usecase';

@Injectable()
export class UserService {
  @Inject()
  private readonly deleteUserUseCase: DeleteUserUseCase;

  constructor(
    private readonly primaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly creteUserUseCase: CreateUserUseCase,
  ) {}

  async getById(id: number): Promise<BaseResult<UserResponseDto>> {
    const user = await this.primaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return new BaseResult<UserResponseDto>().error('User not found');
    }

    return new BaseResult<UserResponseDto>().ok({
      id: user.id,
      name: user.name ?? '',
      email: user.email,
    });
  }

  async update(
    id: number,
    updateDto: UserUpdateDto,
  ): Promise<BaseResult<UserResponseDto>> {
    const user = await this.primaService.user.update({
      where: { id },
      data: updateDto,
    });

    if (!user) {
      return new BaseResult<UserResponseDto>().error('User not found');
    }

    const updatedUser: UserResponseDto = {
      id: user.id,
      name: user.name ?? '',
      email: user.email,
    };

    return new BaseResult<UserResponseDto>().ok(updatedUser);
  }

  async getAll(
    pagination: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<UserResponseDto>>> {
    const { skip, take } = getPaginationParams(pagination);
    const search = pagination.search;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy: Prisma.UserOrderByWithRelationInput = pagination.sort
      ? { [pagination.sort]: pagination.order || 'asc' }
      : { name: 'asc' }; // Ordenação padrão caso nada seja enviado

    const [data, total] = await Promise.all([
      this.userRepository.findAll({ skip, take, where, orderBy }),
      this.userRepository.count(where),
    ]);

    if (!data) {
      return new BaseResult<PaginatedResult<UserResponseDto>>().error(
        'Users not found',
      );
    }

    const usuarios: UserResponseDto[] = data.map((element) => ({
      id: element.id,
      name: element.name ?? '',
      email: element.email,
    }));

    return new BaseResult<PaginatedResult<UserResponseDto>>().ok({
      data: usuarios,
      meta: {
        total: total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 10,
        totalPages: Math.ceil(total / (pagination.limit ?? 10)),
      },
    });
  }

  async delete(id: number): Promise<BaseResult<string>> {
    const result = await this.deleteUserUseCase.execute(id);

    return result;
  }

  async create(
    UserCreateDto: UserCreateDto,
  ): Promise<BaseResult<UserResponseDto> | BaseResult<string>> {
    return this.creteUserUseCase.execute(UserCreateDto);
  }
}
