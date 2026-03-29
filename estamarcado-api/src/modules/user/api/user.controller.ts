import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination';
import { PaginatedResult } from 'src/common/patinated-result';
import { UserService } from '../application/user.service';
import type { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Post('create')
  async create(@Body() UserCreateDto: UserCreateDto) {
    const user = await this.userService.create(UserCreateDto);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(+id);
  }

  @Get()
  async getAll(
    @Query() PaginationDto: PaginationDto,
  ): Promise<PaginatedResult<UserResponseDto> | null> {
    const result = await this.userService.getAll(PaginationDto);
    if (!result) {
      return null;
    }
    return result;
  }
}
