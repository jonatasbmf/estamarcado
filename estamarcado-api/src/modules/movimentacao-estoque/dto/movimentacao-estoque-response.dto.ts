export class MovimentacaoEstoqueResponseDto {
  id: string;
  empresaId: string;
  itemId: string;
  localId: string;
  tipoId: string;
  quantidade: number;
  custoUnitario?: number;
  documentoTipo?: string;
  documentoId?: string;
  observacao?: string;
  createdAt: Date;
}
