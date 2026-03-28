# Top Navbar e Tenant Switcher (Header)

Conforme a documentação oficial da UIKit do Shadcn e a estrutura Clássica do AdminLTE, no Header sempre abriga-se as notificações, o Dark Mode toggle (se houver) e o Seletor de Tenant.

O Seletor de Empresa (Holding / Studio / Pipoca gourmet) será desenhado como um Componente visual do shadcn (`Select`). 

> [!TIP]
> Em produção, se a lista for gigante, utiliza-se um `<Popover /> + <Command />` (Combobox) do shadcn para inserir uma barra de pesquisa. Abaixo ilustrei o cenário objetivo e veloz de uso geral em `<Select />`.

Crie o arquivo: `src/components/layout/Header.tsx`

```tsx
"use client";

import { Bell, Menu, Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectSeparator, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Lista Genérica simulada que vem via API e Hook do usuário
const MESA_EMPRESAS = [
  { id: "holding_x", label: "Visão Global (Holding)", type: "HOLDING" },
  { id: "studio_y", label: "Studio de Beleza Matriz", type: "STUDIO" },
  { id: "pipoca_z", label: "Pipoca Gourmet Express", type: "PIPOCA" },
];

export function Header() {
  
  // Exemplo de Função que dispoleta o "Login" virtual de Empresa
  const handleTenantChange = (novoTenantId: string) => {
    console.log("Chamando Auth/Switch API para a empresa de ID:", novoTenantId);
    // document.cookie = `activeTenantId=${novoTenantId}; path=/; max-age=86400`;
    // fetch('/api/auth/switch-tenant', {method: 'POST'...})
    // window.location.reload(); 
  };

  return (
    <div className="flex w-full items-center justify-between px-4 h-full md:px-6">
      
      {/* 1. Lado Esquerdo Nav (Busca e Menu Hambúrguer Mobile) */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Hambúrguer só aparece no Mobile pra puxar a Sheet onde a Sidebar estará (Omiti o Sheet pra brevidade) */}
        <button className="md:hidden text-slate-500 hover:text-slate-900">
          <Menu className="h-6 w-6" />
        </button>

        {/* Busca global rápida de clientes */}
        <div className="hidden sm:flex items-center relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Buscar clientes, boletos..." 
            className="w-full bg-slate-50/50 pl-9 border-slate-200 outline-none focus-visible:ring-1 shadow-none h-9"
          />
        </div>
      </div>

      {/* 2. Lado Direito: A Mágica do Seletor de Empresa e Controles */}
      <div className="flex items-center justify-end gap-3 flex-1 md:flex-initial">
        
        {/* The Tenant Switcher (A adição Solicitada) */}
        <div className="hidden sm:flex md:w-[220px]">
          <Select 
            defaultValue="holding_x" 
            onValueChange={handleTenantChange}
          >
            <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 shadow-sm transition-all focus:ring-1">
              <SelectValue placeholder="Selecione o Grupo/Empresa..." />
            </SelectTrigger>
            
            <SelectContent align="end">
              
              <SelectGroup>
                <SelectLabel className="text-xs text-slate-500 uppercase tracking-wider">Visão Consolidada</SelectLabel>
                <SelectItem value="holding_x" className="font-medium text-slate-900">
                  🌐 Todas as Empresas
                </SelectItem>
              </SelectGroup>
              
              <SelectSeparator />
              
              <SelectGroup>
                <SelectLabel className="text-xs text-slate-500 uppercase tracking-wider">Unidades Franquia</SelectLabel>
                <SelectItem value="studio_y">💅 Empresa 1 (Studio)</SelectItem>
                <SelectItem value="pipoca_z">🍿 Empresa 2 (Pipoca)</SelectItem>
              </SelectGroup>
              
            </SelectContent>
          </Select>
        </div>

        {/* Separation vertical AdminLTE clássica */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Notificações (Sino) */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          {/* Badge vermelha via CSS absolute */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
      </div>
    </div>
  );
}
```

### Explicação da Mágica Visual:
Usamos o `<Select />` do shadcn pois suas opções de agrupamento (`<SelectGroup>`) separam graciosamente pelo Label a visão que o usuário logado tem da Holding X (Todas as empresas) contra a visão Micro das sub-empresas em operação direta (`<SelectItem>`). O evento `onValueChange` intercepta o "Switch Tenant" desenhado nos fluxos do Backend e aplica a Cookie trocada forçando o Recarregamento completo do app sem dar falsas esperanças em views já renderizadas.
