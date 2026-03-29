import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { MovimentacaoEstoqueUpdateDto } from '../../dto/movimentacao-estoque-update.dto';
import { MovimentacaoEstoqueResponseDto } from '../../dto/movimentacao-estoque-response.dto';
import { MovimentacaoEstoqueMapper } from '../../mappers/movimentacao-estoque.mapper';

@Injectable()
export class UpdateMovimentacaoEstoqueUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    data: MovimentacaoEstoqueUpdateDto,
  ): Promise<BaseResult<MovimentacaoEstoqueResponseDto>> {
    const movimentacao = await this.prisma.movimentacaoEstoque.findUnique({
      where: { id },
    });

    if (!movimentacao) {
     return new BaseResult<MovimentacaoEstoqueResponseDto>().error(
        `Movimentação de estoque com id ${id} não encontrada`,
      );
    }

    // Validar quantidade se fornecida
    if (data.quantidade && data.quantidade <= 0) {
      return new BaseResult<MovimentacaoEstoqueResponseDto>().error('Quantidade deve ser maior que zero');
    }

    const updated = await this.prisma.movimentacaoEstoque.update({
      where: { id },
      data: MovimentacaoEstoqueMapper.toPersistence(data),
    });

    return new BaseResult<MovimentacaoEstoqueResponseDto>().ok(
      MovimentacaoEstoqueMapper.toResponse(updated),
    );
  }
}
