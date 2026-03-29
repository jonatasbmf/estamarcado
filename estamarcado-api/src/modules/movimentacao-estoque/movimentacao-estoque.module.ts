import { Module } from '@nestjs/common';
import { MovimentacaoEstoqueController } from './api/movimentacao-estoque.controller';
import { MovimentacaoEstoqueService } from './application/movimentacao-estoque.service';
import { MovimentacaoEstoqueRepository } from './repository/movimentacao-estoque.repository';
import { CreateMovimentacaoEstoqueUseCase } from './application/useCase/create-movimentacao-estoque.usecase';
import { GetMovimentacaoEstoqueByIdUseCase } from './application/useCase/get-movimentacao-estoque-by-id.usecase';
import { UpdateMovimentacaoEstoqueUseCase } from './application/useCase/update-movimentacao-estoque.usecase';
import { DeleteMovimentacaoEstoqueUseCase } from './application/useCase/delete-movimentacao-estoque.usecase';
import { DatabaseModule } from 'src/core/database/database.module';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MovimentacaoEstoqueController],
  providers: [
    MovimentacaoEstoqueService,
    MovimentacaoEstoqueRepository,
    CreateMovimentacaoEstoqueUseCase,
    GetMovimentacaoEstoqueByIdUseCase,
    UpdateMovimentacaoEstoqueUseCase,
    DeleteMovimentacaoEstoqueUseCase,
    PrismaService,
  ],
  exports: [MovimentacaoEstoqueService],
})
export class MovimentacaoEstoqueModule {}
