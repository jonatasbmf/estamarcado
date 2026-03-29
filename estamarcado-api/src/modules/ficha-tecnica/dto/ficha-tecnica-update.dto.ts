import { IsOptional, IsString } from 'class-validator';

export class FichaTecnicaUpdateDto {
  @IsOptional()
  @IsString()
  itemId?: string;
}
