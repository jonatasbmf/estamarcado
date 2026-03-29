import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeleteFichaTecnicaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<any> {
    const fichaTecnica = await this.prisma.fichaTecnica.findUnique({
      where: { id },
    });

    if (!fichaTecnica) {
      throw new NotFoundException(`Ficha Técnica com id ${id} não encontrada`);
    }

    const deleted = await this.prisma.fichaTecnica.delete({
      where: { id },
    });

    return deleted;
  }
}
