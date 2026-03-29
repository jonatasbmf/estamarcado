---
name: nestjs-crud-module
description: Create a new NestJS CRUD module following Orion pattern with BaseResult responses, pagination, DTOs, and UseCases. Use when: adding a new entity module to the estamarcado-api project.
---

# NestJS CRUD Module Creation Skill

This skill automates the creation of a new CRUD module in the estamarcado-api NestJS project, adhering to the established patterns: Orion-style folder organization, BaseResult for all responses, pagination for list queries, custom DTOs (potentially partial from Prisma models), and UseCases for business logic.

## Prerequisites

- The entity must exist in the Prisma schema (`prisma/schema.prisma`).
- Auto-generated fields (ID, createdAt, updatedAt) are handled automatically.
- Assumes class-validator and class-transformer are installed for DTO validation.
- The skill will ask for field details to ensure proper DTOs and avoid exposing sensitive data.

## Workflow Steps

1. **Collect Module Information**
   - Use `vscode_askQuestions` to gather:
     - Module name (lowercase, e.g., "product")
     - Entity name (PascalCase, e.g., "Product")
     - ID type: "number" or "string" (for UUID)
     - List of fields in the entity:
       - Field name
       - Type (string, number, Date, boolean)
       - Is it auto-generated? (e.g., id, createdAt, updatedAt)
       - Is it mandatory for creation?
       - Should it be included in the response DTO? (to omit sensitive fields)
     - Searchable fields for pagination (e.g., ["name", "email"])
     - Unique fields for create validation (e.g., ["email"])

2. **Validate Prerequisites**
   - Check if the entity exists in Prisma schema using `grep_search` or `read_file` on `prisma/schema.prisma`.
   - If not, inform the user to add it first.

3. **Generate Folder Structure**
   - Create the module directory: `src/modules/{moduleName}/`
   - Subdirectories: `api/`, `application/useCase/`, `dto/`, `repository/`

4. **Generate DTOs**
   - `dto/{moduleName}-create.dto.ts`: Include all non-auto-generated fields with validation decorators (@IsNotEmpty for mandatory, @IsString etc.), using Partial<Prisma.{Entity}> as base if applicable.
   - `dto/{moduleName}-update.dto.ts`: All fields optional except auto-generated.
   - `dto/{moduleName}-response.dto.ts`: Only fields marked for exposure, no validation decorators.

5. **Generate Mapper**
   - `mappers/{moduleName}.mapper.ts`: Static mapper class for transforming between DTOs and entities.
   - Methods: `toPersistence()` (DTO → Entity for create/update), `toResponse()` (Entity → DTO for API responses).
   - Should handle field transformations and any sensitive data filtering.

6. **Generate Repository**
   - `repository/{moduleName}.repository.ts`: Basic `findAll` and `count` methods for pagination.

7. **Generate UseCases**
   - `application/useCase/create-{moduleName}-usecase.ts`: Handle creation logic, including uniqueness checks for specified fields.
   - `application/useCase/get-{moduleName}-by-id-usecase.ts`: Handle retrieval by ID.
   - `application/useCase/update-{moduleName}-usecase.ts`: Handle update logic.
   - `application/useCase/delete-{moduleName}-usecase.ts`: Handle deletion with existence check.

7. **Generate Service**
   - `application/{moduleName}.service.ts`: Orchestrate operations, inject UseCases and Repository.
   - Methods: `create`, `getById`, `update`, `delete`, `getAll` (with pagination).

8. **Generate Controller**
   - `api/{moduleName}.controller.ts`: Define routes with proper BaseResult wrapping.
   - Routes: `POST /create`, `GET /:id`, `PATCH /:id`, `DELETE /:id`, `GET /` (paginated).

9. **Generate Module**
   - `{moduleName}.module.ts`: Import and provide all components.

10. **Update App Module**
    - Add the new module to `src/app.module.ts` imports.

11. **Post-Generation Validation**
    - Run `npm run build` or relevant tests to ensure no errors.
    - Suggest running Prisma migrations if schema changed.

