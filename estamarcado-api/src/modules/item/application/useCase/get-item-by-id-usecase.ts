import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemResponseDto } from '../../dto/item-response.dto';
import { ItemMapper } from '../../mappers/item.mapper';

@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(item),
    );
  }
}