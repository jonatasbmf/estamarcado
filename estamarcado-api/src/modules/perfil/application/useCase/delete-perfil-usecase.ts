import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeletePerfilUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<string>> {
    const perfil = await this.prismaService.perfil.findUnique({
      where: { id },
    });

    if (!perfil) {
      return new BaseResult<string>().error('Perfil not found');
    }

    await this.prismaService.perfil.delete({
      where: { id },
    });

    return new BaseResult<string>().ok('Perfil deleted successfully');
  }
}