Aqui está a **integração com WhatsApp** organizada para o seu sistema ERP SaaS multi-tenant (pipoca gourmet + studio de beleza), alinhada com o schema Prisma que você tem e com as automações que você já planejou (confirmação de agendamento, lembrete 24h, reativação, etc.).

### 1. Escolha da Estratégia (Recomendação 2026)

Para um SaaS multi-tenant no Brasil, as melhores opções são:

- **Opção Recomendada (mais robusta e escalável):**  
  **WhatsApp Cloud API (oficial da Meta)** + provedor BSP brasileiro ou direto via Graph API.  
  Vantagens: Conformidade total, templates aprovados, entrega confiável, suporte a botões interativos, catálogos e flows.  
  Desvantagens: Templates precisam de aprovação (pode demorar alguns dias na primeira vez).

- **Alternativa boa e mais simples para começar:**  
  **Evolution API** (open-source, suporta Baileys + Cloud API) ou provedores como **Wati**, **Z-API**, **Wassenger** ou **BOL7**.  
  Eles facilitam muito o multi-tenant e o gerenciamento de múltiplos números por empresa.

- **Evite no início:** Baileys puro (instabilidade alta em produção) ou soluções não-oficiais sem suporte a templates.

**Minha sugestão para você agora:** Comece com **WhatsApp Cloud API** (direto ou via provedor simples) porque você precisa de **confirmações automáticas de agendamento** e lembretes — que exigem templates aprovados.

### 2. Modelos no Prisma (Adições ao seu schema)

Adicione estas tabelas para gerenciar a integração de forma limpa e multi-tenant:

```prisma
model ConfiguracaoWhatsApp {
  id                String   @id @default(uuid())
  empresaId         String
  phoneNumberId     String   // Phone ID da Cloud API
  businessAccountId String?
  accessToken       String   // Token permanente (armazene criptografado)
  webhookSecret     String?  // Para validar webhooks
  ativo             Boolean  @default(true)

  empresa Empresa @relation(fields: [empresaId], references: [id])

  templates TemplateWhatsApp[]

  @@unique([empresaId])
}

model TemplateWhatsApp {
  id          String   @id @default(uuid())
  empresaId   String
  nome        String   // ex: "confirmacao_agendamento"
  templateId  String   // ID aprovado no Meta (ex: "agendamento_confirmado_v1")
  categoria   String   // UTILITY, MARKETING, AUTHENTICATION
  idioma      String   @default("pt_BR")
  conteudo    String   // JSON do template ou texto base
  aprovado    Boolean  @default(false)
  variaveis   String[] // ex: ["nome", "data", "hora", "servico"]

  empresa     Empresa @relation(fields: [empresaId], references: [id])
  envios      EnvioWhatsApp[]

  @@unique([empresaId, nome])
}

model EnvioWhatsApp {
  id              String   @id @default(uuid())
  empresaId       String
  templateId      String?
  destinatario    String   // número com +55
  variaveis       Json?    // { "nome": "João", "data": "15/04", ... }
  status          String   // ENVIADO, ENTREGUE, LIDO, FALHA
  mensagemId      String?  // ID retornado pela API
  contextoId      String?  // ID do Evento, Atendimento, Pedido etc.
  contextoTipo    String?  // "EVENTO", "ATENDIMENTO", "PEDIDO"

  createdAt       DateTime @default(now())

  empresa  Empresa         @relation(fields: [empresaId], references: [id])
  template TemplateWhatsApp? @relation(fields: [templateId], references: [id])
}
```

**Melhorias sugeridas:**
- Adicione `deletedAt` e `ordem` se quiser.
- Crie um service `WhatsAppService` que centralize todos os envios.

### 3. Fluxos Automáticos Recomendados (Prioridade)

Baseado nos seus módulos (Agenda + Atendimento + Pedidos):

