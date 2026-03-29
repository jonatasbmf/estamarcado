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

5. **Generate Repository**
   - `repository/{moduleName}.repository.ts`: Basic `findAll` and `count` methods for pagination.

6. **Generate UseCases**
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
