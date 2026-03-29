import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class CreateFichaTecnicaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(empresaId: string, itemId: string): Promise<any> {
    // Validar se o Item existe e pertence à empresa
    const item = await this.prisma.item.findFirst({
      where: { id: itemId, empresaId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item com id ${itemId} não encontrado para a empresa ${empresaId}`,
      );
    }

    // Criar a Ficha Técnica
    const fichaTecnica = await this.prisma.fichaTecnica.create({
      data: {
        empresaId,
        itemId,
      },
      include: { itens: true },
    });

    return fichaTecnica;
  }
}
