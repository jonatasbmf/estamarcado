No **NestJS**, a abordagem muda um pouco porque trabalhamos com **Injeção de Dependência** e um ciclo de vida de requisição bem definido. 

Para que o `empresaId` flua automaticamente do cabeçalho da requisição até o banco de dados sem você precisar passar esse parâmetro em todas as funções do seu Service, a melhor prática é usar o **AsyncLocalStorage** (frequentemente implementado via biblioteca `nestjs-cls`).

Aqui está o fluxo completo:

---

### 1. Capturando o ID (Middleware ou Guard)
O Middleware intercepta a requisição, lê o token ou o header e salva o `empresaId` em um "armazenamento local" que dura apenas o tempo daquela execução específica.

```typescript
// tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: any, res: any, next: () => void) {
    // Aqui você pegaria do JWT decodificado ou de um header customizado
    const empresaId = req.headers['x-empresa-id']; 
    
    // Salva no contexto global da requisição
    this.cls.set('empresaId', empresaId);
    next();
  }
}
```

---

### 2. O Prisma Service "Inteligente"
Agora, configuramos o Prisma para que, toda vez que uma query for executada, ele pergunte ao `ClsService`: *"Qual é a empresa da requisição atual?"*.

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly cls: ClsService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  // Criamos uma instância "extendida" do Prisma
  readonly tenantClient = this.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const empresaId = this.cls.get('empresaId');

          // Ignora o filtro se for a tabela de Empresas ou se não houver ID (ex: login)
          if (empresaId && model !== 'Empresa') {
            args.where = { ...args.where, empresaId };
          }

          return query(args);
        },
      },
    },
  });
}
```

---

### 3. Como usar no seu Service
No seu código de negócio, você não injeta o `PrismaClient` padrão, mas sim o seu serviço customizado. Note que a syntaxe de query continua **exatamente a mesma**, o filtro é invisível.

```typescript
// produtos.service.ts
@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async listarTudo() {
    // Você não passa o empresaId aqui. O PrismaService injeta sozinho!
    return this.prisma.tenantClient.produto.findMany();
  }

  async criar(dados: CreateProdutoDto) {
    // O create também receberá o empresaId automaticamente no objeto
    return this.prisma.tenantClient.produto.create({ data: dados });
  }
}
```

---

### Por que usar essa estrutura no NestJS?

* **Segurança (Row Level Security Virtual):** É virtualmente impossível um usuário da "Pipoca Gourmet" ver dados do "Studio de Beleza", pois o filtro é aplicado na raiz da conexão com o banco.
* **Desacoplamento:** Seus métodos de busca (`findUnique`, `findMany`) ficam limpos. Se amanhã você mudar a regra de como identifica a empresa, muda apenas o Middleware.
* **Escalabilidade:** Como o NestJS gerencia os provedores, essa instância estendida do Prisma performa muito bem mesmo com milhares de requisições simultâneas.



### Próximo passo recomendado
Para rodar isso, você precisará instalar a biblioteca de contexto:
`npm install nestjs-cls`

**Gostaria que eu te mostrasse como configurar o `AppModule` para registrar esse middleware globalmente de forma correta?**

Registrar o middleware globalmente no NestJS garante que **toda e qualquer requisição** que chegue ao seu servidor passe pelo mesmo filtro antes de atingir seus Controllers e Services.

Aqui está o "como" e o "porquê" detalhados:

---

### Por que registrar globalmente?

1.  **Segurança Anti-Falhas:** Se você registrar o middleware rota por rota, corre o risco de esquecer uma nova funcionalidade. Em um sistema multi-tenant, esquecer o middleware significa que o `empresaId` não será capturado, o que pode resultar em erros de "empresa não encontrada" ou, no pior cenário, vazamento de dados entre clientes.
2.  **Consistência de Dados:** Garante que o `AsyncLocalStorage` (via `nestjs-cls`) esteja sempre populado. Seus Services podem confiar que a informação da empresa estará lá, independentemente de quem os chamou.
3.  **Centralização de Log e Auditoria:** Facilita saber exatamente quem (qual empresa) está acessando qual recurso em tempo real.

---

### Como registrar no `AppModule`

Diferente de componentes simples, middlewares que dependem de outros serviços (como o `ClsService`) devem ser registrados dentro do módulo principal usando o método `configure`.

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [
    // 1. Configure o ClsModule globalmente para estar disponível em todo o app
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true }, // Isso monta o middleware básico do CLS automaticamente
    }),
    ProdutosModule,
  ],
})
export class AppModule implements NestModule {
  // 2. Implemente o método configure da interface NestModule
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      // 3. Aplique a todas as rotas (*) ou rotas específicas
      // Você pode excluir rotas de 'auth' ou 'public' se desejar
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'public/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*'); 
  }
}
```



---

### O fluxo de execução na prática

Quando uma requisição chega:

1.  **Middleware do CLS:** Cria um "espaço isolado" na memória para aquela requisição específica.
2.  **Seu TenantMiddleware:** Extrai o `empresaId` do cabeçalho (ou token) e guarda nesse espaço isolado.
3.  **Guards (Autenticação):** Verificam se o usuário tem permissão.
4.  **Service/Prisma:** Quando o Prisma for disparado, ele "acorda", olha para esse espaço isolado, pega o `empresaId` e injeta na cláusula `WHERE` do SQL.

### Dica de Ouro: Tratamento de Erros
Se o middleware for global, você deve decidir o que acontece quando o `empresaId` **não** é enviado (ex: um erro 400 Bad Request). No seu `TenantMiddleware`, adicione uma verificação:

```typescript
if (!empresaId && !isPublicRoute) {
  throw new BadRequestException('Identificador da empresa (Tenant) é obrigatório.');
}
```

Isso impede que qualquer processo continue sem saber a qual "dono" os dados pertencem.

**Faz sentido essa estrutura centralizada para o seu projeto de Pipoca e Studio, ou você prefere uma abordagem onde o ID venha obrigatoriamente apenas dentro do Token JWT?**