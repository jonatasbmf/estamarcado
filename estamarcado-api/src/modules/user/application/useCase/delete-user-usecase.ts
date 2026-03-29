import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeleteUserUseCase {
  @Inject()
  private readonly prismaService: PrismaService;

  async execute(id: number): Promise<string> {
    var user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return 'Usuário não encontrado.';
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return 'Usuário deletado com sucesso.';
  }
}
