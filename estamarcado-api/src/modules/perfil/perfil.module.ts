import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PerfilController } from './api/perfil.controller';
import { CreatePerfilUseCase } from './application/useCase/create-perfil-usecase';
import { DeletePerfilUseCase } from './application/useCase/delete-perfil-usecase';
import { GetPerfilByIdUseCase } from './application/useCase/get-perfil-by-id-usecase';
import { UpdatePerfilUseCase } from './application/useCase/update-perfil-usecase';
import { PerfilService } from './application/perfil.service';
import { PerfilRepository } from './repository/perfil.repository';

@Module({
  controllers: [PerfilController],
  providers: [
    PerfilService,
    PrismaService,
    PerfilRepository,
    CreatePerfilUseCase,
    GetPerfilByIdUseCase,
    UpdatePerfilUseCase,
    DeletePerfilUseCase,
  ],
})
export class PerfilModule {}