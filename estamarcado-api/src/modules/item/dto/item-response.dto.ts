export class ItemResponseDto {
  id: string;
  empresaId: string;
  tipoId: string;
  nome: string;
  unidadeCompra: string;
  unidadeConsumo: string;
  fatorConversao: number;
  estoqueMinimo: number | null;
  precoVenda: number | null;
  custoMedioAtual: number;
  createdAt: Date;
  updatedAt: Date;
}