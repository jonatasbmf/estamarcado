import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { UserController } from './api/user.controller';
import { CreateUserUseCase } from './application/useCase/create-user-usecase';
import { DeleteUserUseCase } from './application/useCase/delete-user-usecase';
import { UserService } from './application/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UserRepository,
    DeleteUserUseCase,
    CreateUserUseCase,
  ],
})
export class UserModule {}
