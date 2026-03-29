import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { Prisma } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilCreateDto } from '../dto/perfil-create.dto';
import { PerfilResponseDto } from '../dto/perfil-response.dto';
import { PerfilUpdateDto } from '../dto/perfil-update.dto';
import { PerfilRepository } from '../repository/perfil.repository';
import { CreatePerfilUseCase } from './useCase/create-perfil-usecase';
import { DeletePerfilUseCase } from './useCase/delete-perfil-usecase';
import { GetPerfilByIdUseCase } from './useCase/get-perfil-by-id-usecase';
import { UpdatePerfilUseCase } from './useCase/update-perfil-usecase';

@Injectable()
export class PerfilService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly perfilRepository: PerfilRepository,
    private readonly createPerfilUseCase: CreatePerfilUseCase,
    private readonly getPerfilByIdUseCase: GetPerfilByIdUseCase,
    private readonly updatePerfilUseCase: UpdatePerfilUseCase,
    private readonly deletePerfilUseCase: DeletePerfilUseCase,
  ) {}

  async getById(id: string): Promise<BaseResult<PerfilResponseDto>> {
    return this.getPerfilByIdUseCase.execute(id);
  }

  async update(
    id: string,
    updateDto: PerfilUpdateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    return this.updatePerfilUseCase.execute(id, updateDto);
  }

  async getAll(
    pagination: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<PerfilResponseDto>>> {
    const { skip, take } = getPaginationParams(pagination);
    const search = pagination.search;

    const where: Prisma.PerfilWhereInput = search
      ? {
          nome: { contains: search, mode: 'insensitive' },
        }
      : {};

    const orderBy: Prisma.PerfilOrderByWithRelationInput = pagination.sort
      ? { [pagination.sort]: pagination.order || 'asc' }
      : { nome: 'asc' };

    const [data, total] = await Promise.all([
      this.perfilRepository.findAll({ skip, take, where, orderBy }),
      this.perfilRepository.count(where),
    ]);

    if (!data) {
      return new BaseResult<PaginatedResult<PerfilResponseDto>>().error(
        'Perfis not found',
      );
    }

    const perfis: PerfilResponseDto[] = data.map((element) => ({
      id: element.id,
      empresaId: element.empresaId,
      nome: element.nome,
    }));

    return new BaseResult<PaginatedResult<PerfilResponseDto>>().ok({
      data: perfis,
      meta: {
        total: total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 10,
        totalPages: Math.ceil(total / (pagination.limit ?? 10)),
      },
    });
  }

  async delete(id: string): Promise<BaseResult<string>> {
    return this.deletePerfilUseCase.execute(id);
  }

  async create(
    perfilCreateDto: PerfilCreateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    return this.createPerfilUseCase.execute(perfilCreateDto);
  }
}