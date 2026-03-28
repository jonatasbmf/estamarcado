# Fluxo de Atendimento - Studio de Beleza

Este diagrama ilustra todo o processo sistêmico do momento em que um cliente realiza o agendamento até a finalização do atendimento, englobando integrações de estoque, financeiro (faturamento/rateios) e notificações WhatsApp.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant FE as Front-end (NextJS)
    participant API as API (NestJS)
    participant BD as Banco de Dados (PostgreSQL)
    participant WPP as Meta Cloud API (WhatsApp)

    Cliente->>FE: Solicita Horário e Escolhe Serviço
    FE->>API: POST /eventos (CreateEventoDto)
    API->>BD: Valida e Insere `Evento`
    BD-->>API: Evento Criado com Sucesso
    API->>WPP: Dispara Envio Template (Utilitary: confirmacao_agendamento)
    API-->>FE: 201 Created (Evento)
    WPP-->>Cliente: Recebe Confirmação via WPP

    Note over Cliente, API: ... Ocorrem as 24h antes ...
    API->>WPP: CronJob: Envia Lembrete 24H (Utilitary: lembrete_24h_agendamento)

    Note over Cliente, API: Cliente Comparece ao Studio

    FE->>API: PATCH /eventos/{id}/status (Status = EM_CURSO)
    API->>BD: Atualiza Status `Evento`
    API-->>FE: 200 OK

    Note over Cliente, FE: Atendimento é executado

    FE->>API: POST /atendimentos (ConcluirAtendimentoDto)
    API->>BD: Inicia Transação (Transaction)
    API->>BD: Cria `Atendimento` e `AtendimentoItem`(Rateios)
    
    rect rgb(240, 248, 255)
    Note over API, BD: EVENT: atendimento.finalizado
    API->>BD: Baixa Insumos Baseados na FichaTécnica (Estoque Movimentacao)
    API->>BD: Cria Titulo a Receber (Venda Serviço - Valor Client)
    API->>BD: Cria Titulo a Pagar (Comissão - Valor Profissional)
    end
    
    BD-->>API: Commit Transação
    API->>WPP: Dispara Avaliação/Obrigado (Utilitary: pos_atendimento_avaliacao)
    API-->>FE: 201 Created (Atendimento Resumo)
```

## Pontos Chave Desenhados
1. A API recebe as chamadas HTTP e funciona como um maestro das filas de processos.
2. A operação pesada de fatiamento dos Atendimentos (`Rateio Financeiro` e `Bill of Materials do Estoque`) é transacional (Tudo ou Nada).
3. Todas os envios do WhatsApp seguem a nuvem oficial conectada globalmente pelo PhoneNumberId da Tenant ativa.
