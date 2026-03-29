import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { ItemService } from '../application/item.service';
import { ItemCreateDto } from '../dto/item-create.dto';
import { ItemResponseDto } from '../dto/item-response.dto';
import { ItemUpdateDto } from '../dto/item-update.dto';

@Controller('item')
export class ItemController {
  @Inject()
  private readonly itemService: ItemService;

  @Post('create')
  async create(
    @Body() itemCreateDto: ItemCreateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    return await this.itemService.create(itemCreateDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BaseResult<ItemResponseDto>> {
    return await this.itemService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: ItemUpdateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    return await this.itemService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResult<string>> {
    return await this.itemService.delete(id);
  }

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<ItemResponseDto>>> {
    return await this.itemService.getAll(paginationDto);
  }
}