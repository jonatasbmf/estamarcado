# Sidebar Inteligente (Múltiplos Níveis: Acordeão)

Diferente de um menu raso, sistemas ERP como o seu exigem Aninhamento de Categorias (Menu Principal > Submenu > Ação). 

Para atingir exatamente o comportamento comercial do ShadcnUIKit (incluindo a **setinha animada** `ChevronDown` e a compatibilidade total com o Tema Escuro `Dark Mode`), nós transformaremos nossa Sidebar em uma estrutura recursiva utilizando o estado do React (`useState`) para gerenciar as "gavetas abertas" (Acordeões).

## Estrutura Atualizada: `src/components/layout/Sidebar.tsx`

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; 
import { 
  BarChart3, 
  Box, 
  CalendarDays, 
  ChevronDown,
  CreditCard, 
  Home, 
  Package, 
  Scissors,
  Settings 
} from "lucide-react";

// Simulando o estado Global (Zustand ou Context)
const MOCK_TENANT_TYPE = "PIPOCA"; // STUDIO, PIPOCA, HOLDING

// Interface Recursiva que permite Menu -> Submenu -> Ação
interface RouteItem {
  title: string;
  href?: string; // TBD apenas se for um Link Final de Ação
  icon?: React.ComponentType<{ className?: string }>;
  allowedTenants: string[];
  children?: RouteItem[]; // Array recursivo para gerar os Submenus
}

const NAVIGATION: RouteItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home, allowedTenants: ["ALL"] },
  
  // === EXEMPLO ESPECÍFICO APLICADO: PRODUÇÃO (Multilevel) ===
  {
    title: "Produção",
    icon: Package,
    allowedTenants: ["PIPOCA", "HOLDING"],
    children: [
      {
        title: "Cadastro",
        allowedTenants: ["ALL"],
        children: [
          { title: "Produto", href: "/dashboard/producao/cadastro/produto", allowedTenants: ["ALL"] },
          { title: "Linha de Produção", href: "/dashboard/producao/cadastro/linha", allowedTenants: ["ALL"] }
        ]
      },
      {
        title: "Acompanhamento",
        allowedTenants: ["ALL"],
        children: [
          { title: "Produção em Andamento", href: "/dashboard/producao/andamento", allowedTenants: ["ALL"] },
          { title: "Produção Finalizada", href: "/dashboard/producao/finalizada", allowedTenants: ["ALL"] }
        ]
      },
      {
        title: "Relatório",
        allowedTenants: ["ALL"],
        children: [
          { title: "Produção Mensal", href: "/dashboard/producao/relatorio/mensal", allowedTenants: ["ALL"] },
          { title: "Tempo Médio", href: "/dashboard/producao/relatorio/tempo", allowedTenants: ["ALL"] },
          { title: "Custo Médio", href: "/dashboard/producao/relatorio/custo", allowedTenants: ["ALL"] }
        ]
      }
    ]
  },

  // Outros Módulos
  { 
    title: "Financeiro", 
    icon: CreditCard, 
    allowedTenants: ["ALL"],
    children: [
      { title: "Contas a Pagar", href: "/dashboard/financeiro/pagar", allowedTenants: ["ALL"] },
      { title: "Contas a Receber", href: "/dashboard/financeiro/receber", allowedTenants: ["ALL"] }
    ]
  },
  
  // Módulo Específico Sem filhos (Apenas Ação)
  { title: "Configurações", href: "/dashboard/settings", icon: Settings, allowedTenants: ["HOLDING"] },
];

/**
 * COMPONENTE RECURSIVO: Desenha itens individualmente. 
 * Se tem 'children', vira um Acordeão (Botão de abrir gaveta).
 * Nível 0 = Menu Pai (Com Ícone)
 * Nível 1+ = Filhos Indentados
 */
