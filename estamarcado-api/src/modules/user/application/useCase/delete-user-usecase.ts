import { Inject, Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeleteUserUseCase {
  @Inject()
  private readonly prismaService: PrismaService;

  async execute(id: string): Promise<BaseResult<string>> {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return new BaseResult<string>().error('Usuário não encontrado.');
    }

    await this.prismaService.usuario.delete({
      where: {
        id,
      },
    });

    return new BaseResult<string>().ok('Usuário deletado com sucesso.');
  }
}
