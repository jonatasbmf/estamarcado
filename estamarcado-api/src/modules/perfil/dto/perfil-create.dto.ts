import { IsNotEmpty, IsString } from 'class-validator';

export class PerfilCreateDto {
  @IsNotEmpty()
  @IsString()
  empresaId: string;

  @IsNotEmpty()
  @IsString()
  nome: string;
}