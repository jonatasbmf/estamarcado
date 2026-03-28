# Estratégias de Multi-Tenancy no Banco de Dados

Ao construir um SaaS (como o nosso ERP para Holdings e Franquias), a forma como os dados são isolados define os custos de nuvem, a complexidade da equipe de suporte e as certificações de segurança que o sistema poderá ou não ter. 

Existem três abordagens principais no PostgreSQL / Prisma:

---

## 1. Banco de Dados Único com Coluna Discriminadora (O que planejamos até agora)
Todos os clientes (Holdings e Empresas Filhas) dividem o mesmo banco e o mesmo esquema (Shared Database, Shared Schema). A separação ocorre exclusivamente através da coluna `empresaId` que incluímos rigidamente em 100% das tabelas.

- **Vantagens:** 
  - **Custo e Infraestrutura:** Extremamente barato de começar. Você paga um único servidor RDS (AWS) ou banco gerenciado.
  - **Manutenção Simples:** Executar migrations (`npx prisma migrate`) demora 2 segundos, pois a estrutura muda uma única vez para todos.
  - **Análise Global:** Permite tirar métricas de "Qual o serviço mais vendido no Brasil inteiro em todas as nossas instâncias?" com apenas 1 query.
- **Desvantagens:**
  - **Vizinho Barulhento (Noisy Neighbor):** Se o cliente A gerar relatórios absurdos na Black Friday, o banco fica lento e o cliente B (que não tem nada a ver) sofre a lentidão.
  - **Riscos de Segurança:** Um erro humano no código ou esquecer de aplicar o filtro `empresaId` pode vazar dados de um cliente para o outro. (Mitigado pelo nosso *Prisma Client Estendido / Cls Middleware*).
  - **Dificuldade de Backup Focado:** Restaurar o banco apenas do "Studio X" que deletou tudo por engano requer queries manuais cirúrgicas.

---

## 2. Banco de Dados por Holding / Inquilino (Isolated Database)
Cada Holding (Ex: Grupo Flavia Andrade) possui uma base de dados Postgres física isolada. O catálogo principal do SaaS apenas guarda uma tabela dizendo: *"O Grupo X conecta na URL Y"*. Dentro desse Banco Isolado, você pode ter o *Studio* e a *Pipoca Gourmet* dividindo tabelas via `empresaId`.

- **Vantagens:**
  - **Segurança e Compliance Máximos:** Impossível ocorrer vazamento de dados entre o Grupo Flavia e o Grupo XYZ, pois a conexão física é diferente. Útil para SaaS Médico (HIPAA) ou Bancário.
  - **Isolamento de Performance:** A lentidão do Grupo A jamais afetará o Grupo B.
  - **Backup Dedicado:** Se um cliente cancelar as assinaturas, basta dropar a Database dele. Fazer backup diário exato focado por cliente é simples.
- **Desvantagens:**
  - **Escalonamento de Custos:** 100 Holdings = 100 Bancos de dados gerenciados ou um limite crítico estourado no PostgreSQL de número de Conexões Abertas simultâneas (Max Connections).
  - **Dificuldade Analítica:** Gerar relatórios que englobam todo o seu SaaS é complexo (não dá pra fazer um `JOIN` simples; precisa externalizar dados para um Data Warehouse).

---

## 3. Um Banco Central, Múltiplos Schemas (Postgres Schemas)
Tenta ser um meio termo (Shared Database, Isolated Schemas).
No PostgreSQL, em um único banco, você cria o Schema "flavia_andrade", Schema "joao_barbearia", etc.

- *No Prisma, o suporte nativo a multi-schema é limitado e as migrations viram um pesadelo operacional. Essa abordagem vem perdendo força em frameworks modernos.*

---

## Veredito Ouro: Banco por Holding ou por Empresa?
A separação recomendada em aplicações que envolvem múltiplos CNPJs que respondem a uma matriz é **Banco por Holding** (quando usar banco separado) ou **Banco Compartilhado Global** (se quiser enxugar startup).

Fazer "Banco por Empresa" separando fisicamente a *Pipoca Gourmet* do *Studio* que pertencem à Mesma Dona criará uma "Parede de Berlim" indesejável: você não conseguirá criar Programas de Fidelidade casados entre as unidades ou unificar a visão Financeira dela num único dashboard sem criar microserviços de sincronização custosos.

---

## O Desafio: Migrations em Múltiplos Bancos / Schemas

Se você escolher separar as Holdings em Bancos Individuais, a sua esteira de deploy (atualizar o Prisma) mudará radicalmente.

**Como funciona a Migration Padrão (Banco Único):**
1. Você ajusta o `schema.prisma`.
2. Em desenvolvimento roda `npx prisma migrate dev`.
3. No servidor de produção roda 1x: `npx prisma migrate deploy`. Fim.

**Como funciona a Migration (Múltiplos Bancos Individuais):**
No momento que o SaaS ganhar fôlego e você tiver 50 holdings (50 databses PostgreSQL), quando quiser adicionar uma coluna `DataNascimento` na tabela *Pessoa*, você **NÃO PODE** rodar 1 comando mágico do Prisma.

Você terá que programar um **Script de Migração em Lote (Node.js)** na raiz do projeto contendo um loop crítico:
```javascript
// Exemplo Teórico da CI/CD Multi-DB
const clientesDBs = ["url_db_holding_A", "url_db_holding_B", ..., "url_db_holding_Z"];

for (const url of clientesDBs) {
    try {
        console.log(`Aplicando Migration no Inquilino: ${url}`);
        // Injeta localmente a variavel de ambiente e invoca o Shell rodando Prisma Deploy
        process.env.DATABASE_URL = url;
        execSync(`npx prisma migrate deploy`); 
    } catch(err) {
        console.error(`Falha Crítica no Inquilino ${url}. Script paralisado.`);
        // PROBLEMA: Se quebrar no 25º banco, você tem 24 bancos atualizados e 26 desatualizados. 
        // Você precisa de scripts de retry e avisos vitais de DevOps.
        break; 
    }
}
```

O desafio passa a ser garantir a "Homegeneidade de Schema". Todo servidor back-end só subirá quando tiver prova de que todas as 50 holdings possuem o schema do Prisma pareado com a mesma versão do código.

---

## Recomendação Consultiva (2026+)

Comece com a abordagem **1 (Banco de dados único com `empresaId`)**.
É o padrão de indústria para MVP e fase de tração do B2B e B2B2C, pois garante agilidade técnica gigantesca no go-to-market.

Para evitar vazamento e sobreposição:
- Usamos **Tenant Middlewares** (como descrito em `docs/architecture/modulos-e-servicos.md`) impossibilitando que regras de negócios apaguem WHEREs básicos.
- Crie um índice PostgreSQL combinado: `@@index([empresaId, outraColuna])`. Isso torna relatórios de Holding X rapidíssimos num oceano de milhões de linhas.
