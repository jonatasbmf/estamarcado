# Estamarcado ERP - Documentação

## Visão Geral

O **Estamarcado ERP** é um sistema SaaS projetado para atender as necessidades de gestão de holdings e franquias, com foco em multi-tenancy, modularidade e integração com serviços como WhatsApp e sistemas financeiros. Ele é construído utilizando tecnologias modernas como **NestJS**, **Next.js**, **Prisma** e **PostgreSQL**.

## Funcionalidades Principais

- **Gestão Multi-Tenant**: Suporte a múltiplas empresas e unidades com isolamento de dados.
- **Módulos de Negócio**: Inclui módulos para gestão de pessoas, estoque, financeiro, agenda e produção.
- **Integração com WhatsApp**: Envio de notificações automáticas para clientes e equipes.
- **Arquitetura Modular**: Baseada no framework NestJS, com separação clara entre infraestrutura, lógica de negócios e apresentação.
- **Design Responsivo**: Interface moderna e responsiva utilizando Shadcn e Tailwind CSS.

## Estrutura do Projeto

A estrutura do projeto é organizada em diferentes módulos e serviços para garantir escalabilidade e manutenibilidade. Abaixo está uma visão geral da organização do código:

```
src/
├── app.module.ts              # Root do Ecossistema
├── main.ts                    # Bootstrap
│
├── core/                      # Módulos Transversais
│   ├── database/              # Gerenciamento de banco de dados
│   ├── tenant/                # Gerência Multi-Tenant
│   ├── auth/                  # Autenticação e Perfis
│   └── whatsapp/              # Integração com API do WhatsApp
│
├── modules/                   # Módulos de Negócio
│   ├── pessoas/               # Gestão de pessoas
│   ├── estoque/               # Gestão de estoque
│   ├── financeiro/            # Gestão financeira
│   └── agenda/                # Gestão de agenda
│
└── components/                # Componentes de UI
    ├── layout/                # Layout principal
    ├── ui/                    # Componentes reutilizáveis
    └── pages/                 # Páginas do Front-end
```

## Inicialização do Sistema

### Pré-requisitos

- **Node.js** (v16 ou superior)
- **PostgreSQL** (v13 ou superior)
- **Docker** (opcional, para ambiente de desenvolvimento)

### Passos para Inicialização

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/estamarcado.git
   cd estamarcado
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as variáveis necessárias, como `DATABASE_URL`, `JWT_SECRET`, etc. Consulte o arquivo `docs/infrastructure/docker-compose.yml` para exemplos.

4. **Configure o banco de dados**:
   - Certifique-se de que o PostgreSQL está em execução.
   - Execute as migrations para criar as tabelas:
     ```bash
     npx prisma migrate dev
     ```

5. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

6. **Acesse o sistema**:
   - O sistema estará disponível em `http://localhost:3000`.

## Uso Básico

### Autenticação Multi-Tenant

- O sistema utiliza um seletor de empresas no cabeçalho para alternar entre diferentes tenants.
- Após selecionar a empresa, o sistema ajustará automaticamente o contexto para exibir apenas os dados relevantes.

### Módulos Disponíveis

1. **Pessoas**: Gerencie clientes, fornecedores e profissionais.
2. **Estoque**: Controle de itens, movimentações e fichas técnicas.
3. **Financeiro**: Gestão de contas a pagar e receber.
4. **Agenda**: Agendamentos e gestão de eventos.
5. **Produção**: Controle de pedidos e manufatura (Pipoca Gourmet).

### Integração com WhatsApp

- O sistema envia notificações automáticas para clientes e equipes utilizando a API do WhatsApp.
- Exemplos de notificações incluem confirmações de agendamento, lembretes e mensagens de agradecimento.
