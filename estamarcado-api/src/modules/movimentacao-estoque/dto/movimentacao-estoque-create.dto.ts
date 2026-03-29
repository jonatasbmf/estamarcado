import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class MovimentacaoEstoqueCreateDto {
  @IsNotEmpty()
  @IsString()
  empresaId: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsString()
  localId: string;

  @IsNotEmpty()
  @IsString()
  tipoId: string;

  @IsNotEmpty()
  @IsNumber()
  quantidade: number;

  @IsOptional()
  @IsNumber()
  custoUnitario?: number;

  @IsOptional()
  @IsString()
  documentoTipo?: string;

  @IsOptional()
  @IsString()
  documentoId?: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}
