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
import { PerfilService } from '../application/perfil.service';
import { PerfilCreateDto } from '../dto/perfil-create.dto';
import { PerfilResponseDto } from '../dto/perfil-response.dto';
import { PerfilUpdateDto } from '../dto/perfil-update.dto';

@Controller('perfil')
export class PerfilController {
  @Inject()
  private readonly perfilService: PerfilService;

  @Post('create')
  async create(
    @Body() perfilCreateDto: PerfilCreateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    return await this.perfilService.create(perfilCreateDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BaseResult<PerfilResponseDto>> {
    return await this.perfilService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: PerfilUpdateDto,
  ): Promise<BaseResult<PerfilResponseDto>> {
    return await this.perfilService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResult<string>> {
    return await this.perfilService.delete(id);
  }

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<PerfilResponseDto>>> {
    return await this.perfilService.getAll(paginationDto);
  }
}