Evitar enum no banco (e até no Prisma) te dá:

🔄 Evolução sem deploy

🧩 Configuração por empresa (multi-tenant real)

🧠 Regras dinâmicas (ex: novos status, formas de pagamento, etc.)


👉 Vamos estruturar um schema Prisma completo, sem enums, usando tabelas de domínio (lookup tables).


---

🧱 PRINCÍPIOS DO SCHEMA

❌ NÃO usar

enum Status { ... }

✅ USAR

model Status {
  id        String @id @default(uuid())
  codigo    String @unique
  nome      String
}


---

🏗️ 1. BASE MULTI-TENANT

model Empresa {
  id              String   @id @default(uuid())
  nomeFantasia    String
  logoUrl         String?
  corPrimaria     String?
  corSecundaria   String?
  dominio         String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  usuarios Usuario[]
}


---

👤 2. USUÁRIOS E PERMISSÕES

model Usuario {
  id          String @id @default(uuid())
  empresaId   String
  nome        String
  email       String
  senhaHash   String
  ativo       Boolean @default(true)

  empresa Empresa @relation(fields: [empresaId], references: [id])

  perfis UsuarioPerfil[]
}

model Perfil {
  id        String @id @default(uuid())
  empresaId String
  nome      String

  usuarios UsuarioPerfil[]
  permissoes PerfilPermissao[]
}

model Permissao {
  id     String @id @default(uuid())
  codigo String @unique
  nome   String

  perfis PerfilPermissao[]
}

model UsuarioPerfil {
  usuarioId String
  perfilId  String

  usuario Usuario @relation(fields: [usuarioId], references: [id])
  perfil  Perfil  @relation(fields: [perfilId], references: [id])

  @@id([usuarioId, perfilId])
}

model PerfilPermissao {
  perfilId    String
  permissaoId String

  perfil     Perfil     @relation(fields: [perfilId], references: [id])
  permissao  Permissao  @relation(fields: [permissaoId], references: [id])

  @@id([perfilId, permissaoId])
}


---

👥 3. PESSOAS (MODELO FLEXÍVEL)

model Pessoa {
  id          String @id @default(uuid())
  empresaId   String
  nome        String
  telefone    String?
  email       String?
  documento   String?
  nascimento  DateTime?

  empresa Empresa @relation(fields: [empresaId], references: [id])

  papeis PessoaPapel[]
}

Papéis dinâmicos (sem enum)

model TipoPessoa {
  id     String @id @default(uuid())
  codigo String @unique // CLIENTE, FORNECEDOR, PROFISSIONAL
  nome   String

  pessoas PessoaPapel[]
}

model PessoaPapel {
  pessoaId String
  tipoId   String

  pessoa Pessoa     @relation(fields: [pessoaId], references: [id])
  tipo   TipoPessoa @relation(fields: [tipoId], references: [id])

  @@id([pessoaId, tipoId])
}


---

📦 4. ESTOQUE

Item (sem enum de tipo)

model TipoItem {
  id     String @id @default(uuid())
  codigo String @unique // MATERIA_PRIMA, PRODUTO
  nome   String

  itens Item[]
}

model Item {
  id              String @id @default(uuid())
  empresaId       String
  nome            String
  tipoId          String

  unidadeCompra   String
  unidadeConsumo  String
  fatorConversao  Float

  estoqueMinimo   Float?

  empresa Empresa @relation(fields: [empresaId], references: [id])
  tipo    TipoItem @relation(fields: [tipoId], references: [id])

  movimentacoes MovimentacaoEstoque[]
}


---

Local de estoque

model EstoqueLocal {
  id        String @id @default(uuid())
  empresaId String
  nome      String

  empresa Empresa @relation(fields: [empresaId], references: [id])

  movimentacoes MovimentacaoEstoque[]
}


---

Movimentação (CORE)

model TipoMovimentacao {
  id     String @id @default(uuid())
  codigo String @unique // ENTRADA, SAIDA, CONSUMO
  nome   String
}

model MovimentacaoEstoque {
  id           String @id @default(uuid())
  empresaId    String
  itemId       String
  localId      String
  tipoId       String

  quantidade   Float
  custoUnitario Float?

  documentoTipo String?
  documentoId   String?

  createdAt DateTime @default(now())

  empresa Empresa @relation(fields: [empresaId], references: [id])
  item    Item    @relation(fields: [itemId], references: [id])
  local   EstoqueLocal @relation(fields: [localId], references: [id])
  tipo    TipoMovimentacao @relation(fields: [tipoId], references: [id])

  @@index([empresaId, itemId])
}


