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
import { FichaTecnicaService } from '../application/ficha-tecnica.service';
import { FichaTecnicaCreateDto } from '../dto/ficha-tecnica-create.dto';
import { FichaTecnicaUpdateDto } from '../dto/ficha-tecnica-update.dto';
import { BaseResult } from 'src/common/base-result';
import { PaginationDto } from 'src/common/pagination';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('fichas-tecnicas')
@UseGuards(JwtAuthGuard)
export class FichaTecnicaController {
  constructor(private readonly service: FichaTecnicaService) {}

  @Post('create')
  async create(
    @Body() dto: FichaTecnicaCreateDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.create(dto.empresaId, dto.itemId);
      return new BaseResult().ok(data);
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
    @Body() dto: FichaTecnicaUpdateDto,
  ): Promise<BaseResult<any>> {
    try {
      const data = await this.service.update(id, dto.itemId);
      return new BaseResult().ok(data);
    } catch (error) {
      return new BaseResult().error(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResult<any>> {
    try {
      await this.service.delete(id);
      return new BaseResult().ok('Ficha Técnica deletada com sucesso');
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
}