function NavItem({ item, level = 0 }: { item: RouteItem; level?: number }) {
  const pathname = usePathname();
  
  // Se existir 'children', o item inicializa checando se a rota filha está ativa pra manter a gaveta aberta
  const hasActiveChild = item.children?.some(child => 
    child.href ? pathname.startsWith(child.href) : false
  );
  
  const [isOpen, setIsOpen] = useState(hasActiveChild || false);
  const isActive = item.href ? pathname === item.href : false;
  const isParent = !!item.children;
  
  const Icon = item.icon;

  // Calculando padding da Esquerda baseado no quão profundo é o submenu "menu -> submenu -> acao"
  const paddingLeft = level === 0 ? "px-3" : level === 1 ? "pl-9 pr-3" : "pl-12 pr-3";

  if (isParent) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {/* Botão que Abre/Fecha a Gaveta */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex w-full items-center justify-between rounded-md py-2 text-sm font-medium transition-colors cursor-pointer",
            paddingLeft,
            level === 0 ? "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-50" 
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300" />}
            <span>{item.title}</span>
          </div>
          {/* Chevron animado (Copiando o template ShadcnUIKit) */}
          <ChevronDown 
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400", 
              isOpen && "rotate-180"
            )} 
          />
        </button>
        
        {/* Renderiza os filhos Recursivamente se estiver Aberto */}
        {isOpen && (
          <div className="flex flex-col gap-1 mt-1">
            {item.children!.map((child, idx) => (
              <NavItem key={idx} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Se NÃO for um pai, é um link acionável normal.
  return (
    <Link
      href={item.href!}
      className={cn(
        "group flex w-full items-center gap-3 rounded-md py-2 text-sm transition-colors cursor-pointer",
        paddingLeft,
        level === 0 ? "font-medium" : "font-normal",
        isActive 
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-50 font-medium" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
      )}
    >
      {Icon && (
        <Icon 
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-500 dark:text-slate-400 dark:group-hover:text-slate-300"
          )} 
        />
      )}
      {/* Visual de Bullet pra Sub-itens no Dark/Light mode */}
      {!Icon && level > 0 && (
         <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-600")} />
      )}
      <span>{item.title}</span>
    </Link>
  );
}

// ==============
// SIDEBAR MESTRA
// ==============
export function Sidebar({ className }: { className?: string }) {
  
  // Limpa o menu escondendo as sessões proibidas (Baseado na empresa escolhida)
  const filterNavRecursively = (items: RouteItem[]): RouteItem[] => {
    return items
      .filter(item => item.allowedTenants.includes("ALL") || item.allowedTenants.includes(MOCK_TENANT_TYPE))
      .map(item => {
        if (item.children) {
          return { ...item, children: filterNavRecursively(item.children) };
        }
        return item;
      });
  };

  const filteredNav = filterNavRecursively(NAVIGATION);

  return (
    <aside className={cn("flex flex-col py-4 h-full bg-white dark:bg-slate-950", className)}>
      
      {/* Logos */}
      <div className="px-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase truncate">
          {MOCK_TENANT_TYPE === "STUDIO" ? "Beleza Studio" : "Pipoca Store"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Software ERP</p>
      </div>

      {/* Rendering do Backbone (Scrollable) */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {filteredNav.map((item, idx) => (
          <NavItem key={idx} item={item} />
        ))}
      </nav>
      
    </aside>
  );
}
```

## Benefícios deste Código Atualizado
- **Componentização Recursiva (`<NavItem />`):** O código se arranja "infinitamente". Você pode ter um *Menu* > *Submenu* > *Sub-Submenu* e ele lidará com a indentação visual à medida que aprofunda (`pl-3` -> `pl-9` -> `pl-12`).
- **Animações Fluidas:** O ícone `ChevronDown` verifica o status da prop de abertura e inclina nativamente de ponta-cabeça acompanhando a classe de rotação pura (`rotate-180`).
- **Pequeno "Bullet":** Sub-submenus sem ícones, como "*Produto*" ou "*Linha de produção*", gerarão dinamicamente um pequeno círculo charmoso esquerdo (`h-1.5 w-1.5 rounded-full`) pintando de branco ou preto de acordo com o `Dark Mode` ativo se a Rota/Ação corresponder na URL!
