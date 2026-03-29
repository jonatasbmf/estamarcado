import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilCreateDto } from '../../dto/perfil-create.dto';
import { PerfilResponseDto } from '../../dto/perfil-response.dto';

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
      data: {
        empresaId: perfilCreateDto.empresaId,
        nome: perfilCreateDto.nome,
      },
    });

    return new BaseResult<PerfilResponseDto>().ok({
      id: createdPerfil.id,
      empresaId: createdPerfil.empresaId,
      nome: createdPerfil.nome,
    });
  }
}