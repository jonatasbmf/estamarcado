import { Injectable } from '@nestjs/common';
import { FichaTecnicaRepository } from '../repository/ficha-tecnica.repository';
import { CreateFichaTecnicaUseCase } from './useCase/create-ficha-tecnica.usecase';
import { GetFichaTecnicaByIdUseCase } from './useCase/get-ficha-tecnica-by-id.usecase';
import { UpdateFichaTecnicaUseCase } from './useCase/update-ficha-tecnica.usecase';
import { DeleteFichaTecnicaUseCase } from './useCase/delete-ficha-tecnica.usecase';
import { getPaginationParams, PaginationDto } from 'src/common/pagination';

@Injectable()
export class FichaTecnicaService {
  constructor(
    private readonly repository: FichaTecnicaRepository,
    private readonly createUseCase: CreateFichaTecnicaUseCase,
    private readonly getByIdUseCase: GetFichaTecnicaByIdUseCase,
    private readonly updateUseCase: UpdateFichaTecnicaUseCase,
    private readonly deleteUseCase: DeleteFichaTecnicaUseCase,
  ) {}

  async create(empresaId: string, itemId: string) {
    return this.createUseCase.execute(empresaId, itemId);
  }

  async getById(id: string) {
    return this.getByIdUseCase.execute(id);
  }

  async update(id: string, itemId?: string) {
    return this.updateUseCase.execute(id, itemId);
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
        take
      ),       
      this.repository.count(empresaId),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }
}