1. **Confirmação imediata de agendamento** (Evento criado)
2. **Lembrete 24h antes**
3. **Lembrete 2h antes** (opcional)
4. **Confirmação de atendimento finalizado** + pedido de avaliação
5. **Baixa de estoque / geração de título** → notificação opcional ao cliente
6. **Confirmação de pedido** (pipoca)
7. **Reativação de clientes inativos** (marketing – template específico)

Todos esses fluxos devem ser disparados via **eventos de domínio** (ex: `EventoCriado`, `AtendimentoFinalizado`).

### 4. Implementação Técnica (Próximos Passos Práticos)

**Passo a passo para começar hoje:**

1. **Cadastre a Empresa no Meta Business**  
   - Verifique a empresa  
   - Crie uma conta WhatsApp Business  
   - Adicione um número dedicado  
   - Obtenha o **Phone Number ID** e **Access Token permanente**

2. **Crie Templates** (exemplos prontos para você):

   - **Confirmação de Agendamento (Utility)**  
     `Olá {{1}}, seu agendamento para {{2}} no dia {{3}} às {{4}} foi confirmado!  
     Profissional: {{5}}.  
     Qualquer dúvida responda aqui.`

   - **Lembrete 24h**  
     `Lembrete: Amanhã às {{1}} você tem agendamento de {{2}} conosco.  
     Confirme respondendo "SIM" ou remarque respondendo "REMARCAR".`

   - **Confirmação de Pedido**  
     `Seu pedido #{{1}} foi confirmado! Valor: R$ {{2}}. Entrega prevista para {{3}}.`

3. **Service Layer no Backend (Next.js + Prisma)**

Crie um serviço reutilizável:

```ts
// services/whatsapp.service.ts
export class WhatsAppService {
  async enviarTemplate(
    empresaId: string,
    templateNome: string,
    destinatario: string,
    variaveis: Record<string, string>,
    contexto?: { tipo: string; id: string }
  ) {
    // Busca config + template da empresa
    // Chama a API (Cloud ou provedor)
    // Registra no EnvioWhatsApp
  }

  // Webhook handler para status (entregue, lido) e respostas do cliente
}
```

4. **Integre com seus fluxos críticos**

No service de Atendimento ou Evento, após criar o registro:

```ts
// Exemplo após criar Evento
await whatsappService.enviarTemplate(
  evento.empresaId,
  "confirmacao_agendamento",
  cliente.telefone,
  {
    "1": cliente.nome,
    "2": servico.nome,
    "3": formatarData(evento.dataInicio),
    "4": formatarHora(evento.dataInicio),
    "5": profissional?.nome || "Equipe"
  },
  { tipo: "EVENTO", id: evento.id }
);
```

### 5. Próximos Passos Imediatos (Prioridade)

Quer que eu monte agora algum desses itens?

1. **Schema Prisma completo** com as novas tabelas + indexes
2. **Código do WhatsAppService** (com exemplos para Cloud API e para Evolution API)
3. **Exemplos de templates** aprováveis + categoria certa
4. **Handler de Webhook** (para receber respostas do cliente e atualizar status)
5. **Configuração de eventos de domínio** para disparar as mensagens automaticamente

Diga qual peça você quer primeiro (ou se prefere começar com um provedor específico como Wati/Evolution), e eu entrego o código pronto para copiar-colar no seu projeto.

Qual caminho você quer seguir? Cloud API direto, Evolution API (self-hosted), ou um provedor gerenciado brasileiro?

Aqui estão **5 exemplos completos de templates** para WhatsApp Business API (Cloud API), perfeitamente adaptados ao seu sistema ERP multi-tenant (Studio de Beleza + Pipoca Gourmet).

Todos os exemplos seguem as **melhores práticas da Meta em 2026**:
- Linguagem clara, amigável e profissional
- Uso de variáveis (`{{1}}`, `{{2}}`, etc.)
- Chamadas para ação (CTA) claras
- Evitam conteúdo promocional excessivo nos templates **Utility** (mais fáceis de aprovar)
- Incluem emojis leves (aceitos na maioria dos casos)

