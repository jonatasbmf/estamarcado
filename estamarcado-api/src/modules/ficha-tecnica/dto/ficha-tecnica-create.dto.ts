import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class FichaTecnicaCreateDto {
  @IsNotEmpty()
  @IsString()
  empresaId: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;
}
