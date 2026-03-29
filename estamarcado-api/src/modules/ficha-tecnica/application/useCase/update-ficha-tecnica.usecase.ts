import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FichaTecnicaUpdateDto } from '../../dto/ficha-tecnica-update.dto';
import { FichaTecnicaResponseDto } from '../../dto/ficha-tecnica-response.dto';
import { FichaTecnicaMapper } from '../../mappers/ficha-tecnica.mapper';

@Injectable()
export class UpdateFichaTecnicaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    dto: FichaTecnicaUpdateDto,
  ): Promise<BaseResult<FichaTecnicaResponseDto>> {
    // Validar se a Ficha Técnica existe
    const fichaTecnica = await this.prisma.fichaTecnica.findUnique({
      where: { id },
    });

    if (!fichaTecnica) {
      throw new NotFoundException(`Ficha Técnica com id ${id} não encontrada`);
    }

    // Se itemId foi fornecido, validar se o item existe
    if (dto.itemId) {
      const item = await this.prisma.item.findUnique({
        where: { id: dto.itemId },
      });

      if (!item) {
        throw new NotFoundException(`Item com id ${dto.itemId} não encontrado`);
      }
    }

    const updated = await this.prisma.fichaTecnica.update({
      where: { id },
      data: FichaTecnicaMapper.toPersistence(dto),
      include: { itens: true },
    });

    return new BaseResult<FichaTecnicaResponseDto>().ok(
      FichaTecnicaMapper.toResponse(updated),
    );
  }
}
