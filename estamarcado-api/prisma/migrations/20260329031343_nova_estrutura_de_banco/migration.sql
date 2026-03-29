/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "empresaPaiId" TEXT,
    "nomeFantasia" TEXT NOT NULL,
    "cnpj" TEXT,
    "logoUrl" TEXT,
    "corPrimaria" TEXT,
    "corSecundaria" TEXT,
    "dominio" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioPerfil" (
    "usuarioId" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,

    CONSTRAINT "UsuarioPerfil_pkey" PRIMARY KEY ("usuarioId","perfilId")
);

-- CreateTable
CREATE TABLE "PerfilPermissao" (
    "perfilId" TEXT NOT NULL,
    "permissaoId" TEXT NOT NULL,

    CONSTRAINT "PerfilPermissao_pkey" PRIMARY KEY ("perfilId","permissaoId")
);

-- CreateTable
CREATE TABLE "TipoPessoa" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoPessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "documento" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "observacoes" TEXT,
    "comissaoPadrao" DOUBLE PRECISION,
    "tipoComissao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PessoaPapel" (
    "pessoaId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,

    CONSTRAINT "PessoaPapel_pkey" PRIMARY KEY ("pessoaId","tipoId")
);

-- CreateTable
CREATE TABLE "TipoItem" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "unidadeCompra" TEXT NOT NULL,
    "unidadeConsumo" TEXT NOT NULL,
    "fatorConversao" DOUBLE PRECISION NOT NULL,
    "estoqueMinimo" DOUBLE PRECISION,
    "precoVenda" DOUBLE PRECISION,
    "custoMedioAtual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstoqueLocal" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "EstoqueLocal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoMovimentacao" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sinal" INTEGER NOT NULL,

    CONSTRAINT "TipoMovimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoEstoque" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "custoUnitario" DOUBLE PRECISION,
    "documentoTipo" TEXT,
    "documentoId" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimentacaoEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTecnica" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "FichaTecnica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTecnicaItem" (
    "id" TEXT NOT NULL,
    "fichaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FichaTecnicaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoTitulo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoTitulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusFinanceiro" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusFinanceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContaFinanceira" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "saldoAtual" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ContaFinanceira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TituloFinanceiro" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorLiquido" DOUBLE PRECISION,
    "valorPago" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "origemTipo" TEXT,
    "origemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TituloFinanceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusAgenda" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusAgenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "profissionalId" TEXT,
    "servicoId" TEXT,
    "statusId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusAtendimento" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atendimento" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorFinal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtendimentoItem" (
    "id" TEXT NOT NULL,
    "atendimentoId" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "valorBase" DOUBLE PRECISION NOT NULL,
    "comissao" DOUBLE PRECISION NOT NULL,
    "custoConsumo" DOUBLE PRECISION,

    CONSTRAINT "AtendimentoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusPedido" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "StatusPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "dataEntrega" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "frete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cep" TEXT,
    "endereco" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "uf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracaoWhatsApp" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "businessAccountId" TEXT,
    "accessToken" TEXT NOT NULL,
    "webhookSecret" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ConfiguracaoWhatsApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateWhatsApp" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "idioma" TEXT NOT NULL DEFAULT 'pt_BR',
    "conteudo" TEXT NOT NULL,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "variaveis" TEXT[],

    CONSTRAINT "TemplateWhatsApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvioWhatsApp" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "templateId" TEXT,
    "destinatario" TEXT NOT NULL,
    "variaveis" JSONB,
    "status" TEXT NOT NULL,
    "mensagemId" TEXT,
    "contextoId" TEXT,
    "contextoTipo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvioWhatsApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensagemRecebidas" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "mensagem" TEXT,
    "tipo" TEXT NOT NULL,
    "mensagemId" TEXT NOT NULL,
    "contextoId" TEXT,
    "contextoTipo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECEBIDA',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MensagemRecebidas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_codigo_key" ON "Permissao"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPessoa_codigo_key" ON "TipoPessoa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoItem_codigo_key" ON "TipoItem"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoMovimentacao_codigo_key" ON "TipoMovimentacao"("codigo");

-- CreateIndex
CREATE INDEX "MovimentacaoEstoque_empresaId_itemId_idx" ON "MovimentacaoEstoque"("empresaId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoTitulo_codigo_key" ON "TipoTitulo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "StatusFinanceiro_codigo_key" ON "StatusFinanceiro"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "StatusAgenda_codigo_key" ON "StatusAgenda"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "StatusAtendimento_codigo_key" ON "StatusAtendimento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "StatusPedido_codigo_key" ON "StatusPedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracaoWhatsApp_empresaId_key" ON "ConfiguracaoWhatsApp"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateWhatsApp_empresaId_nome_key" ON "TemplateWhatsApp"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "MensagemRecebidas_empresaId_from_idx" ON "MensagemRecebidas"("empresaId", "from");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_empresaPaiId_fkey" FOREIGN KEY ("empresaPaiId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfil" ADD CONSTRAINT "UsuarioPerfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPerfil" ADD CONSTRAINT "UsuarioPerfil_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissao" ADD CONSTRAINT "PerfilPermissao_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissao" ADD CONSTRAINT "PerfilPermissao_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "Permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaPapel" ADD CONSTRAINT "PessoaPapel_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoaPapel" ADD CONSTRAINT "PessoaPapel_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoPessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstoqueLocal" ADD CONSTRAINT "EstoqueLocal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_localId_fkey" FOREIGN KEY ("localId") REFERENCES "EstoqueLocal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoMovimentacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTecnica" ADD CONSTRAINT "FichaTecnica_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTecnica" ADD CONSTRAINT "FichaTecnica_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTecnicaItem" ADD CONSTRAINT "FichaTecnicaItem_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "FichaTecnica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTecnicaItem" ADD CONSTRAINT "FichaTecnicaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaFinanceira" ADD CONSTRAINT "ContaFinanceira_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloFinanceiro" ADD CONSTRAINT "TituloFinanceiro_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloFinanceiro" ADD CONSTRAINT "TituloFinanceiro_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoTitulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloFinanceiro" ADD CONSTRAINT "TituloFinanceiro_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusFinanceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusAgenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atendimento" ADD CONSTRAINT "Atendimento_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusAtendimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtendimentoItem" ADD CONSTRAINT "AtendimentoItem_atendimentoId_fkey" FOREIGN KEY ("atendimentoId") REFERENCES "Atendimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtendimentoItem" ADD CONSTRAINT "AtendimentoItem_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusPedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracaoWhatsApp" ADD CONSTRAINT "ConfiguracaoWhatsApp_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateWhatsApp" ADD CONSTRAINT "TemplateWhatsApp_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvioWhatsApp" ADD CONSTRAINT "EnvioWhatsApp_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvioWhatsApp" ADD CONSTRAINT "EnvioWhatsApp_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateWhatsApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagemRecebidas" ADD CONSTRAINT "MensagemRecebidas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
