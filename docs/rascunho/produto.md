🧱 1. VISÃO ARQUITETURAL DO SISTEMA

1.1 Natureza do Sistema

Plataforma ERP SaaS multi-tenant, orientada a eventos, com domínio híbrido:


🍿 Produção + venda (Pipoca Gourmet)

💅 Prestação de serviço (Studio de Beleza)



Características obrigatórias:


Isolamento por empresa (tenant)

Processamento transacional consistente (estoque + financeiro)

Baixo acoplamento entre módulos

Alta rastreabilidade (auditoria completa)





🏗️ 2. ARQUITETURA MULTI-TENANT

2.1 Estratégia de Isolamento

Você está usando abordagem correta: Shared Database + Shared Schema + empresa_id

Padrão:

empresa_id UUID NOT NULL


Presente em 100% das tabelas transacionais



2.2 Escopo de Acesso

Usuário

Usuario
- id
- empresa_id
- nome
- email
- senha_hash
- ativo


Perfis


Admin

Financeiro

Operador

Profissional



Permissões (granular)

Permissao
- id
- codigo (ex: FINANCEIRO_LER)
- descricao

UsuarioPermissao
- usuario_id
- permissao_id




2.3 Segurança


Filtro global por empresa_id (middleware / EF Core Query Filter)

JWT contendo:



{
  "empresa_id": "...",
  "usuario_id": "...",
  "roles": []
}




2.4 Identidade Visual (White Label)

Empresa
- id
- nome_fantasia
- logo_url
- cor_primaria
- cor_secundaria
- dominio




👥 3. DOMÍNIO DE PESSOAS (MODELO POLIMÓRFICO)

3.1 Entidade Central

Pessoa
- id
- empresa_id
- nome
- telefone
- email
- documento
- data_nascimento


3.2 Papéis (N:N)

PessoaPapel
- pessoa_id
- tipo (CLIENTE, FORNECEDOR, PROFISSIONAL)




3.3 Extensões

Cliente


observações

preferências

score fidelidade



Profissional


comissão padrão

tipo comissão (fixo, %, híbrido)





📦 4. MÓDULO DE ESTOQUE (CORE CRÍTICO)

4.1 Conceito Base

👉 Estoque não é saldo, é evento

Saldo = soma das movimentações



4.2 Estrutura

Item (unificado)

Item
- id
- empresa_id
- nome
- tipo (MATERIA_PRIMA, PRODUTO, CONSUMO)
- unidade_compra
- unidade_consumo
- fator_conversao
- estoque_minimo




4.3 Local de Estoque

EstoqueLocal
- id
- empresa_id
- nome


Ex:


Pipoca → Estoque Central

Studio → Unhas / Cílios / Geral





4.4 Movimentação (Ledger)

MovimentacaoEstoque
- id
- empresa_id
- item_id
- local_id
- tipo (ENTRADA, SAIDA, CONSUMO, AJUSTE, TRANSFERENCIA)
- quantidade
- custo_unitario
- documento_tipo
- documento_id
- criado_em




4.5 Ficha Técnica (BOM)

FichaTecnica
- id
- empresa_id
- item_resultante_id

FichaTecnicaItem
- ficha_id
- item_id
- quantidade




4.6 Regras

Baixa automática:


Venda → baixa produto

Serviço → explode BOM





4.7 Custo Médio Ponderado

Aplicado a cada entrada:

PMP = \frac{(Q_a \cdot P_a) + (Q_n \cdot P_n)}{Q_a + Q_n}



4.8 Recursos Avançados


Reserva de estoque

Inventário rotativo

Transferência entre locais

Controle de perda





💸 5. MÓDULO FINANCEIRO (ENGINE PRINCIPAL)

5.1 Entidade Base

TituloFinanceiro
- id
- empresa_id
- tipo (RECEBER, PAGAR)
- valor
- valor_liquido
- vencimento
- status
- origem_tipo
- origem_id




5.2 Contas

ContaFinanceira
- id
- empresa_id
- tipo (BANCO, CAIXA, CARTAO)
- saldo_atual




5.3 Fluxos

Entrada NF

→ gera contas a pagar

Venda

→ gera contas a receber

Agendamento

→ gera provisão



5.4 Cartão de Crédito (Passivo)

FaturaCartao
- id
- data_fechamento
- data_vencimento




5.5 Split de Pagamento

Pagamento
- id
- valor
- forma (PIX, CARTAO, DINHEIRO)




5.6 Taxas


Aplicadas no recebimento

Impactam valor líquido





📅 6. AGENDA + CRM

6.1 Entidade Evento

Evento
- id
- empresa_id
- cliente_id
- profissional_id
- servico_id
- data_inicio
- data_fim
- status




6.2 Status


Aguardando

Confirmado

Em curso

Finalizado

No-show

Cancelado





6.3 Regras de Negócio


Anti-conflito de agenda

Intervalos obrigatórios

Bloqueios





6.4 CRM

ClienteHistorico
- cliente_id
- descricao
- data




6.5 Automações


Confirmação via WhatsApp

Lembrete 24h

Reativação de clientes inativos





🔗 7. INTEGRAÇÃO COM 

7.1 Papel


Camada de UI da agenda

Backend continua sendo seu domínio





7.2 API

GET    /agenda/eventos
POST   /agenda/eventos
PUT    /agenda/eventos/{id}
PATCH  /agenda/eventos/{id}/status
DELETE /agenda/eventos/{id}




7.3 Recursos


Drag & drop

Resize

Colorização por status/profissional





🧾 8. MÓDULO DE ATENDIMENTO (STUDIO)

8.1 Atendimento Pai

Atendimento
- id
- cliente_id
- status
- valor_total




8.2 Itens (Rateio)

AtendimentoItem
- id
- atendimento_id
- profissional_id
- valor
- comissao
- custo




8.3 Regras


Gera contas a pagar (profissionais)

Gera contas a receber (cliente)

Baixa estoque





🍿 9. MÓDULO DE PEDIDOS (PIPOCA)

9.1 Pedido

Pedido
- id
- cliente_id
- status
- data_entrega




9.2 Integração com Agenda


Pedido vira evento de entrega

Permite roteirização





9.3 Produção


Baseado em BOM

Baixa insumos





🚚 10. LOGÍSTICA

10.1 Entregas

Entrega
- pedido_id
- status
- regiao
- rota_id




10.2 Otimização


Agrupamento por região

Sequenciamento





📊 11. BI (ANALYTICS)

11.1 Financeiro


Lucro por serviço

Margem real

Fluxo de caixa





11.2 Estoque


Giro

Ruptura

Custo médio





11.3 Operacional


No-show

Produtividade

Ticket médio





🎁 12. FIDELIDADE

12.1 Pontuação

Fidelidade
- cliente_id
- pontos




12.2 Regras


% por valor gasto

Expiração

Conversão





12.3 Cross-business


Cliente do Studio usa na Pipoca





🔄 13. EVENTOS DE DOMÍNIO (ESSENCIAL PRA ESCALAR)

Sugestão forte (nível sênior):


AtendimentoFinalizado

PedidoEntregue

NFImportada

EstoqueAbaixoMinimo



Isso permite:


desacoplar módulos

escalar depois (mensageria)





⚠️ 14. PONTOS CRÍTICOS (ONDE SISTEMAS QUEBRAM)

Se você acertar isso, vira produto sério:

1. Estoque baseado em eventos (não saldo)

2. Financeiro separado por origem

3. Rateio correto por profissional

4. Custo real via PMP

5. Multi-tenant consistente (sem vazamento)
