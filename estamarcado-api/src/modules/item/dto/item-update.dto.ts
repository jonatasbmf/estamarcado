import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ItemUpdateDto {
  @IsOptional()
  @IsString()
  empresaId?: string;

  @IsOptional()
  @IsString()
  tipoId?: string;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  unidadeCompra?: string;

  @IsOptional()
  @IsString()
  unidadeConsumo?: string;

  @IsOptional()
  @IsNumber()
  fatorConversao?: number;

  @IsOptional()
  @IsNumber()
  estoqueMinimo?: number;

  @IsOptional()
  @IsNumber()
  precoVenda?: number;

  @IsOptional()
  @IsNumber()
  custoMedioAtual?: number;
}