import { Inject, Injectable } from '@nestjs/common';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { Prisma } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../repository/user.repository';
import { DeleteUserUseCase } from './useCase/delete-user-usecase';

@Injectable()
export class UserService {
  @Inject()
  private readonly deleteUserUseCase: DeleteUserUseCase;

  constructor(
    private readonly primaService: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<UserResponseDto> | null> {
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

    console.log('Objeto de Ordenação:', JSON.stringify(orderBy));

    const [data, total] = await Promise.all([
      this.userRepository.findAll({ skip, take, where, orderBy }),
      this.userRepository.count(where),
    ]);

    if (!data) {
      return null;
    }

    const usuarios: UserResponseDto[] = data.map((element) => ({
      id: element.id,
      name: element.name ?? '',
      email: element.email,
    }));

    return {
      data: usuarios,
      meta: {
        total: total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 10,
        totalPages: Math.ceil(total / (pagination.limit ?? 10)),
      },
    };
  }

  async delete(id: number): Promise<string> {
    return this.deleteUserUseCase.execute(id);
  }

  async create(UserCreateDto: UserCreateDto) {
    const user = await this.primaService.user.create({
      data: {
        name: UserCreateDto.name,
        email: UserCreateDto.email,
      },
    });
    return user.id;
  }
}
