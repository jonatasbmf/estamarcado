# Organização de Módulos e Serviços (NestJS)

Em sistemas robustos SaaS ERP, um monólito modular bem desenhado deve evitar vazamento de conhecimento entre divisões de negócio. Para a construção da Backend API no framework **NestJS**, a organização priorizada segrega o conhecimento técnico da infraestrutura do negócio núcleo, e faz uso pesado de Injeção de Dependências acopladas a isolamento de Tenant pelo contexto da requisição.

O sistema divide-se em três camadas primordiais: **Core (Infra e Compartilhados)**, **Domínios (Business Logic)** e **Apresentação (Controllers/GraphQL/Webhooks)**.

## 1. Estrutura de Diretórios Recomendada

```text
src/
├── app.module.ts              # Root do Ecossistema
├── main.ts                    # Bootstrap
│
├── core/                      # ⚙️ Módulos Transversais
│   ├── database/             
│   │   ├── prisma.service.ts  # Prisma estendido (Middleware AsyncLocalStorage CLS injetado aqui)
│   │   └── database.module.ts
│   ├── tenant/                # Gerência Multi-Tenant
│   │   ├── tenant.middleware.ts # Extrai EmpresaID do Header/Token
│   │   └── tenant.module.ts
│   ├── auth/                  # Autenticação e Perfis (JWT, Guards)
│   └── whatsapp/              # Integração Cloud API (Independente de Domínio)
│       ├── whatsapp.service.ts
│       └── whatsapp.module.ts
│
├── modules/                   # 📦 Módulos de Negócio (Domains)
│   ├── pessoas/
│   │   ├── pessoas.module.ts
│   │   ├── pessoas.controller.ts
│   │   ├── pessoas.service.ts
│   │   ├── dto/
│   │   └── enums/
│   │
│   ├── estoque/               # Complexidade concentra-se em transações
│   │   ├── estoque.module.ts
│   │   ├── controllers/
│   │   │   ├── itens.controller.ts
│   │   │   └── movimentacoes.controller.ts
│   │   ├── services/
│   │   │   ├── itens.service.ts
│   │   │   ├── movimentacao.service.ts
│   │   │   └── ficha-tecnica.service.ts
│   │   └── dto/
│   │
│   ├── financeiro/            # O Motor de caixa e Títulos
│   │   └── ...
│   │
│   ├── agenda/                # CRM Studio
│   │   └── ...
│   │
│   ├── atendimento/           # Vincula Agenda + Estoque + Financeiro
│   │   └── ...
│   │
│   └── logistica/             # Pedidos Pipoca Gourmet
│       └── ...
│
└── shared/                    # 🧬 Ferramentais de Apoio
    ├── utils/
    ├── interceptors/
    └── filters/
```

## 2. Padrões de Implementação Rigorosos

### 2.1 Prisma Service Estendido (Inteligência Multi-tenant)
Nunca instanciar ou chamar regras de repasse de `empresaId` manualmente nos services. O `PrismaService` deve ser estendido localmente (usando o `nestjs-cls`), encapsulando a injeção do contexto.
- **Funcionamento:** Toda query rodada que acessa um modelo (exeto o de `Empresa`) sofre append de `where: { empresaId: currentContextId }`.
- **Justificativa:** Previne vazamento de dados críticos. Se um desenvolvedor júnior fizer um `this.prisma.evento.findMany()`, é matematicamente garantido que só verá dados referentes à sessão (Tenant) contida no token JWT via AsyncLocalStorage.

### 2.2 Isolamento de Regra de Negócio vs. Controle HTTP
Os Controladores (`Controllers`) **NÃO DEVEM** orquestrar fluxos lógicos. A responsabilidade do Controller é:
1. Validar e recepcionar dados (via Pipes DTO).
2. Acionar a camada de Serviço (`Service`).
3. Formatar respostas ou repassar Erros (Exceptions HTTP coerentes).

Todos os cálculos de custo, regras de aprovação de eventos, estornos de estoque e verificações de duplicatas de agenda devem residir puramente nos Arquivos de `Service`.

### 2.3 Orientação a Eventos de Domínio (`@nestjs/event-emitter`)
Dado as exigências sistêmicas (um atendimento finalizado altera três áreas: estoque, contas e notificações via WPP), orquestrar tudo sincronamente afoga o `AtendimentoService` em responsabilidades impróprias.
- **Solução (EventBus):**
  - O `AtendimentoService` processa sua regra e finaliza disparando: `this.eventEmitter.emit('atendimento.finalizado', payload)`.
  - O `EstoqueService` escuta via `@OnEvent('atendimento.finalizado')` e atua.
  - O `FinanceiroService` escuta via `@OnEvent('atendimento.finalizado')` e lança a pagar para o funcionário.
  - O `WhatsappService` escuta para enviar o template de Review Automática pós-atendimento.
- **Justificativa:** Se houver ruptura na notificação por indisponibilidade do Meta Cloud API (WhatsApp), a venda inteira não sofre Rollback transacional.

### 2.4 Unidade Funcional: DTOs, Controllers e Services
Defina os subdomínios em Módulos coesos. Exemplo: Para tratar itens do Estoque:
- Módulo importa unicamente o Repositório ou `PrismaModule`.
- Controllers atuam como a *Porta* do domínio.
- DTOs validam usando o `class-validator` provando o tráfego estrito de dados da tipagem de negócios.

### 2.5 Resiliência e Logging
Implementação obrigatória de **Exception Filters Globais** interceptando retornos `PrismaClientKnownRequestError` que traduzam códigos PostgreSQL espúrios (`P2002`, `P2025`) em conflitos 409 amigáveis ou HTTP 404 coerentes, garantindo que o Web App front-end nunca receba vazamentos de banco (Trace SQL de erro).