## Example Based on User Module

- Module: user
- Entity: User
- ID type: number
- Fields: id (auto, number), name (string, mandatory, exposed), email (string, mandatory, exposed), createdAt (auto, Date, not exposed), updatedAt (auto, Date, not exposed)
- Searchable: ["name", "email"]
- Unique: ["email"]

This generates the structure seen in `src/modules/user/`, but with UseCases for all operations and validation decorators.

## Notes

- Assumes standard imports from common files (BaseResult, PaginationDto, etc.).
- For complex validations or relations, the UseCases can be extended post-generation.
- Basic CRUD does not handle relations; for entities with relations, additional logic is needed.

## Mapper Pattern - Data Transformation Best Practice

### Problem Statement
Without mappers, dto-to-entity and entity-to-dto transformations are repeated across multiple UseCases in the same module, leading to:
- Code duplication
- Maintenance overhead (field changes require updates in multiple places)
- Inconsistent transformations
- Reduced testability

### Solution: Mapper Class

**Location:** `src/modules/{moduleName}/mappers/{moduleName}.mapper.ts`

Each module has a **single, static mapper class** that centralizes all data transformations. This class is used by all UseCases and Controllers in that module.

### Structure

```typescript
// src/modules/item/mappers/item.mapper.ts
export class ItemMapper {
  /**
   * Transforms incoming DTO (from API) to Prisma create/update data.
   * Used by Create and Update UseCases.
   */
  static toPersistence(dto: ItemCreateDto | ItemUpdateDto): any {
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
   * Transforms Prisma entity (from database) to API response DTO.
   * Used by all read operations (Get, GetAll).
   * Filters sensitive fields automatically.
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
   * Maps array of entities to response DTOs.
   * Useful for list operations.
   */
  static toResponses(entities: any[]): ItemResponseDto[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
```

### Usage in UseCases

#### Create UseCase
```typescript
@Injectable()
export class CreateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(itemCreateDto: ItemCreateDto): Promise<BaseResult<ItemResponseDto>> {
    const createdItem = await this.prismaService.item.create({
      data: ItemMapper.toPersistence(itemCreateDto),
    });

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(createdItem)
    );
  }
}
```

#### Get By ID UseCase
```typescript
@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(item)
    );
  }
}
```

#### Update UseCase
```typescript
@Injectable()
export class UpdateItemUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    id: string,
    itemUpdateDto: ItemUpdateDto,
  ): Promise<BaseResult<ItemResponseDto>> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new BaseResult<ItemResponseDto>().error('Item not found');
    }

    const updatedItem = await this.prismaService.item.update({
      where: { id },
      data: ItemMapper.toPersistence(itemUpdateDto),
    });

    return new BaseResult<ItemResponseDto>().ok(
      ItemMapper.toResponse(updatedItem)
    );
  }
}
```

### Key Benefits

✅ **Single Source of Truth**: Field mappings defined in one place  
✅ **DRY Principle**: No duplicate mapping logic across UseCases  
✅ **Easy Maintenance**: Update field mapping once, applies everywhere  
✅ **Consistency**: All responses follow the same transformation rules  
✅ **Testability**: Mapper logic can be unit tested in isolation  
✅ **Readability**: UseCases focus on business logic, not data transformation  

### Special Cases: Business Logic in Mappers

For fields that require transformation (e.g., password hashing, date formatting), the mapper should handle it:

```typescript
// User Mapper with password hashing
export class UserMapper {
  static async toPersistenceWithHash(dto: UserCreateDto): Promise<any> {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    return {
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      empresaId: dto.empresaId,
    };
  }

  static toResponse(entity: any): UserResponseDto {
    return {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      // Explicitly exclude senhaHash from response
    };
  }
}
```

Then in CreateUserUseCase:
```typescript
const createdUser = await this.prismaService.usuario.create({
  data: await UserMapper.toPersistenceWithHash(usercreateDto),
});
```
