# Fluxograma de Autenticação Multi-Tenant

Sistemas como este exigem controle sobre a visibilidade dos dados via Contexto. A Empresa "Contabilmente" Mãe (Ex: Holding Flavia) detém a gerência total de permissões, enquanto o contexto isolado ("Pipoca Gourmet" ou "Studio") define qual banco/tenant está sendo consultado nas API's no momento da chamada.

Este desenho retrata a Injeção de Contexto implementada usando o `ActiveEmpresaId` injetado pelo Front-end Next.js e interceptado pelo `nestjs-cls` Middleware na API NestJS.

```mermaid
sequenceDiagram
    actor Usuario
    participant FE as Front-end Next.js (Local Storage)
    participant API as API NestJS (Auth Guard & Tenant Middleware)
    participant CLS as AsyncLocalStorage (ClsService)
    participant Prisma as Extended Prisma Client
    participant DB as Banco Múltiplo

    Note over Usuario, FE: O Usuário está visualizando dados da Pipoca
    Usuario->>FE: Clique Menu "Mudar para Studio"
    FE->>API: POST /auth/switch-tenant { novoEmpresaId: "uuid-studio" }
    
    API->>DB: Verifica: "O Usuário X tem permissão de ver Empresa 'Studio'?"
    DB-->>API: Sim (Confirma)
    
    API->>API: Gera [Novo Token JWT]
    Note right of API: Payload: <br>{ sub: "user-uuid", activeEmpresaId: "uuid-studio" }
    
    API-->>FE: Retorna JWT (Novo)
    FE->>FE: Atualiza Sessão/Storage Interno e recarrega views
    
    Note over Usuario, DB: Toda nova requisição subsequentee passará por isso:
    
    FE->>API: GET /produtos (Authorization: Bearer [Novo Token])
    API->>CLS: Middleware Intercepta
    CLS->>CLS: Seta memória isolada: tenantId = "uuid-studio"
    
    API->>Prisma: Service chama this.prisma.produto.findMany()
    Prisma->>CLS: Pega dinamicamente tenantId isolado do request
    Prisma->>DB: Traduz: SELECT * FROM Produto WHERE empresaId = 'uuid-studio'
    DB-->>Prisma: Retorna só shampoos e cremes (Dados do Studio)
    Prisma-->>FE: 200 OK Array Produtos
```

## Benefícios do Desenho Implementado
- **Segurança (Zero Trust Interno):** Nem o Front-end e nem o Back-end nos *Controllers* escolhem livremente as permissões ou forçam queries maliciosas. Todo WHERE da requisição do PostegreSQL injeta transparentemente a condição da sessão em todos as tabelas listadas pelo schema central.
- **Limpeza no Pipeline Front-end:** O Next.js apenas chama `fetch('/api/produtos')` sem a obrigação mecânica de gerenciar `empresaId=123` nas Query Params, evitando dezenas de bugs visuais em componentes reutilizáveis React.
