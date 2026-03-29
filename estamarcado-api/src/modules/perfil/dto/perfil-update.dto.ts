import { IsOptional, IsString } from 'class-validator';

export class PerfilUpdateDto {
  @IsOptional()
  @IsString()
  empresaId?: string;

  @IsOptional()
  @IsString()
  nome?: string;
}