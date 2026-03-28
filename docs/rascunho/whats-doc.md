Aqui está a **documentação clara e completa** da **WhatsApp Cloud API** (a API oficial da Meta selecionada no exemplo anterior), focada no que você precisa para o seu ERP multi-tenant.

### 1. Visão Geral da API Selecionada
- **Nome oficial**: WhatsApp Cloud API (parte da WhatsApp Business Platform)
- **Versão atual (2026)**: v20.0 (verifique sempre no seu app no Meta Developers, pois a versão pode subir)
- **Hospedagem**: Totalmente hospedada pela Meta (não precisa instalar servidor próprio)
- **Objetivo**: Enviar e receber mensagens no WhatsApp de forma programática, incluindo templates aprovados, mensagens interativas, status de entrega e respostas dos clientes.

**Documentação oficial principal**:
- Overview: https://developers.facebook.com/documentation/business-messaging/whatsapp/overview
- Get Started: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
- Pricing: https://business.whatsapp.com/products/platform-pricing

### 2. Forma de Comunicação

- **Envio de mensagens (outbound)**:
  - Método: **POST** para o endpoint:
    ```
    https://graph.facebook.com/{API_VERSION}/{PHONE_NUMBER_ID}/messages
    ```
  - Autenticação: Header `Authorization: Bearer {ACCESS_TOKEN}` (permanente recomendado)
  - Formato: JSON
  - Principais tipos suportados:
    - Template (recomendado para notificações automáticas como confirmação de agendamento)
    - Text (mensagens livres, só dentro da janela de 24h após resposta do cliente)
    - Interactive (botões, lista, etc.)
    - Media (imagens, documentos, etc.)

- **Recebimento de mensagens e status (inbound)**:
  - **Webhook** (HTTP POST que a Meta faz no seu endpoint)
  - Seu endpoint deve responder **HTTP 200** rapidamente para confirmar recebimento (caso contrário a Meta reenvia).
  - Verificação inicial: GET com parâmetros `hub.mode`, `hub.verify_token` e `hub.challenge`.

- **Autenticação adicional no Webhook**:
  - Verify Token (você define)
  - Assinatura de payload: Header `X-Hub-Signature-256` (HMAC-SHA256 com o App Secret do seu app Meta)

### 3. Dependências de Comunicação (O que você precisa configurar)

**Pré-requisitos obrigatórios**:
1. **Meta Business Account** verificado (Business Manager)
2. **Meta App** criado no developers.facebook.com com produto **WhatsApp** adicionado
3. **Número de telefone dedicado** (WhatsApp Business Phone Number) — não pode ser número pessoal já usado no WhatsApp normal
4. **Phone Number ID** (fornecido pela Meta após registrar o número)
5. **Access Token permanente** (System User Token recomendado para produção)
6. **Webhook URL pública** (ex: `https://seusistema.com/api/whatsapp/webhook`)
7. **Verify Token** (string secreta que você cria)
8. **App Secret** (para validar assinatura dos webhooks)

**Dependências técnicas no seu código**:
- Biblioteca HTTP (no exemplo usei `axios`)
- Banco de dados para armazenar: Configuração por empresa, templates, envios e mensagens recebidas
- Servidor com endpoint público (Next.js App Router funciona bem)
- Tratamento de erros e retries (Meta pode reenviar webhooks em caso de falha)

**Limites importantes**:
- Tier de mensagens: Começa com Tier 1 (~1.000 usuários únicos por 24h) e escala automaticamente com qualidade e volume (até ilimitado)
- Rate limit aproximado: ~80 mensagens por segundo inicialmente (varia)
- Templates precisam ser aprovados pela Meta antes de usar em produção

### 4. Tem custo?

**Resposta direta**:
- **A Cloud API em si é gratuita** (não paga para usar a API ou hospedagem da Meta).
- **Você paga por conversas/mensagens enviadas** (cobrança da Meta).

**Modelo de precificação em 2026 (Brasil)**:
- Cobrança baseada em **categoria da mensagem** + **país do destinatário** (não do remetente).
- Categorias principais:
  - **Utility** (confirmações, lembretes, atualizações transacionais como agendamento, pedido, etc.) → mais barata
  - **Marketing** (promoções, reativação) → mais cara
  - **Authentication** (códigos de verificação) → específica
  - **Service** (respostas dentro da janela de 24h após cliente falar) → geralmente **gratuita**

- No Brasil, valores aproximados (consulte sempre a tabela oficial, pois varia por tier de volume):
  - Utility: em torno de US$ 0.0068 a US$ 0.012 por conversa/mensagem (dependendo do volume mensal)
  - Marketing: mais alto (pode ser 5-10x maior)
  - Há tiers de volume com descontos progressivos mensais.

- **Janela de serviço gratuita**: Após o cliente responder, você tem 24h (ou 72h em alguns casos via anúncios) para enviar mensagens sem custo extra da Meta.

- **Outros custos indiretos**:
  - Desenvolvimento e manutenção do webhook/service
  - Hospedagem do seu sistema
  - Provedor opcional (se não quiser gerenciar token/webhook diretamente)

**Recomendação**: Comece com templates **Utility** (confirmação de agendamento, lembrete 24h, confirmação de pedido). Eles são mais baratos e mais fáceis de aprovar.
