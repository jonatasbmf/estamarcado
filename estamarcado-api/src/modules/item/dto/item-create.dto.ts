import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ItemCreateDto {
  @IsNotEmpty()
  @IsString()
  empresaId: string;

  @IsNotEmpty()
  @IsString()
  tipoId: string;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  unidadeCompra: string;

  @IsNotEmpty()
  @IsString()
  unidadeConsumo: string;

  @IsNotEmpty()
  @IsNumber()
  fatorConversao: number;

  @IsOptional()
  @IsNumber()
  estoqueMinimo?: number;

  @IsOptional()
  @IsNumber()
  precoVenda?: number;

  @IsNotEmpty()
  @IsNumber()
  custoMedioAtual: number;
}