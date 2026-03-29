import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ItemCreateDto } from '../../dto/item-create.dto';
import { ItemResponseDto } from '../../dto/item-response.dto';
import { ItemMapper } from '../../mappers/item.mapper';

@Injectable()
export class CreateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    itemCreateDto: ItemCreateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    const createdItem = await this.prismaService.item.create({
      data: ItemMapper.toPersistence(itemCreateDto),
    });

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(createdItem),
    );
  }
}