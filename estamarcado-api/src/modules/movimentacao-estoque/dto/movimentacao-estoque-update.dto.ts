import {
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class MovimentacaoEstoqueUpdateDto {
  @IsOptional()
  @IsNumber()
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  custoUnitario?: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}
