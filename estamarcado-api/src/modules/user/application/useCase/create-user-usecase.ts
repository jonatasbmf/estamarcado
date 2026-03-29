import { Injectable } from '@nestjs/common';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UserCreateDto } from '../../dto/user-create.dto';
import { UserResponseDto } from '../../dto/user-response.dto';
import { UserMapper } from '../../mappers/user.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    usercreateDto: UserCreateDto,
  ): Promise<BaseResult<UserResponseDto>> {
    const user = await this.prismaService.usuario.findFirst({
      where: { email: usercreateDto.email },
    });

    if (user) {
      return new BaseResult<UserResponseDto>().error('Email already exists');
    }

    const createdUser = await this.prismaService.usuario.create({
      data: await UserMapper.toPersistenceWithHash(
        usercreateDto,
        'empresa-admin', // TODO: get from context or param
      ),
    });

    return new BaseResult<UserResponseDto>().ok(
      UserMapper.toResponse(createdUser),
    );
  }
}
