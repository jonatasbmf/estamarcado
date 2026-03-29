import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class UpdateFichaTecnicaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, itemId?: string): Promise<any> {
    // Validar se a Ficha Técnica existe
    const fichaTecnica = await this.prisma.fichaTecnica.findUnique({
      where: { id },
    });

    if (!fichaTecnica) {
      throw new NotFoundException(`Ficha Técnica com id ${id} não encontrada`);
    }

    // Se itemId foi fornecido, validar se o item existe
    if (itemId) {
      const item = await this.prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundException(`Item com id ${itemId} não encontrado`);
      }
    }

    const updated = await this.prisma.fichaTecnica.update({
      where: { id },
      data: {
        ...(itemId && { itemId }),
      },
      include: { itens: true },
    });

    return updated;
  }
}
