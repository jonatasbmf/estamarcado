import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilUpdateDto } from '../../dto/perfil-update.dto';
import { PerfilResponseDto } from '../../dto/perfil-response.dto';
import { PerfilMapper } from '../../mappers/perfil.mapper';

@Injectable()
export class UpdatePerfilUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    id: string,
    perfilUpdateDto: PerfilUpdateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    const perfil = await this.prismaService.perfil.findUnique({
      where: { id },
    });

    if (!perfil) {
      return new BaseResult<PerfilResponseDto>().error('Perfil not found');
    }

    const updatedPerfil = await this.prismaService.perfil.update({
      where: { id },
      data: PerfilMapper.toPersistence(perfilUpdateDto),
    });

    return new BaseResult<PerfilResponseDto>().ok(
      PerfilMapper.toResponse(updatedPerfil),
    );
  }
}