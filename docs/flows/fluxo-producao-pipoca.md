# Fluxo de Produção e Pedido - Pipoca Gourmet

Diferente do Studio de Beleza onde o serviço orienta a requisição, o braço da Pipoca Gourmet é essencialmente varejo e manufatura. Este diagrama mapeia como um Pedido deduz componentes da **Ficha Técnica (BOM)**, processa Custo Médio Ponderado e dispara para a Logística/Entrega.

```mermaid
flowchart TD
    %% Nós principais
    Start(("Cliente Inicia Pedido\nFront-end POS"))
    API["API NestJS: POST /pedidos"]
    BD[("PostgreSQL ERP")]
    WPP{"Notificar\nWhatsApp?"}
    
    %% Validações de Sistema
    CheckEstoque{"Estoque do Produto\nFinal Suficiente?"}
    
    %% Caminho Direto (Venda Pronta)
    BaixaVenda["Criar MovimentacaoEstoque:\nSaída de Produto Final"]
    Faturamento["Gerar TituloFinanceiro:\nA Receber"]
    
    %% Caminho Produção (BOM)
    VerificaBOM{"Tem Cadastrado\nFicha Técnica?"}
    BaixaInsumos["Criar MovimentacaoEstoque:\nSaída de Matéria-Prima (Milho, Óleo, Sal)"]
    AddEstoqueProd["Criar MovimentacaoEstoque:\nEntrada de Produto Final (Custo PMP)"]
    
    %% Fluxo WhatsApp
    WPP_Sim["Enviar Template:\nconfirmacao_pedido"]
    Fim(("Fim: Pedido Salvo e\nFinanceiro OK"))
    
    %% Ligações Lógicas
    Start --> API
    API --> BD
    BD --> CheckEstoque
    
    CheckEstoque -- SIM --> BaixaVenda
    CheckEstoque -- NÃO --> VerificaBOM
    
    VerificaBOM -- SIM --> BaixaInsumos
    BaixaInsumos --> AddEstoqueProd
    AddEstoqueProd --> BaixaVenda
    
    VerificaBOM -- "NÃO (Erro)" --> Erro(["Exception 409:\nEstoque não configurado"])
    
    BaixaVenda --> Faturamento
    Faturamento --> WPP
    
    WPP -- SIM --> WPP_Sim
    WPP -- "NÃO (Opt-out)" --> Fim
    WPP_Sim --> Fim
    
    %% Estilização
    classDef banco fill:#f9f,stroke:#333,stroke-width:2px;
    class BD banco;
    
    classDef aviso fill:#ff9,stroke:#333;
    class WPP aviso;
```

## Regras Vitais Mapeadas
1. **Verificação Dinâmica (Just-in-Time):** A plataforma checa primeiramente se possui saldo direto no item pronto (ex: "Pacote 50g Pipoca Salgada"). Se houver ruptura, a API chama sua rotina interna de fábrica.
2. **Factory Method (BOM):** Ocorrendo a ausência, o sistema busca os insumos base (`Material_Prima`), deduz exatamente a quantidade da Ficha (% Milho, % Açúcar, % Óleo), valora a unidade ao custo real misturado de PMP e injeta do estoque provisoriamente para vendê-lo no mesmo segundo transacional.
3. Não havendo insumos base ou Ficha cadastrada, o sistema aplica Fail-Safe explícito aterrissando numa tela amigável no Front-end informando a gerência ("`Estoque não configurado/vazio`").
