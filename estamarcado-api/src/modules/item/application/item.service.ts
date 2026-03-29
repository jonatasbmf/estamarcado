import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { Prisma } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemCreateDto } from '../dto/item-create.dto';
import { ItemResponseDto } from '../dto/item-response.dto';
import { ItemUpdateDto } from '../dto/item-update.dto';
import { ItemRepository } from '../repository/item.repository';
import { CreateItemUseCase } from './useCase/create-item-usecase';
import { DeleteItemUseCase } from './useCase/delete-item-usecase';
import { GetItemByIdUseCase } from './useCase/get-item-by-id-usecase';
import { UpdateItemUseCase } from './useCase/update-item-usecase';

@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly itemRepository: ItemRepository,
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
  ) {}

  async getById(id: string): Promise<BaseResult<ItemResponseDto>> {
    return this.getItemByIdUseCase.execute(id);
  }

  async update(
    id: string,
    updateDto: ItemUpdateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    return this.updateItemUseCase.execute(id, updateDto);
  }

  async getAll(
    pagination: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<ItemResponseDto>>> {
    const { skip, take } = getPaginationParams(pagination);
    const search = pagination.search;

    const where: Prisma.ItemWhereInput = search
      ? {
          nome: { contains: search, mode: 'insensitive' },
        }
      : {};

    const orderBy: Prisma.ItemOrderByWithRelationInput = pagination.sort
      ? { [pagination.sort]: pagination.order || 'asc' }
      : { nome: 'asc' };

    const [data, total] = await Promise.all([
      this.itemRepository.findAll({ skip, take, where, orderBy }),
      this.itemRepository.count(where),
    ]);

    if (!data) {
      return new BaseResult<PaginatedResult<ItemResponseDto>>().error(
        'Items not found',
      );
    }

    const items: ItemResponseDto[] = data.map((element) => ({
      id: element.id,
      empresaId: element.empresaId,
      tipoId: element.tipoId,
      nome: element.nome,
      unidadeCompra: element.unidadeCompra,
      unidadeConsumo: element.unidadeConsumo,
      fatorConversao: element.fatorConversao,
      estoqueMinimo: element.estoqueMinimo,
      precoVenda: element.precoVenda,
      custoMedioAtual: element.custoMedioAtual,
      createdAt: element.createdAt,
      updatedAt: element.updatedAt,
    }));

    return new BaseResult<PaginatedResult<ItemResponseDto>>().ok({
      data: items,
      meta: {
        total: total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 10,
        totalPages: Math.ceil(total / (pagination.limit ?? 10)),
      },
    });
  }

  async delete(id: string): Promise<BaseResult<string>> {
    return this.deleteItemUseCase.execute(id);
  }

  async create(
    itemCreateDto: ItemCreateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    return this.createItemUseCase.execute(itemCreateDto);
  }
}