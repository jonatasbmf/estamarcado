# Estamarcado API

API REST desenvolvida com NestJS para o sistema Estamarcado, implementando arquitetura multi-tenant com autenticação JWT.

## 🚀 Tecnologias

- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT + Passport
- **Containerização:** Docker

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 17+
- Docker (opcional)

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Docker (Recomendado)

```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Executar migrações
npx prisma migrate dev

# Popular banco com dados iniciais
npm run seed
```

### Opção 2: PostgreSQL Local

Certifique-se de que o PostgreSQL está rodando e configure a `DATABASE_URL` no arquivo `.env`.

## 🚀 Executando a Aplicação

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

## 🌱 Seed do Banco de Dados

O seed cria dados iniciais necessários para o funcionamento do sistema:

```bash
# Executar seed
npm run seed

# Ou diretamente
npx ts-node prisma/seed.ts
```

### Dados Criados pelo Seed

- **Empresa:** Estamarcado Admin
- **Usuário Admin:**
  - Email: `admin@estamarcado.com`
  - Senha: `admin123`
  - Perfil: Administrador

## 🔐 Autenticação

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@estamarcado.com",
  "password": "admin123"
}
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "nome": "Administrador",
      "email": "admin@estamarcado.com",
      "empresaId": "empresa-admin"
    }
  }
}
```

### Usando o Token

Inclua o token JWT no header de Authorization:

```
Authorization: Bearer <access_token>
```

## 🏢 Multi-Tenant

O sistema implementa isolamento automático por empresa através do `empresaId` presente no token JWT. Todas as consultas são automaticamente filtradas pela empresa do usuário logado.

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Servidor com hot-reload
npm run start:debug        # Servidor em modo debug

# Produção
npm run build             # Compilar TypeScript
npm run start:prod        # Executar build de produção

# Banco de Dados
npm run seed              # Executar seed do banco
npx prisma migrate dev    # Executar migrações
npx prisma studio         # Abrir Prisma Studio

# Qualidade de Código
npm run lint              # Executar ESLint
npm run format            # Formatar código com Prettier

# Testes
npm run test              # Executar testes unitários
npm run test:watch        # Testes em modo watch
npm run test:cov          # Testes com cobertura
npm run test:e2e          # Testes end-to-end
```

## 🧪 Testando a API

### Exemplo: Teste de Autenticação

```bash
# 1. Login
curl -X POST http://localhost:40404/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@estamarcado.com","password":"admin123"}'

# 2. Usar token para acessar endpoint protegido
curl -X GET http://localhost:40404/user/test-tenant \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Exemplo: Teste Multi-Tenant

```bash
# Endpoint que demonstra o isolamento por empresa
GET /user/test-tenant
Authorization: Bearer <token>

# Resposta inclui empresaId do usuário logado
{
  "success": true,
  "data": {
    "empresaId": "empresa-admin",
    "message": "Middleware de tenant funcionando!"
  }
}
```

## 🐳 Docker

### Ambiente Completo

```bash
# Construir e executar tudo
docker-compose up --build

# Apenas banco de dados
docker-compose up db

# Apenas API
docker-compose up api
```

### Variáveis de Ambiente Docker

As seguintes variáveis são configuradas automaticamente:

- `DB_USER=estamarcado_user`
- `DB_PASSWORD=estamarcado_pass`
- `DB_NAME=estamarcado_db`
- `DB_PORT=5432`
- `DATABASE_URL=postgresql://estamarcado_user:estamarcado_pass@localhost:5432/estamarcado_db`

## 📁 Estrutura do Projeto

```
estamarcado-api/
├── src/
│   ├── app.module.ts           # Módulo principal
│   ├── main.ts                 # Ponto de entrada
│   ├── common/                 # Utilitários comuns
│   │   ├── base-result.ts      # Respostas padronizadas
│   │   ├── pagination.ts       # Paginação
│   │   └── patinated-result.ts # Resultados paginados
│   ├── core/                   # Funcionalidades core
│   │   ├── auth/               # Autenticação JWT
│   │   ├── database/           # Configuração do banco
│   │   └── tenant/             # Middleware multi-tenant
│   └── modules/                # Módulos de negócio
│       └── user/               # Módulo de usuários
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   ├── seed.ts                 # Seed do banco
│   └── migrations/             # Migrações
├── docker-compose.yml          # Configuração Docker
├── .env                        # Variáveis de ambiente
└── package.json
```

## 🔧 Desenvolvimento

### Adicionando Novos Módulos

1. Criar módulo seguindo o padrão Orion
2. Implementar DTOs, UseCases e Repository
3. Registrar no `AppModule`
4. Adicionar rotas e testes

### Convenções de Código

- **TypeScript:** Tipagem estrita
- **ESLint:** Regras configuradas para qualidade
- **Prettier:** Formatação automática
- **Git:** Commits convencionais

## 📈 Monitoramento

A aplicação registra logs estruturados para facilitar o monitoramento:

- Conexões ao banco de dados
- Queries executadas
- Erros e exceções
- Autenticação e autorização

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença UNLICENSED.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue no repositório.
$ npm run test

# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
