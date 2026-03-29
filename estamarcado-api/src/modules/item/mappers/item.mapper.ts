import { ItemCreateDto } from '../dto/item-create.dto';
import { ItemResponseDto } from '../dto/item-response.dto';
import { ItemUpdateDto } from '../dto/item-update.dto';

export class ItemMapper {
  /**
   * Transforms incoming DTO to Prisma create/update data
   */
  static toPersistence(
    dto: ItemCreateDto | ItemUpdateDto,
  ): any {
    return {
      empresaId: dto.empresaId,
      tipoId: dto.tipoId,
      nome: dto.nome,
      unidadeCompra: dto.unidadeCompra,
      unidadeConsumo: dto.unidadeConsumo,
      fatorConversao: dto.fatorConversao,
      estoqueMinimo: dto.estoqueMinimo,
      precoVenda: dto.precoVenda,
      custoMedioAtual: dto.custoMedioAtual,
    };
  }

  /**
   * Transforms Prisma entity to API response DTO
   */
  static toResponse(entity: any): ItemResponseDto {
    return {
      id: entity.id,
      empresaId: entity.empresaId,
      tipoId: entity.tipoId,
      nome: entity.nome,
      unidadeCompra: entity.unidadeCompra,
      unidadeConsumo: entity.unidadeConsumo,
      fatorConversao: entity.fatorConversao,
      estoqueMinimo: entity.estoqueMinimo,
      precoVenda: entity.precoVenda,
      custoMedioAtual: entity.custoMedioAtual,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps array of entities to response DTOs
   */
  static toResponses(entities: any[]): ItemResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
