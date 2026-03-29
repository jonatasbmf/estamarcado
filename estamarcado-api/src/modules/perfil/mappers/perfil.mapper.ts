import { PerfilCreateDto } from '../dto/perfil-create.dto';
import { PerfilResponseDto } from '../dto/perfil-response.dto';
import { PerfilUpdateDto } from '../dto/perfil-update.dto';

export class PerfilMapper {
  /**
   * Transforms incoming DTO to Prisma create/update data
   */
  static toPersistence(
    dto: PerfilCreateDto | PerfilUpdateDto,
  ): any {
    return {
      empresaId: dto.empresaId,
      nome: dto.nome,
    };
  }

  /**
   * Transforms Prisma entity to API response DTO
   */
  static toResponse(entity: any): PerfilResponseDto {
    return {
      id: entity.id,
      empresaId: entity.empresaId,
      nome: entity.nome,
    };
  }

  /**
   * Maps array of entities to response DTOs
   */
  static toResponses(entities: any[]): PerfilResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
