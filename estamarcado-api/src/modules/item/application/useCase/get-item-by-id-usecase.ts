import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemResponseDto } from '../../dto/item-response.dto';

@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    return new BaseResult<ItemResponseDto>().ok({
      id: item.id,
      empresaId: item.empresaId,
      tipoId: item.tipoId,
      nome: item.nome,
      unidadeCompra: item.unidadeCompra,
      unidadeConsumo: item.unidadeConsumo,
      fatorConversao: item.fatorConversao,
      estoqueMinimo: item.estoqueMinimo,
      precoVenda: item.precoVenda,
      custoMedioAtual: item.custoMedioAtual,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }
}