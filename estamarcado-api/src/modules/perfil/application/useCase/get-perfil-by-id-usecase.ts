import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilResponseDto } from '../../dto/perfil-response.dto';
import { PerfilMapper } from '../../mappers/perfil.mapper';

@Injectable()
export class GetPerfilByIdUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<PerfilResponseDto>> {
    const perfil = await this.prismaService.perfil.findUnique({
      where: { id },
    });

    if (!perfil) {
      return new BaseResult<PerfilResponseDto>().error('Perfil not found');
    }

    return new BaseResult<PerfilResponseDto>().ok(
      PerfilMapper.toResponse(perfil),
    );
  }
}