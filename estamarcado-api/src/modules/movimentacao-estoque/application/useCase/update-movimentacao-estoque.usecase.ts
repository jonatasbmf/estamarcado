import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class UpdateMovimentacaoEstoqueUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, data: any): Promise<any> {
    const movimentacao = await this.prisma.movimentacaoEstoque.findUnique({
      where: { id },
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Movimentação de estoque com id ${id} não encontrada`,
      );
    }

    // Validar quantidade se fornecida
    if (data.quantidade && data.quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    const updated = await this.prisma.movimentacaoEstoque.update({
      where: { id },
      data,
    });

    return updated;
  }
}
