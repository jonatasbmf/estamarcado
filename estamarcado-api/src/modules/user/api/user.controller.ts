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
  Request,
} from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { UserService } from '../application/user.service';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get('test-tenant')
  testTenant(@Request() req): BaseResult<any> {
    return new BaseResult().ok({
      empresaId: req.empresaId,
      message: 'Middleware de tenant funcionando!',
    });
  }

  @Post('create')
  async create(
    @Body() UserCreateDto: UserCreateDto,
  ): Promise<BaseResult<UserResponseDto>> {
    const user = await this.userService.create(UserCreateDto);
    return user;
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BaseResult<UserResponseDto>> {
    const user = await this.userService.getById(id);
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UserUpdateDto,
  ): Promise<BaseResult<UserResponseDto>> {
    const result = await this.userService.update(id, updateDto);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResult<string>> {
    return await this.userService.delete(id);
  }

  @Get()
  async getAll(
    @Query() PaginationDto: PaginationDto,
  ): Promise<BaseResult<PaginatedResult<UserResponseDto>>> {
    const result = await this.userService.getAll(PaginationDto);
    return result;
  }
}
