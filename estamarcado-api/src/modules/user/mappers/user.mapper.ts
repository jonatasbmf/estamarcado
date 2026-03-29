import * as bcrypt from 'bcrypt';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';

export class UserMapper {
  /**
   * Transforms DTO to Prisma create data with password hashing
   * Used only in Create UseCase
   */
  static async toPersistenceWithHash(
    dto: UserCreateDto,
    empresaId: string,
  ): Promise<any> {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    return {
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      empresaId,
    };
  }

  /**
   * Transforms DTO to Prisma update data (without password hashing)
   * Used in Update UseCase if password is not being changed
   */
  static toPersistence(dto: UserUpdateDto): any {
    const data: any = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.email !== undefined) data.email = dto.email;
    return data;
  }

  /**
   * Transforms Prisma entity to API response DTO
   * Explicitly excludes senhaHash from response
   */
  static toResponse(entity: any): UserResponseDto {
    return {
      id: entity.id,
      nome: entity.nome || '',
      email: entity.email,
    };
  }

  /**
   * Maps array of entities to response DTOs
   */
  static toResponses(entities: any[]): UserResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
