# Histórias de Usuário Priorizadas (User Stories)

Este documento exprime as exigências sistêmicas transformadas em "Histórias", adotando a heurística estruturada do método de desenvolvimento ágil: *"Como [Persona], Eu quero [Ação] Para que [Valor]"*.

Segregamos os requisitos utilizando a prioritização **MoSCoW**:
- **Must Have (M):** Crítico/Mandatório para lançamento (MVP).
- **Should Have (S):** Altamente valioso, porém contornável temporariamente.
- **Could Have (C):** Desejável (Nice-to-have) que trazem valor futuro à rotina.
- **Won't Have (W):** Excluído do escopo principal ou deixado para versão 2.0.

---

## 1. Módulo Core: Autenticação e Multi-Tenant

### [M] US01: Acessar sistema e visualização controlada
**Como** Membro da Equipe Administradora  
**Eu quero** logar na aplicação e o sistema deve segregar automaticamente a minha navegação baseado no meu `empresaId` ativo  
**Para que** eu não acesse os dados financeiros ou de estoque do "Studio Belezza" enquanto eu estiver visualizando o braço da "Pipoca Gourmet".

**Critérios de Aceite:**
1. Dado um token portando validade e "Empresa ID A", o interceptor Node.js deve injetar o contexto.
2. Nenhuma Query sem um WHERE nativo pela `EmpresaId` deve compilar sem aviso, assegurando o multi-tenant isolado.
3. Front-end no Next.js deve portar um "Switch Tenant" se o usuário for Gerente Geral da Holding (tiver conta global).

### [M] US02: Gerir Usuários e Hierarquia
**Como** Administrador Global do Sistema  
**Eu quero** convidar usuários com permissões específicas de "Operador de Estoque"  
**Para que** o caixa e informações táticas bancárias não vazem para funcionários de base.

---

## 2. Módulo de Estoque (Heartbeat do Sistema)

### [M] US03: Criação de Insumos e Produtos Unificada
**Como** Gestor de Suprimentos  
**Eu quero** cadastrar itens com unidades e tipos dinâmicos (`MATERIA_PRIMA`, `PRODUTO_FINAL`, `SERVICO`) indicando fator de conversão de compras vs consumo  
**Para que** eu possa comprar "Saca de 10Kg de Milho", mas deduzir "Gramas" na ficha técnica com exatidão matemática.

**Critérios de Aceite:**
1. Todos os Itens devem comportar "Custo Médio Atual".
2. O "Fator Conversão" deve impedir cadastros mal-intencionados (apenas positivos validos).

### [S] US04: Criação da Ficha Técnica (BOM)
**Como** Gestora do Espaço/Studio  
**Eu quero** definir uma Ficha Técnica no serviço "Alongamento Master", especificando que ele gasta `5ml de Esmalte, 12g de Fibra de Vidro`  
**Para que** sempre que a cliente fizer o alongamento, a reserva do insumo aconteça virtualmente no painel, garantindo que eu saiba quando pedir mais sem me deparar com a falta.

**Critérios de Aceite:**
1. Aceitar adição N:N com Item final.
2. Validar recursão circular (Impedir que A precise de B, e B precise de A).

**Status:** ✅ IMPLEMENTADO - Módulo `ficha-tecnica` criado com:
- DTOs: Create, Update, Response
- Repository com operações CRUD
- UseCases: Create, GetById, Update, Delete
- Service orquestrando operações
- Controller com rotas: POST /create, GET /:id, PATCH /:id, DELETE /:id, GET /
- Validações de existência de Item
- Suporte a relações N:N via FichaTecnicaItem

**Próximas Tarefas:**
- [ ] Validação de recursão circular
- [ ] Integração com atendimentos para deduções automáticas

---

### [M] US05: Fechamento via PMP (Preço Médio)
**Como** Gestor Financeiro  
**Eu quero** que qualquer entrada de "Compra" atualize automaticamente meu Custo PMP  
**Para que** minha precificação nunca defase durante os meses inflacionários do varejo.

