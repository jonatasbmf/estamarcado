import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemUpdateDto } from '../../dto/item-update.dto';
import { ItemResponseDto } from '../../dto/item-response.dto';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    id: string,
    itemUpdateDto: ItemUpdateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    const updatedItem = await this.prismaService.item.update({
      where: { id },
      data: {
        empresaId: itemUpdateDto.empresaId,
        tipoId: itemUpdateDto.tipoId,
        nome: itemUpdateDto.nome,
        unidadeCompra: itemUpdateDto.unidadeCompra,
        unidadeConsumo: itemUpdateDto.unidadeConsumo,
        fatorConversao: itemUpdateDto.fatorConversao,
        estoqueMinimo: itemUpdateDto.estoqueMinimo,
        precoVenda: itemUpdateDto.precoVenda,
        custoMedioAtual: itemUpdateDto.custoMedioAtual,
      },
    });

    return new BaseResult<ItemResponseDto>().ok({
      id: updatedItem.id,
      empresaId: updatedItem.empresaId,
      tipoId: updatedItem.tipoId,
      nome: updatedItem.nome,
      unidadeCompra: updatedItem.unidadeCompra,
      unidadeConsumo: updatedItem.unidadeConsumo,
      fatorConversao: updatedItem.fatorConversao,
      estoqueMinimo: updatedItem.estoqueMinimo,
      precoVenda: updatedItem.precoVenda,
      custoMedioAtual: updatedItem.custoMedioAtual,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
    });
  }
}