---

🧪 5. FICHA TÉCNICA (BOM)

model FichaTecnica {
  id        String @id @default(uuid())
  empresaId String
  itemId    String

  itens FichaTecnicaItem[]

  empresa Empresa @relation(fields: [empresaId], references: [id])
  item    Item    @relation(fields: [itemId], references: [id])
}

model FichaTecnicaItem {
  id       String @id @default(uuid())
  fichaId  String
  itemId   String
  quantidade Float

  ficha FichaTecnica @relation(fields: [fichaId], references: [id])
  item  Item         @relation(fields: [itemId], references: [id])
}


---

💸 6. FINANCEIRO

Tipos dinâmicos

model TipoTitulo {
  id     String @id @default(uuid())
  codigo String @unique // RECEBER, PAGAR
  nome   String
}


---

Status dinâmico

model StatusFinanceiro {
  id     String @id @default(uuid())
  codigo String @unique // PENDENTE, PAGO, CANCELADO
  nome   String
}


---

Título

model TituloFinanceiro {
  id            String @id @default(uuid())
  empresaId     String

  tipoId        String
  statusId      String

  valor         Float
  valorLiquido  Float?

  vencimento    DateTime

  origemTipo    String?
  origemId      String?

  empresa Empresa @relation(fields: [empresaId], references: [id])
  tipo    TipoTitulo @relation(fields: [tipoId], references: [id])
  status  StatusFinanceiro @relation(fields: [statusId], references: [id])
}


---

Conta financeira

model ContaFinanceira {
  id        String @id @default(uuid())
  empresaId String
  nome      String
  tipo      String // aqui pode virar tabela depois se quiser

  saldoAtual Float @default(0)

  empresa Empresa @relation(fields: [empresaId], references: [id])
}


---

📅 7. AGENDA

Status dinâmico (sem enum)

model StatusAgenda {
  id     String @id @default(uuid())
  codigo String @unique
  nome   String
}


---

Evento

model Evento {
  id              String @id @default(uuid())
  empresaId       String

  clienteId       String
  profissionalId  String?
  servicoId       String?

  statusId        String

  dataInicio      DateTime
  dataFim         DateTime

  observacoes     String?

  empresa Empresa @relation(fields: [empresaId], references: [id])
  status  StatusAgenda @relation(fields: [statusId], references: [id])
}


---

🧾 8. ATENDIMENTO (RATEIO)

model Atendimento {
  id         String @id @default(uuid())
  empresaId  String
  clienteId  String

  valorTotal Float?

  itens AtendimentoItem[]
}

model AtendimentoItem {
  id              String @id @default(uuid())
  atendimentoId   String
  profissionalId  String

  valor           Float
  comissao        Float?
  custo           Float?

  atendimento Atendimento @relation(fields: [atendimentoId], references: [id])
}


---

🍿 9. PEDIDOS

model Pedido {
  id          String @id @default(uuid())
  empresaId   String
  clienteId   String

  status      String
  dataEntrega DateTime?

  empresa Empresa @relation(fields: [empresaId], references: [id])
}


---

🚀 DECISÕES IMPORTANTES (VOCÊ ACERTOU MUITO)

✅ Por que evitar enum?

Migration pesada

Deploy obrigatório

Sem customização por tenant


✅ Vantagem do seu modelo

Cliente pode criar status novo

Pode ativar/desativar

Pode ordenar

Pode configurar regras



---

⚠️ MELHORIAS DE NÍVEL SÊNIOR

1. Adicionar ordenação

ordem Int?


---

2. Soft delete

deletedAt DateTime?


---

3. Multi-tenant real (futuro)

Adicionar empresaId também nas tabelas de tipo se quiser customizar por empresa


---

🧠 PRÓXIMO PASSO (RECOMENDADO)

Agora você tem 3 caminhos estratégicos:

🔹 1. Seeds iniciais (IMPORTANTÍSSIMO)

Criar:

Status padrão

Tipos padrão

Permissões



---

🔹 2. Service Layer (Next.js + Prisma)

Separar por domínio

Evitar lógica no controller



---

🔹 3. Fluxo crítico

Implementar primeiro:

👉 Finalizar Atendimento

baixa estoque

gera financeiro

calcula comissão
