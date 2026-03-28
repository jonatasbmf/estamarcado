# Dashboard Padrão (Page Content Principal)

Aqui recriamos as "Widgets" / "KPI Cards" clássicas do AdminLTE fundindo-as visualmente ao Shadcn usando o Tailwind CSS para o sistema de Grids Responsivos (Flex e Grid css). 

Esta tela é o "Recheio central" (o `children`) do Layout Raiz.

Crie/Modifique no caminho: `src/app/dashboard/page.tsx`

```tsx
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function DashboardOverviewPage() {
  
  // Isso rodaria no Servidor (Server Component Next.js renderizando via API Nestjs Interna)
  return (
    <div className="space-y-6">
      
      {/* 
        1. Cabeçalho Dinâmico da View
      */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Estatísticas financeiras e de movimento da Unidade Ativa.
          </p>
        </div>
        <div className="flex gap-2">
           {/* Botões shadcn clássicos */}
           <Button variant="outline">Exportar CSV</Button>
           <Button>Novo Atendimento</Button>
        </div>
      </div>

      {/* 
        2. KPIs: AdminLTE Stat Boxes (Cards refatorados com Shadcn UI)
        Um grid que arranja 1 em celular, 2 no ipad, 4 no monitor de mesa
      */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.321,00</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-green-500">+18%</span> neste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque (PMP)</CardTitle>
            <Package className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.000</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -4% devido a produção pipoca
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Ativos</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-slate-500"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18</div>
            <p className="text-xs text-slate-500 mt-1">
              7 aguardando na fila 
            </p>
          </CardContent>
        </Card>

      </div>

      {/* 
        3. Area Complexa: Tabela de Dados e Componentes Grid
      */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Simulação Gráfico - Ocupa 4 Colunas (60%) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Faturamento Semanal</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] w-full flex items-center justify-center border-dashed border-2 rounded text-slate-400">
               {/* 
                  O componente de Gráfico do Shadcn usa a "Recharts".
                  Diga: "npx shadcn-ui@latest add chart" para preencher aqui de verdade.
               */}
               <p>Gráfico Rechart de Barras Renderizaria Aqui</p>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Transações - Ocupa 3 colunas (40%) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Operações Financeiras Fixas</CardTitle>
            <CardDescription>
              Tabela puramente Shadcn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Histórico ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">OSV-0044</TableCell>
                  <TableCell>
                     <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Pago</span>
                  </TableCell>
                  <TableCell className="text-right text-green-600">+R$ 250,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">FORN-08x</TableCell>
                  <TableCell>
                     <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Pendente</span>
                  </TableCell>
                  <TableCell className="text-right text-red-600">-R$ 1.250,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
```

A estrutura desenhada garante que sua aplicação suba nos navegadores como um SaaS moderno. Sem *page-loads* forçados (graças ao App router), preenchida por Tabelas elegantes do Tailwind em vez dos `<table class="table-striped font-sans border table">` verbosos oriundos do Bootstrap no AdminLTE original.
