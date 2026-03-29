import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<string>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<string>().error('Item not found');
    }

    await this.prismaService.item.delete({
      where: { id },
    });

    return new BaseResult<string>().ok('Item deleted successfully');
  }
}