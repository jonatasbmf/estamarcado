export class FichaTecnicaResponseDto {
  id: string;
  empresaId: string;
  itemId: string;
  itens?: FichaTecnicaItemDto[];
}

export class FichaTecnicaItemDto {
  id: string;
  fichaId: string;
  itemId: string;
  quantidade: number;
}
