import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemUpdateDto } from '../../dto/item-update.dto';
import { ItemResponseDto } from '../../dto/item-response.dto';
import { ItemMapper } from '../../mappers/item.mapper';

@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    id: string,
    itemUpdateDto: ItemUpdateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    const updatedItem = await this.prismaService.item.update({
      where: { id },
      data: ItemMapper.toPersistence(itemUpdateDto),
    });

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(updatedItem),
    );
  }
}