import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovimentacaoEstoqueService } from '../application/movimentacao-estoque.service';
import { MovimentacaoEstoqueCreateDto } from '../dto/movimentacao-estoque-create.dto';
import { MovimentacaoEstoqueUpdateDto } from '../dto/movimentacao-estoque-update.dto';
import { BaseResult } from 'src/common/base-result';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { take } from 'rxjs/internal/operators/take';

@Controller('movimentacoes-estoque')
@UseGuards(JwtAuthGuard)
export class MovimentacaoEstoqueController {
  constructor(private readonly service: MovimentacaoEstoqueService) {}

  @Post('create')
  async create(
    @Body() dto: MovimentacaoEstoqueCreateDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.create(dto);
      return new BaseResult().ok(data)
    
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BaseResult<any>> {
    try {
      const data = await this.service.getById(id);
      return new BaseResult().ok(data);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: MovimentacaoEstoqueUpdateDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.update(id, dto);
      return new BaseResult().ok(data);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResult<any>> {
    try {
      await this.service.delete(id);
      return new BaseResult().ok(null);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Get()
  async getAll(
    @Query('empresaId') empresaId: string,
     @Query() PaginationDto: PaginationDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.getAll(empresaId, PaginationDto);
      return new BaseResult().ok(data);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Get('item/:itemId')
  async getByItemId(
    @Param('itemId') itemId: string,
     @Query() PaginationDto: PaginationDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.getByItemId(itemId, PaginationDto);
      return new BaseResult().ok(data);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }
}
