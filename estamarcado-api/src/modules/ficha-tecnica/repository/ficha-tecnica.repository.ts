import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FichaTecnica } from '@prisma/client';

@Injectable()
export class FichaTecnicaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    empresaId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<FichaTecnica[]> {
    return this.prisma.fichaTecnica.findMany({
      where: { empresaId },
      skip,
      take,
      include: { itens: true },
    });
  }

  async count(empresaId: string): Promise<number> {
    return this.prisma.fichaTecnica.count({
      where: { empresaId },
    });
  }

  async findById(id: string): Promise<FichaTecnica | null> {
    return this.prisma.fichaTecnica.findUnique({
      where: { id },
      include: { itens: true },
    });
  }

  async create(data: any): Promise<FichaTecnica> {
    return this.prisma.fichaTecnica.create({
      data,
      include: { itens: true },
    });
  }

  async update(id: string, data: any): Promise<FichaTecnica> {
    return this.prisma.fichaTecnica.update({
      where: { id },
      data,
      include: { itens: true },
    });
  }

  async delete(id: string): Promise<FichaTecnica> {
    return this.prisma.fichaTecnica.delete({
      where: { id },
    });
  }

  async findByItemId(itemId: string): Promise<FichaTecnica | null> {
    return this.prisma.fichaTecnica.findFirst({
      where: { itemId },
      include: { itens: true },
    });
  }
}
