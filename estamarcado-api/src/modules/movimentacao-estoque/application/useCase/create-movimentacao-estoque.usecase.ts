import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { MovimentacaoEstoqueRepository } from '../../repository/movimentacao-estoque.repository';

@Injectable()
export class CreateMovimentacaoEstoqueUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: MovimentacaoEstoqueRepository,
  ) {}

  async execute(data: any): Promise<any> {
    const {
      empresaId,
      itemId,
      localId,
      tipoId,
      quantidade,
      custoUnitario,
      documentoTipo,
      documentoId,
      observacao,
    } = data;

    // Validar item
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, empresaId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item com id ${itemId} não encontrado para a empresa ${empresaId}`,
      );
    }

    // Validar local de estoque
    const local = await this.prisma.estoqueLocal.findFirst({
      where: { id: localId, empresaId },
    });

    if (!local) {
      throw new NotFoundException(
        `Local de estoque com id ${localId} não encontrado`,
      );
    }

    // Validar tipo de movimentação
    const tipo = await this.prisma.tipoMovimentacao.findUnique({
      where: { id: tipoId },
    });

    if (!tipo) {
      throw new NotFoundException(`Tipo de movimentação com id ${tipoId} não encontrado`);
    }

    // Validar quantidade
    if (quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    // Criar movimentação
    const movimentacao = await this.prisma.movimentacaoEstoque.create({
      data: {
        empresaId,
        itemId,
        localId,
        tipoId,
        quantidade: tipo.sinal === -1 ? -quantidade : quantidade,
        ...(custoUnitario && { custoUnitario }),
        ...(documentoTipo && { documentoTipo }),
        ...(documentoId && { documentoId }),
        ...(observacao && { observacao }),
      },
    });

    // Atualizar CMP do item (Preço Médio Ponderado)
    if (tipo.sinal === 1) {
      // Só atualiza em entradas
      const { custoMedio } = await this.repository.calculateCMP(
        itemId,
        empresaId,
      );

      await this.prisma.item.update({
        where: { id: itemId },
        data: { custoMedioAtual: custoMedio },
      });
    }

    return movimentacao;
  }
}
