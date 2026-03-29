import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilCreateDto } from '../../dto/perfil-create.dto';
import { PerfilResponseDto } from '../../dto/perfil-response.dto';
import { PerfilMapper } from '../../mappers/perfil.mapper';

@Injectable()
export class CreatePerfilUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    perfilCreateDto: PerfilCreateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    const perfil = await this.prismaService.perfil.findFirst({
      where: { nome: perfilCreateDto.nome },
    });

    if (perfil) {
      return new BaseResult<PerfilResponseDto>().error('Perfil already exists');
    }

    const createdPerfil = await this.prismaService.perfil.create({
      data: PerfilMapper.toPersistence(perfilCreateDto),
    });

    return new BaseResult<PerfilResponseDto>().ok(
      PerfilMapper.toResponse(createdPerfil),
    );
  }
}