Recomendo categorizar a maioria como **UTILITY** (confirmações, lembretes, atualizações transacionais). Templates **MARKETING** precisam de opt-in explícito do cliente.

### 1. Confirmação Imediata de Agendamento (Utility) – Studio de Beleza
**Nome sugerido no banco:** `confirmacao_agendamento`

**Texto do template:**
```
Olá {{1}}! ✅

Seu agendamento para {{2}} foi confirmado com sucesso.

📅 Data: {{3}}
⏰ Horário: {{4}}
👩‍💼 Profissional: {{5}}

Qualquer dúvida, é só responder aqui.
Até breve! 💅
```

**Variáveis esperadas:**
- {{1}} = Nome do cliente
- {{2}} = Nome do serviço (ex: Manicure + Alongamento de Cílios)
- {{3}} = Data formatada (ex: 15/04/2026)
- {{4}} = Horário (ex: 14:30)
- {{5}} = Nome do profissional (ou "Equipe" se não tiver)

**Uso no sistema:** Disparado logo após criar o `Evento` ou `Atendimento`.

### 2. Lembrete 24h Antes (Utility) – Studio de Beleza
**Nome sugerido:** `lembrete_24h_agendamento`

**Texto do template:**
```
Olá {{1}} 👋

Este é um lembrete do seu agendamento amanhã:

📅 {{2}} às {{3}}
Serviço: {{4}}
Profissional: {{5}}

Responda *SIM* para confirmar ou *REMARCAR* se precisar alterar.

Obrigada pela preferência! 😊
```

**Variáveis:**
- {{1}} = Nome
- {{2}} = Data por extenso (ex: quarta-feira, 15 de abril)
- {{3}} = Horário
- {{4}} = Serviço
- {{5}} = Profissional

**Dica:** Configure um job agendado (ex: com BullMQ ou cron) para disparar 24h antes da `dataInicio` do Evento.

### 3. Confirmação de Pedido + Produção (Utility) – Pipoca Gourmet
**Nome sugerido:** `confirmacao_pedido`

**Texto do template:**
```
Olá {{1}}! 🎉

Seu pedido #{{2}} foi confirmado e já está em produção.

📦 Itens: {{3}}
💰 Valor total: R$ {{4}}
📅 Previsão de entrega: {{5}}

Acompanhe o status respondendo aqui ou pelo link: {{6}}

Obrigado por escolher nossas pipocas gourmet! 🍿
```

**Variáveis:**
- {{1}} = Nome do cliente
- {{2}} = Número do Pedido
- {{3}} = Resumo dos itens (ex: "Pipoca Doce 500g + Pipoca Salgada Premium")
- {{4}} = Valor total
- {{5}} = Data/hora prevista de entrega
- {{6}} = Link opcional para rastreio (se tiver)

**Uso:** Disparado ao criar ou confirmar o `Pedido`.

### 4. Lembrete de Atendimento Finalizado + Avaliação (Utility ou Marketing leve)
**Nome sugerido:** `pos_atendimento_avaliacao`

**Texto do template:**
```
Olá {{1}}! 💖

Esperamos que tenha gostado do seu {{2}} hoje.

Sua opinião é muito importante para nós!

Avalie sua experiência em poucos segundos: {{3}}

Obrigada por fazer parte da nossa história! 
Até a próxima! 😊
```

**Variáveis:**
- {{1}} = Nome
- {{2}} = Serviço realizado
- {{3}} = Link curto para formulário de avaliação (Google Forms, Typeform, ou interno)

**Uso:** Disparado após marcar o `Atendimento` como finalizado (evento de domínio `AtendimentoFinalizado`).

### 5. Reativação de Cliente Inativo (Marketing) – Cross (Studio + Pipoca)
**Nome sugerido:** `reativacao_cliente`

**Texto do template:**
```
Olá {{1}}! Sentimos sua falta ❤️

Já faz um tempo desde seu último {{2}} conosco.

Que tal voltar? Temos novidades especiais para você:

→ {{3}} OFF no próximo serviço/produto

Responda *QUERO* e te enviamos opções de horários ou produtos.

Aguardamos você! 🍿💅
```

