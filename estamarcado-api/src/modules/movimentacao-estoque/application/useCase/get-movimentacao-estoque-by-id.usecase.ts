import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { MovimentacaoEstoqueResponseDto } from '../../dto/movimentacao-estoque-response.dto';
import { MovimentacaoEstoqueMapper } from '../../mappers/movimentacao-estoque.mapper';

@Injectable()
export class GetMovimentacaoEstoqueByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<BaseResult<MovimentacaoEstoqueResponseDto>> {
    const movimentacao = await this.prisma.movimentacaoEstoque.findUnique({
      where: { id },
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Movimentação de estoque com id ${id} não encontrada`,
      );
    }

    return new BaseResult<MovimentacaoEstoqueResponseDto>().ok(
      MovimentacaoEstoqueMapper.toResponse(movimentacao),
    );
  }
}
