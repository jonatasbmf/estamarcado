import { Injectable } from '@nestjs/common';
import { Prisma, Perfil } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PerfilRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PerfilWhereInput;
    orderBy?: Prisma.PerfilOrderByWithRelationInput;
  }): Promise<Perfil[]> {
    const { skip, take, where, orderBy } = params;
    return this.prismaService.perfil.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.PerfilWhereInput): Promise<number> {
    return this.prismaService.perfil.count({ where });
  }
}