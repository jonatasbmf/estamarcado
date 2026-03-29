import { Inject, Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeleteUserUseCase {
  @Inject()
  private readonly prismaService: PrismaService;

  async execute(id: number): Promise<BaseResult<string>> {
    var user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return new BaseResult<string>().error('Usuário não encontrado.');
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return new BaseResult<string>().ok('Usuário deletado com sucesso.');
  }
}