**Variáveis:**
- {{1}} = Nome
- {{2}} = Último serviço/produto (ex: "atendimento de manicure" ou "pedido de pipoca")
- {{3}} = Desconto (ex: "15%")

**Observação importante:**  
Este é **Marketing**, então precisa de consentimento prévio (opt-in). Use com moderação e respeite a política da Meta.

### Dicas de Implementação no Seu Sistema

No seu `TemplateWhatsApp` model, salve:
- `nome` → o nome sugerido acima
- `templateId` → ID retornado pela Meta após aprovação
- `variaveis` → array com os nomes das variáveis (ex: ["nome", "servico", "data", "hora", "profissional"])
- `categoria` → "UTILITY" ou "MARKETING"

No `WhatsAppService`, ao chamar `enviarTemplate`, passe um objeto com as variáveis mapeadas:

```ts
await whatsappService.enviarTemplate(
  empresaId,
  "confirmacao_agendamento",
  cliente.telefone,
  {
    "1": cliente.nome,
    "2": servico.nome,
    "3": formatarData(evento.dataInicio),
    // ...
  },
  { tipo: "EVENTO", id: evento.id }
);
```

**✅ Implementação COMPLETA da API WhatsApp Cloud API (Enviar + Receber mensagens)**

Aqui está tudo que você precisa para **disparar templates** e **receber mensagens/status** no seu projeto Next.js + Prisma (multi-tenant).

Usei a **WhatsApp Cloud API oficial da Meta** (versão recomendada em 2026: `v20.0` – confirme no seu Meta Business Manager a versão exata).

### 1. Primeiro: Adicione estas tabelas no Prisma (atualização do schema)

Adicione no seu `schema.prisma` (dentro do bloco de `ConfiguracaoWhatsApp` que já te passei):

```prisma
model MensagemRecebida {
  id              String   @id @default(uuid())
  empresaId       String
  from            String   // número do cliente (+55...)
  mensagem        String?
  tipo            String   // "text", "image", "button_reply", etc.
  mensagemId      String   // ID da Meta
  contextoId      String?  // ID do Evento/Atendimento/Pedido
  contextoTipo    String?  // "EVENTO", "ATENDIMENTO", etc.
  status          String   @default("RECEBIDA") // RECEBIDA, PROCESSADA, etc.
  payload         Json     // payload completo da Meta (para debug)
  createdAt       DateTime @default(now())

  empresa Empresa @relation(fields: [empresaId], references: [id])

  @@index([empresaId, from])
}
```

Depois rode:
```bash
npx prisma db push
npx prisma generate
```

### 2. Variáveis de ambiente (.env)

```env
# Meta WhatsApp Cloud API
WHATSAPP_API_VERSION=v20.0
WHATSAPP_VERIFY_TOKEN=seu_token_secreto_para_verificacao_webhook   # crie um aleatório forte

# (Opcional - se quiser usar um token global para testes)
# WHATSAPP_ACCESS_TOKEN=...
```

### 3. Serviço completo: `src/services/whatsapp.service.ts`

