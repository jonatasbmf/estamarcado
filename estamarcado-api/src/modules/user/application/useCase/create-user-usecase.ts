import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseResult } from 'src/common/base-result';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UserCreateDto } from '../../dto/user-create.dto';
import { UserResponseDto } from '../../dto/user-response.dto';

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

    const senhaHash = await bcrypt.hash(usercreateDto.senha, 10);

    const createdUser = await this.prismaService.usuario.create({
      data: {
        nome: usercreateDto.nome,
        email: usercreateDto.email,
        senhaHash,
        empresaId: 'empresa-admin', // TODO: get from context or param
      },
    });

    return new BaseResult<UserResponseDto>().ok({
      id: createdUser.id,
      nome: createdUser.nome ?? '',
      email: createdUser.email,
    });
  }
}
