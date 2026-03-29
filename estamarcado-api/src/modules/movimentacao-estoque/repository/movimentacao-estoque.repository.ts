import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { MovimentacaoEstoque } from '@prisma/client';

@Injectable()
export class MovimentacaoEstoqueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    empresaId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<MovimentacaoEstoque[]> {
    return this.prisma.movimentacaoEstoque.findMany({
      where: { empresaId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(empresaId: string): Promise<number> {
    return this.prisma.movimentacaoEstoque.count({
      where: { empresaId },
    });
  }

  async findById(id: string): Promise<MovimentacaoEstoque | null> {
    return this.prisma.movimentacaoEstoque.findUnique({
      where: { id },
    });
  }

  async findByItemId(
    itemId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<MovimentacaoEstoque[]> {
    return this.prisma.movimentacaoEstoque.findMany({
      where: { itemId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any): Promise<MovimentacaoEstoque> {
    return this.prisma.movimentacaoEstoque.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<MovimentacaoEstoque> {
    return this.prisma.movimentacaoEstoque.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<MovimentacaoEstoque> {
    return this.prisma.movimentacaoEstoque.delete({
      where: { id },
    });
  }

  async calculateCMP(
    itemId: string,
    empresaId: string,
  ): Promise<{ custoMedio: number; quantidadeTotalEstoque: number }> {
    const movimentacoes = await this.prisma.movimentacaoEstoque.findMany({
      where: {
        itemId,
        empresaId,
      },
      orderBy: { createdAt: 'asc' },
    });

    let custoTotalEntrada = 0;
    let quantidadeTotal = 0;

    for (const mov of movimentacoes) {
      const sinal = mov.quantidade >= 0 ? 1 : -1;
      const absQuantidade = Math.abs(mov.quantidade);

      if (sinal === 1) {
        // Entrada
        const custo = mov.custoUnitario || 0;
        custoTotalEntrada += absQuantidade * custo;
        quantidadeTotal += absQuantidade;
      } else {
        // Saída
        quantidadeTotal -= absQuantidade;
      }
    }

    const custoMedio =
      quantidadeTotal > 0 ? custoTotalEntrada / quantidadeTotal : 0;

    return {
      custoMedio,
      quantidadeTotalEstoque: Math.max(0, quantidadeTotal),
    };
  }
}
