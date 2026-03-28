# Arquitetura Mãe de Layout (App Router)

O objetivo principal de replicar o **AdminLTE** com cara de **Shadcnuikit** é encapsular todas as rotas protegidas (`/app/dashboard/...`) em um template que **não redesenha toda vez que você clica num menu**. 

A tela é dividida matematicamente em Tailwind CSS:
- `w-64` (256px fixos) = Sidebar Esquerda flutuante (Desktop) ou Hidden (Mobile).
- `flex-1` (O Resto do monitor) = Fundo **Cinza Claro** (`bg-slate-50` ou `bg-zinc-50`), Header e as Telas que o Usuário navegar (Agendamentos, Estoque etc).

Crie o arquivo: `src/app/dashboard/layout.tsx`

```tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

// Definimos uma variável métrica caso queira fazer o Sidebar Colapsável (Fechado 80px) futuramente
const SIDEBAR_WIDTH = "w-64"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // "h-screen" garante que a tela nunca derrape para scrolls globais do body, 
    // forçando a rolagem apenas do Content, igual apps nativos.
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* 
        A Sidebar (AdminLTE Left Menu).
        "hidden md:block" = Some no celular, vira hambúrguer (Desenhada no Header em um <Sheet /> do Shadcn).
      */}
      <div className={`hidden md:block ${SIDEBAR_WIDTH} h-full border-r bg-white dark:bg-slate-900 flex-shrink-0 z-10 shadow-sm`}>
        <Sidebar className="h-full w-full" />
      </div>

      {/* Container Principal Direito */}
      <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
        
        {/* Top Navbar / Header (Contém Tenant Switcher e Login Avatar) */}
        <header className="h-16 w-full flex-shrink-0 border-b bg-white dark:bg-slate-900 shadow-sm z-20">
          <Header />
        </header>

        {/* 
          Conteúdo Variante (Onde o Page.tsx Renderiza) 
          Scroll embutido aqui evita que a barra/header sumam quando a tabela central for gigante
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
```

## Como isto Funciona na Prática:
Qualquer pasta / arquivo que você criar dento de `app/dashboard/` (Por exemplo: `app/dashboard/estoque/page.tsx`) herdará automaticamente este componente envolta dela. É a união do Design Antigo Consistente do AdminLTE com o framework SSG/SSR avassalador do React Servidor moderno.

> [!NOTE]
> Para o "Dark Mode" do Tailwind ser embutido com classe perfeitamente natural (Como você vê nos temas `dark:bg-slate-900`), a recomendação oficial na sua `Global.css` ou instalando o `next-themes` é fundamental. Essa estrutura já foi montada suportando chaves de cores escuras pré configuradas nativamente.
