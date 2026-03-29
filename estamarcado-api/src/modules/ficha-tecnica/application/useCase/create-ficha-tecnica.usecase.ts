import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FichaTecnicaCreateDto } from '../../dto/ficha-tecnica-create.dto';
import { FichaTecnicaResponseDto } from '../../dto/ficha-tecnica-response.dto';
import { FichaTecnicaMapper } from '../../mappers/ficha-tecnica.mapper';

@Injectable()
export class CreateFichaTecnicaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    dto: FichaTecnicaCreateDto,
  ): Promise<BaseResult<FichaTecnicaResponseDto>> {
    // Validar se o Item existe e pertence à empresa
    const item = await this.prisma.item.findFirst({
      where: { id: dto.itemId, empresaId: dto.empresaId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item com id ${dto.itemId} não encontrado para a empresa ${dto.empresaId}`,
      );
    }

    // Criar a Ficha Técnica
    const fichaTecnica = await this.prisma.fichaTecnica.create({
      data: FichaTecnicaMapper.toPersistence(dto),
      include: { itens: true },
    });

    return new BaseResult<FichaTecnicaResponseDto>().ok(
      FichaTecnicaMapper.toResponse(fichaTecnica),
    );
  }
}
