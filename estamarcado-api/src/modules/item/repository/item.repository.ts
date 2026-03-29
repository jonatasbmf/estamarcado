import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Item } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class ItemRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }): Promise<Item[]> {
    const { skip, take, where, orderBy } = params;
    return this.prismaService.item.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.ItemWhereInput): Promise<number> {
    return this.prismaService.item.count({ where });
  }
}