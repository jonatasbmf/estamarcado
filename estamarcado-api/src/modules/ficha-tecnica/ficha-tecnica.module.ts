import { Module } from '@nestjs/common';
import { FichaTecnicaController } from './api/ficha-tecnica.controller';
import { FichaTecnicaService } from './application/ficha-tecnica.service';
import { FichaTecnicaRepository } from './repository/ficha-tecnica.repository';
import { CreateFichaTecnicaUseCase } from './application/useCase/create-ficha-tecnica.usecase';
import { GetFichaTecnicaByIdUseCase } from './application/useCase/get-ficha-tecnica-by-id.usecase';
import { UpdateFichaTecnicaUseCase } from './application/useCase/update-ficha-tecnica.usecase';
import { DeleteFichaTecnicaUseCase } from './application/useCase/delete-ficha-tecnica.usecase';
import { DatabaseModule } from 'src/core/database/database.module';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FichaTecnicaController],
  providers: [
    FichaTecnicaService,
    FichaTecnicaRepository,
    CreateFichaTecnicaUseCase,
    GetFichaTecnicaByIdUseCase,
    UpdateFichaTecnicaUseCase,
    DeleteFichaTecnicaUseCase,
    PrismaService,
  ],
  exports: [FichaTecnicaService],
})
export class FichaTecnicaModule {}
