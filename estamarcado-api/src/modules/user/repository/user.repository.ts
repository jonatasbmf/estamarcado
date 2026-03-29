import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/core/database/prisma/generated/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  @Inject()
  private readonly primaService: PrismaService;

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;
    return this.primaService.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.primaService.user.count({ where });
  }
}