```ts
// src/services/whatsapp.service.ts
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class WhatsAppService {
  private async getConfig(empresaId: string) {
    const config = await prisma.configuracaoWhatsApp.findUnique({
      where: { empresaId },
      include: { templates: true },
    });
    if (!config || !config.ativo) throw new Error('Configuração WhatsApp não encontrada ou inativa');
    return config;
  }

  async enviarTemplate(
    empresaId: string,
    templateNome: string,
    destinatario: string, // ex: "5511999999999"
    variaveis: Record<string, string>, // { "1": "João", "2": "15/04" }
    contexto?: { tipo: string; id: string }
  ) {
    const config = await this.getConfig(empresaId);
    const template = config.templates.find(t => t.nome === templateNome);
    if (!template) throw new Error(`Template ${templateNome} não encontrado`);

    const url = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`;

    const components = [{
      type: 'body',
      parameters: Object.keys(variaveis).map(key => ({
        type: 'text',
        text: variaveis[key],
      })),
    }];

    const payload = {
      messaging_product: 'whatsapp',
      to: destinatario,
      type: 'template',
      template: {
        name: template.templateId, // nome aprovado na Meta
        language: { code: template.idioma || 'pt_BR' },
        components,
      },
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
      });

      // Registra envio
      await prisma.envioWhatsApp.create({
        data: {
          empresaId,
          templateId: template.id,
          destinatario,
          variaveis: variaveis,
          status: 'ENVIADO',
          mensagemId: response.data.messages[0].id,
          contextoId: contexto?.id,
          contextoTipo: contexto?.tipo,
        },
      });

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error.response?.data || error);
      throw new Error('Falha ao enviar mensagem');
    }
  }

  // Método auxiliar para enviar mensagem livre (dentro da janela de 24h)
  async enviarMensagemLivre(empresaId: string, destinatario: string, texto: string) {
    // implementação similar (type: "text")
  }
}
```

### 4. Webhook completo (receber mensagens + status)

Crie o arquivo: `app/api/whatsapp/webhook/route.ts`

```ts
// app/api/whatsapp/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { WhatsAppService } from '@/services/whatsapp.service';

const prisma = new PrismaClient();
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso');
    return NextResponse.json({ challenge }, { status: 200 });
  }
  return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Webhook recebido:', JSON.stringify(body, null, 2));

    // Processa cada entrada (normalmente vem um array)
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        // 1. Status de mensagens enviadas (entregue, lido, falha)
        if (value.statuses) {
          for (const status of value.statuses) {
            await prisma.envioWhatsApp.updateMany({
              where: { mensagemId: status.id },
              data: { status: status.status.toUpperCase() }, // DELIVERED, READ, FAILED
            });
          }
        }

        // 2. Mensagens recebidas do cliente
        if (value.messages) {
          for (const message of value.messages) {
            // Descobre a empresa pelo número de telefone (phoneNumberId)
            const config = await prisma.configuracaoWhatsApp.findFirst({
              where: { phoneNumberId: value.metadata?.phone_number_id },
            });

            if (!config) continue;

            await prisma.mensagemRecebida.create({
              data: {
                empresaId: config.empresaId,
                from: message.from,
                mensagem: message.text?.body || message.interactive?.button_reply?.title,
                tipo: message.type,
                mensagemId: message.id,
                payload: message,
                // Se quiser mapear contexto automaticamente (ex: reply a um template), pode adicionar lógica aqui
              },
            });

            // Exemplo: responder automaticamente a "SIM" ou "REMARCAR"
            if (message.text?.body?.toUpperCase() === 'SIM') {
              // Aqui você pode chamar um service para confirmar agendamento etc.
              console.log(`✅ Cliente ${message.from} confirmou!`);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 5. Como usar no seu fluxo (exemplo no service de Evento)

```ts
// Exemplo em src/services/evento.service.ts
await new WhatsAppService().enviarTemplate(
  evento.empresaId,
  "confirmacao_agendamento",
  cliente.telefone,
  {
    "1": cliente.nome,
    "2": servico.nome,
    "3": dataFormatada,
    "4": horaFormatada,
    "5": profissionalNome,
  },
  { tipo: "EVENTO", id: evento.id }
);
```

### 6. Configuração no Meta Business (passo a passo rápido)

1. Vá em **Meta for Developers** → Seu App → WhatsApp → Configuração
2. Copie o **Phone Number ID**
3. Coloque o **Webhook URL**:
   `https://seusistema.com/api/whatsapp/webhook`
4. Cole o `WHATSAPP_VERIFY_TOKEN` que você criou
5. Assine os campos: `messages`, `message_statuses`

Pronto! Agora o sistema **envia templates** e **recebe respostas do cliente** automaticamente, tudo registrado no banco com `empresaId`.

