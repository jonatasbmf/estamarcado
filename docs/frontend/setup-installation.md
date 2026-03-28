# Setup e Instalação (Front-end Next.js)

Este guia cobre a criação exata da "fundação do castelo" Web replicando os componentes do Shadcn UIKit Premium e moldando o grid do AdminLTE em código livre Tailwind, **incluindo o suporte nativo a temas (Claro/Escuro)**.

## 1. Scaffold Inicial (Next.js + Tailwind)

Acesse a pasta desejada no seu terminal corporativo (ex: raiz do repositório) e gere a arquitetura Next.js:

```bash
npx create-next-app@latest web
```
**Responda ao assistente EXATAMENTE com as marcações:**
- ✔ Would you like to use TypeScript? **Yes**
- ✔ Would you like to use ESLint? **Yes**
- ✔ Would you like to use Tailwind CSS? **Yes**
- ✔ Would you like to use `src/` directory? **Yes**
- ✔ Would you like to use App Router? (recommended) **Yes**
- ✔ Would you like to customize the default import alias (@/*)? **No**

Navegue até o diretório: `cd web`

## 2. Instalação e Inicialização do shadcn/ui

O **shadcn** usa uma CLI que "clona" o código dos componentes diretamente para dentro da sua pasta `src/components/ui/`, permitindo que você os edite caso ache necessário.

Rodar o CLI nativo:
```bash
npx shadcn-ui@latest init
```

**Responda rigorosamente com este setup de Estilo Moderno:**
- ✔ Which style would you like to use? **New York** *(Visual achatado menor e focado comercialmente parecido com o UIKit)*
- ✔ Which color would you like to use as base color? **Slate** *(Ou Zinc, fundos cinzas corporativos)*
- ✔ Would you like to use CSS variables for colors? **Yes** *(Crítico para criar Temas Escuros / Claros abaixo)*

## 3. Configuração do dark/light Mode e `globals.css`

Para o design emular os painéis avançados de 2026, você deve configurar o `next-themes` e sobrepor as variáveis de CSS para suportar a troca de identidade visual elegante no Shadcn.

**A) Instalar o Next Themes:**
```bash
npm install next-themes
```

> Com a biblioteca instalada, abra o seu arquivo root de layout em `src/app/layout.tsx` e envolva pelo Provider do *next-themes*, permitindo que `<ThemeProvider attribute="class" defaultTheme="system">` intercepte o DOM (HTML).

**B) Sobrescrita do `src/app/globals.css`:**
O `globals.css` deve portar as variáveis HSL (Hue, Saturation, Lightness) para que todo card, borda e fundo invertam cor perfeitamente de acordo com o `tailwind.config.js` pré-gerado pelo init do Shadcn. Substitua o conteúdo dele por:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem; /* Ponta do ShadcnUiKit e Vercel arredondada levemente */
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    /* 
      Abaixo um fundo sutilmente Cinza/Slate profundo clássico AdminLTE moderno 
      para o fundo exterior "bg-slate-950". 
    */
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    /* Adicionando Anti-aliasing corporativo font Apple/iOS */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

## 4. Instalando as "Pecinhas" Shadcn Vitais

Para economizar linhas e horas fabricando modais e tabelas, você vai puxar os seguintes componentes oficiais da sua base Alvo usando a CLI, os quais lerão instintivamente seu `globals.css` preenchido acima.

```bash
# Layout Central (Sidebar e Menus Suspensos para perfil Logado)
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add collapsible

# "Tenant Switcher" da barra Superior (Empresas do Grupo)
npx shadcn-ui@latest add select
npx shadcn-ui@latest add command
npx shadcn-ui@latest add popover

# Cards de Dashboard (Corações do AdminLTE Design e Shadcnuikit)
npx shadcn-ui@latest add card

# Ferramental de Data Display e Interações
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button

# Iconografia rica nativa (Baseado no seu template alvo)
npm install lucide-react
```

## 5. Estrutura de Pastas Pós-Setup

Seu projeto Next estará pronto e devidamente formatado assim:
```text
/src
├── /app                  // Telas (Page.tsx) e Layouts
│   ├── /dashboard        // Rotas privativas
│   ├── globals.css       // Configurado 100% via Tema Shadcn (Item 3)
│   └── layout.tsx        // Casca mestra root englobando <ThemeProvider>
├── /components
│   ├── /theme-provider.tsx // Plugin Provider Next-Theme
│   ├── /ui               // Components Gerados pela CLI do shadcn
│   └── /layout           // Nossos componentes exclusivos (AdminLTE Skeleton refeito)
│       ├── Header.tsx    
│       ├── Sidebar.tsx   
│       └── TenantSwitcher.tsx
└── /lib                  
    └── utils.ts          // Class Merge nativo do shadcn (twMerge)
```

Seguindo isso você dominará estritamente as folhas de estilo, evitando depender de folhas genéricas amarradas em templates que não suportam bem as atualizações sazonais e sombrias do novo React19/Next15.
