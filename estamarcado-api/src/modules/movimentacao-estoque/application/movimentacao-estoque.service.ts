import { Injectable } from '@nestjs/common';
import { MovimentacaoEstoqueRepository } from '../repository/movimentacao-estoque.repository';
import { CreateMovimentacaoEstoqueUseCase } from './useCase/create-movimentacao-estoque.usecase';
import { GetMovimentacaoEstoqueByIdUseCase } from './useCase/get-movimentacao-estoque-by-id.usecase';
import { UpdateMovimentacaoEstoqueUseCase } from './useCase/update-movimentacao-estoque.usecase';
import { DeleteMovimentacaoEstoqueUseCase } from './useCase/delete-movimentacao-estoque.usecase';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';

@Injectable()
export class MovimentacaoEstoqueService {
  constructor(
    private readonly repository: MovimentacaoEstoqueRepository,
    private readonly createUseCase: CreateMovimentacaoEstoqueUseCase,
    private readonly getByIdUseCase: GetMovimentacaoEstoqueByIdUseCase,
    private readonly updateUseCase: UpdateMovimentacaoEstoqueUseCase,
    private readonly deleteUseCase: DeleteMovimentacaoEstoqueUseCase,
  ) {}

  async create(data: any) {
    return this.createUseCase.execute(data);
  }

  async getById(id: string) {
    return this.getByIdUseCase.execute(id);
  }

  async update(id: string, data: any) {
    return this.updateUseCase.execute(id, data);
  }

  async delete(id: string) {
    return this.deleteUseCase.execute(id);
  }

  async getAll(empresaId: string, pagination: PaginationDto) {
    const { skip, take } = getPaginationParams(pagination);
    const [data, total] = await Promise.all([
      this.repository.findAll(
        empresaId,
        skip,
        take,
      ),
      this.repository.count(empresaId),
    ]);

    return {
      data,
      total,
      skip,
      take
    };
  }

  async getByItemId(itemId: string, pagination: PaginationDto) {
    const { skip, take } = getPaginationParams(pagination);
    const [data] = await Promise.all([
      this.repository.findByItemId(
        itemId,
        skip ,
        take ,
      ),
    ]);

    return data;
  }

  async calculateCMP(itemId: string, empresaId: string) {
    return this.repository.calculateCMP(itemId, empresaId);
  }
}
