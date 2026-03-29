import { FichaTecnicaCreateDto } from '../dto/ficha-tecnica-create.dto';
import { FichaTecnicaResponseDto } from '../dto/ficha-tecnica-response.dto';
import { FichaTecnicaUpdateDto } from '../dto/ficha-tecnica-update.dto';

export class FichaTecnicaMapper {
  /**
   * Transforms incoming DTO to Prisma create/update data
   */
  static toPersistence(
    dto: FichaTecnicaCreateDto | FichaTecnicaUpdateDto,
  ): any {
    return {
      itemId: dto.itemId,
    };
  }

  /**
   * Transforms Prisma entity to API response DTO
   */
  static toResponse(entity: any): FichaTecnicaResponseDto {
    return {
      id: entity.id,
      empresaId: entity.empresaId,
      itemId: entity.itemId,
      itens: entity.itens,
    };
  }

  /**
   * Maps array of entities to response DTOs
   */
  static toResponses(entities: any[]): FichaTecnicaResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
