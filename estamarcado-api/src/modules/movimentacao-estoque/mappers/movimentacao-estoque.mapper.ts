import { MovimentacaoEstoqueCreateDto } from '../dto/movimentacao-estoque-create.dto';
import { MovimentacaoEstoqueResponseDto } from '../dto/movimentacao-estoque-response.dto';
import { MovimentacaoEstoqueUpdateDto } from '../dto/movimentacao-estoque-update.dto';

export class MovimentacaoEstoqueMapper {
  /**
   * Transforms incoming DTO to Prisma create/update data
   */
  static toPersistence(
    dto: MovimentacaoEstoqueCreateDto | MovimentacaoEstoqueUpdateDto,
  ): any {
    return {
      quantidade: dto.quantidade,
      custoUnitario: dto.custoUnitario,
      observacao: dto.observacao,
    };
  }

  /**
   * Transforms Prisma entity to API response DTO
   */
  static toResponse(entity: any): MovimentacaoEstoqueResponseDto {
    return {
      id: entity.id,
      empresaId: entity.empresaId,
      itemId: entity.itemId,
      localId: entity.localId,
      tipoId: entity.tipoId,
      quantidade: entity.quantidade,
      custoUnitario: entity.custoUnitario,
      documentoTipo: entity.documentoTipo,
      documentoId: entity.documentoId,
      observacao: entity.observacao,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps array of entities to response DTOs
   */
  static toResponses(entities: any[]): MovimentacaoEstoqueResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
