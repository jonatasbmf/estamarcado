import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class GetMovimentacaoEstoqueByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<any> {
    const movimentacao = await this.prisma.movimentacaoEstoque.findUnique({
      where: { id },
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Movimentação de estoque com id ${id} não encontrada`,
      );
    }

    return movimentacao;
  }
}
