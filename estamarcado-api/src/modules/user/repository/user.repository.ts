import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Usuario } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  @Inject()
  private readonly primaService: PrismaService;

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput;
  }): Promise<Usuario[]> {
    const { skip, take, where, orderBy } = params;
    return this.primaService.usuario.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.UsuarioWhereInput): Promise<number> {
    return this.primaService.usuario.count({ where });
  }
}
