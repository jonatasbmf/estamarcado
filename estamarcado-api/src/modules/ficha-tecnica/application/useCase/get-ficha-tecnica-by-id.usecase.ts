import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FichaTecnicaResponseDto } from '../../dto/ficha-tecnica-response.dto';
import { FichaTecnicaMapper } from '../../mappers/ficha-tecnica.mapper';

@Injectable()
export class GetFichaTecnicaByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<BaseResult<FichaTecnicaResponseDto>> {
    const fichaTecnica = await this.prisma.fichaTecnica.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!fichaTecnica) {
      throw new NotFoundException(`Ficha Técnica com id ${id} não encontrada`);
    }

    return new BaseResult<FichaTecnicaResponseDto>().ok(
      FichaTecnicaMapper.toResponse(fichaTecnica),
    );
  }
}
