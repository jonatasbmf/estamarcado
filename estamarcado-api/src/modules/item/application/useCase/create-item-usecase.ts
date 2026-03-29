import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemCreateDto } from '../../dto/item-create.dto';
import { ItemResponseDto } from '../../dto/item-response.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    itemCreateDto: ItemCreateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    const createdItem = await this.prismaService.item.create({
      data: {
        empresaId: itemCreateDto.empresaId,
        tipoId: itemCreateDto.tipoId,
        nome: itemCreateDto.nome,
        unidadeCompra: itemCreateDto.unidadeCompra,
        unidadeConsumo: itemCreateDto.unidadeConsumo,
        fatorConversao: itemCreateDto.fatorConversao,
        estoqueMinimo: itemCreateDto.estoqueMinimo,
        precoVenda: itemCreateDto.precoVenda,
        custoMedioAtual: itemCreateDto.custoMedioAtual,
      },
    });

    return new BaseResult<ItemResponseDto>().ok({
      id: createdItem.id,
      empresaId: createdItem.empresaId,
      tipoId: createdItem.tipoId,
      nome: createdItem.nome,
      unidadeCompra: createdItem.unidadeCompra,
      unidadeConsumo: createdItem.unidadeConsumo,
      fatorConversao: createdItem.fatorConversao,
      estoqueMinimo: createdItem.estoqueMinimo,
      precoVenda: createdItem.precoVenda,
      custoMedioAtual: createdItem.custoMedioAtual,
      createdAt: createdItem.createdAt,
      updatedAt: createdItem.updatedAt,
    });
  }
}