**Status:** ✅ IMPLEMENTADO - Módulo `movimentacao-estoque` criado com:
- DTOs: Create, Update, Response
- Repository com `calculateCMP()` para cálculo do Custo Médio Ponderado
- UseCases: Create (com atualização automática de CMP), GetById, Update, Delete
- Service orquestrando operações
- Controller com rotas: POST /create, GET /:id, PATCH /:id, DELETE /:id, GET /, GET /item/:itemId
- Validações: Item, Local de Estoque, Tipo de Movimentação, Quantidade
- **Lógica PMP:** Em cada entrada de compra, recalcula `custoMedioAtual` do Item automaticamente
- Suporte a diferentes tipos de movimentação (ENTRADA_COMPRA, SAIDA_VENDA, CONSUMO_INTERNO, AJUSTE, TRANSFERENCIA)

---

## 3. Módulo de Agenda e Studio

### [M] US06: Cadastro Fluido de Eventos (Agenda)
**Como** Recepcionista  
**Eu quero** um visual "Drag-and-Drop" ou calendário simplificado que grave agendamentos de Serviços para meus Clientes vinculando o Horário e o Profissional responsável  
**Para que** a ocupação do estabelecimento corra sem buracos e overbookings (Choque de Horários).

**Critérios de Aceite:**
1. O backend recusará (HTTP 409 Conflict) caso dois eventos cruzem exatamente no relógio o mesmo Recurso/Profissional num range vital.

### [S] US07: Atendimento Concluído gera Comissionamento
**Como** Proprietária  
**Eu quero** que, ao marcar um atendimento de R$ 200,00 como finalizado vinculado à Profissional Mariana (taxa padrão de 40%)  
**Para que** o sistema gere automaticamente um `Título a Pagar` com a Comissão exata de R$ 80,00 para a data corte designada, deduzido taxa de máquina/insumos se parametrizado.

---

## 4. Módulo de Vendas Pipoca (Logística Simples)

### [M] US08: Venda PDV Simplificada de Pipoca
**Como** Vendedor / Caixa  
**Eu quero** adicionar Itens Finalizados (Ex: Pote Doce G) a um Check-out limpo e confirmar pagamento   
**Para que** a transação de balcão ou via Redes Sociais se conclua em menos de 10 segundos, emitindo Ordem ou Recebimento.

**Critérios de Aceite:**
1. A conclusão desta história invoca a rotina de Estoque Automático mapeada no [US04] onde o Fator BOM explode a dedução em fundo.

### [C] US09: Rastreio de Roteiro de Entrega C/ CEP
**Como** Expedidor de Pipoca  
**Eu quero** salvar endereço nos pedidos com Status "ROTA"  
**Para que** se despachado via Moto-entrega, eu possa mensurar Custo Fixo x Área de Região.

---

## 5. Módulo de Integração Cloud API Meta (WhatsApp)

### [M] US10: Setup de Templates e Segredos da Meta
**Como** Desenvolvedor ou Admin Master  
**Eu quero** cadastrar o Token Oficial e Webhook Secrets na tabela oculta do Client e Parear IDs de Template do Business Manageer  
**Para que** meu sistema possa autorizar Requests HTTP seguras disparadas.

### [M] US11: Reação Silenciosa de "Status Modificado"
**Como** Sistema (Job Autônomo)  
**Eu quero** escutar os eventos do Domínio de Atendimento (Exemplo: "Finalizado")   
**Para que** dispare de trás dos panos um POST HTTP pra Meta para o número do cliente formatado, avisando que o pedido dele saiu da fábrica sem frear a barra de loading do meu Gerente.

**Critérios de Aceite:**
1. Não bloquear Threads (usar Background `async` do emitter do NestJS e promises desgarradas ou queue).
2. Salvar falhas no log de `EnvioWhatsApp` com Status de `FAILED` se a Meta recusar limite ou número banido, sem explodir a transação da Compra.
