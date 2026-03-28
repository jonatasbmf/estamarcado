# Definição e Contratos DTO's (Data Transfer Objects)

O uso de validações estritas define o diferencial principal de uma aplicação performática ou sujeita a constante erro de Input. Para todo o Sistema Multi-tenant, o uso do pacote `class-validator` e `class-transformer` em conjunto ao Swagger em `@nestjs/swagger` será utilizado nos DTOs.

Abaixo, os DTOs primários vitais listados para operações chaves, suas hierarquias e obrigatoriedades.

## 1. DTOs Transversais e Identidade

### Criar/Registrar Organização/Empresa (`CreateEmpresaDto`)
Contrato base para onboard de um novo cliente no seu ecossistema.
- **nomeFantasia (String, Mandatório):** Nome exato ou marca.
- **cnpj (String, Opcional, Validador Regex/CPF-CNPJ):** Permite identificação civil se desejado faturamento pelo sistema.
- **empresaPaiId (UUID, Opcional):** Obrigatório apenas se for uma Unidade Filha de Operação (ex: Studio 2 ou Carrinho Pipoca Evento B).
- **dominio (String, Opcional):** Endereço White-label desejado.

### Criação de Pessoa Polimórfica (`CreatePessoaDto`)
Responsável pelas instâncias unitárias de CRM (Clientes) ou Equipe de Profissionais e Terceiros.
- **nome (String, Mandatório):** Nome completo ou social.
- **telefone (String, Mandatório - Regra Custom):** Telefone padronizado +55 obrigatoriamente para compatibilidade direta com a API WhatsApp.
- **email (String, Opcional - Exige @IsEmail):** E-mail para NF ou notificações.
- **tipoPapeis (Array de UUIDs, Mandatório):** O cliente deve passar a array contendo os IDs referentes a "Cliente", "Fornecedor" ou "Profissional".
- *Dados Comissionamento:* Apenas para tipo=Profissional. (`comissaoPadrao`, `tipoComissao`).
- **observacoes (String, Opcional):** Para ficha técnica CRM e anotações capilares/gastronômicas.

## 2. API de Agenda (Studio)

### Agendamento de Evento (`CreateEventoDto`)
Input disparado do Front-end ao selecionar Horários e Serviços.
- **clienteId (UUID, Mandatório):** ID resgatado via Select do Frontend.
- **servicoId (UUID, Mandatório):** Array referencial ou Id Unitário mapeando as categorias do Item=SERVICO.
- **profissionalId (UUID, Opcional):** Permite agendamentos "Qualquer Profissional da Categoria".
- **dataInicio (ISO 8601 Date, Mandatório):** Refletirá o Timezone de Brasília obrigatoriamente.
- **dataFim (ISO 8601 Date, Mandatório):** Computado via Front-end (Inicio + Range do Serviço).
- **observacoes (String, Opcional):** Ex: "Cliente pediu cabine principal".

### Modificação Status de Agenda (`UpdateEventoStatusDto`)
Dto voltado para drag & drop do Front-end ou transições laterais de menu.
- **statusId (UUID, Mandatório):** ID do status dinâmico (Cancelado, No-show).

## 3. API Atendimentos e Estoque (Operacional Combinado)

### Finalização de Atendimento do Studio (`ConcluirAtendimentoDto`)
Esse é um dos DTOs mais críticos e robustos de injeção direta de fluxo.
- **eventoId (UUID, Mandatório):** Link para o qual este atendimento surgiu.
- **itensRateio (Array of Objects, Mandatório):**
  - `profissionalId` (UUID, Mandatório)
  - `servicoId` (UUID, Mandatório)
  - `valorBase` (Float, Mandatório): Preço combinado com cliente caso difirja de tabela.
- **descontosGlobais (Float, Opcional):** Custo a deduzir.
- **lancarFinanceiroAutomatico (Booleano, Mandatório - Padrão True):** Decisão se a API já deve inserir nas `ContasReceber` faturando do Cliente.

### Lançamento Movimentação/Ajuste Estoque (`CreateMovimentacaoManualDto`)
Usando normalmente para entrada de NF ou quebras de insumos.
- **itemId (UUID, Mandatório):** Insumo/Produto manipulado.
- **localId (UUID, Mandatório):** Onde ocorreu o impacto (Estoque Cozinha, Cabine Unhas).
- **tipoMovimentacaoId (UUID, Mandatório):** Indica se é Entrada ou Saída via banco.
- **quantidade (Float, Mandatório - @IsPositive):** Números estritamente absolutos (não enviar negativos). O tipo dita a regra algébrica no banco.
- **custoUnitario (Float, Mandatório só na Entrada):** Serve para o re-cálculo do Custo Médio Ponderado PMP pela API nestjs.

## 4. API de Pedidos (Pipoca Gourmet - Logística Vertical)

### Realizar Pedido Avulso (`CreatePedidoDto`)
Responsável pelas ordens de venda online ou terminal point-of-sale de Pipocas.
- **clienteId (UUID, Mandatório).**
- **itens (Array de Objetos, Mandatório):**
  - `itemId` (UUID do Produto Pipoca)
  - `quantidade` (Float/Int)
- **dadosEntrega (Validation Opcional Conjunta):**
  - Só exigida se modalidade ditar Entrega. Possui campos: `cep, endereco, numero, bairro`. Se preenchido `cep` na requisição, obriga a validação de formato e rua.
- **dataPrevistaEntrega (ISO 8601, Opcional):**

## 5. Abstrações Financeiras (Transacional Puro)

### Lançamento de Título Unitário (`CreateTituloFinanceiroDto`)
Recebimentos ou Contas para Pagar gerados manualmente em tela P&L Financeira.
- **tipoId (UUID, Mandatório):** APAGAR, ARECEBER.
- **statusId (UUID, Mandatório):** PENDENTE, PAGO.
- **valorOriginal (Float, Mandatório - @IsPositive).**
- **descricao (String, Mandatório - Tamanho Mínimo 5 chars):** Evitar dejetos textuais contábeis (ex: "venda", "asd").
- **dataVencimento (ISO 8601, Mandatório).**
- **origemTipo/Id (Opcional):** Preenchidos via Background Jobs e não pelo Frontend na maioria das vezes, apontando amarração a Módulos do Estoque/Venda.
