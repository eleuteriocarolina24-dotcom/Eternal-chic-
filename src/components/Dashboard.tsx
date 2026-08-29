import React, { useState } from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  PlusCircle, 
  Barcode, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Product, SaleRecord, AgendaTask, ActiveTab } from '../types';

interface DashboardProps {
  products: Product[];
  sales: SaleRecord[];
  tasks: AgendaTask[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickPOS: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  sales,
  tasks,
  setActiveTab,
  onOpenQuickPOS
}) => {
  // Quick margin calculator state inside dashboard
  const [quickCost, setQuickCost] = useState<number | ''>(50);
  const [quickMargin, setQuickMargin] = useState<number>(100);

  // Calculations
  const totalItemsCount = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const totalUniqueProducts = products.length;

  // Total Invested in current stock
  const currentStockInvestment = products.reduce((acc, p) => acc + (p.costPrice * p.quantity), 0);
  
  // Total Potential Selling Value of current stock
  const currentStockPotentialGross = products.reduce((acc, p) => acc + (p.sellingPrice * p.quantity), 0);
  
  // Total Potential Profit in stock
  const potentialStockProfit = currentStockPotentialGross - currentStockInvestment;

  // Realized Sales & Profit
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalSalesProfit = sales.reduce((acc, s) => acc + s.totalProfit, 0);
  const totalPiecesSold = sales.reduce((acc, s) => acc + s.quantity, 0);

  // Overall Total Profit (Realized + Projected In Stock)
  const grandTotalProfit = totalSalesProfit + potentialStockProfit;

  // Category Breakdown for Charts
  const categoryDataMap: Record<string, { name: string; pieces: number; invested: number; potentialProfit: number }> = {};
  products.forEach(p => {
    const cat = p.category || 'Outros';
    if (!categoryDataMap[cat]) {
      categoryDataMap[cat] = { name: cat, pieces: 0, invested: 0, potentialProfit: 0 };
    }
    categoryDataMap[cat].pieces += p.quantity;
    categoryDataMap[cat].invested += p.costPrice * p.quantity;
    categoryDataMap[cat].potentialProfit += (p.sellingPrice - p.costPrice) * p.quantity;
  });
  const categoryChartData = Object.values(categoryDataMap);

  const WINE_PALETTE = ['#722F37', '#9E2A2B', '#A84252', '#D4AF37', '#B38B22', '#6D214F', '#82589F'];

  const lowStockItems = products.filter(p => p.quantity <= 2);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr || !t.completed).slice(0, 3);
  const recentProducts = products.slice(0, 3);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  // Quick margin calculated selling suggestion
  const quickCostNum = Number(quickCost) || 0;
  const quickSuggestedSelling = quickCostNum > 0 
    ? Math.floor(quickCostNum * (1 + quickMargin / 100)) + 0.90 
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header matching "Professional Polish" layout */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-sans">
              Eternal Chique • Gestão de Moda
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-chic text-gray-900 tracking-tight">
            Visão Geral
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Bem-vinda de volta ao seu ateliê. Acompanhe estoque, finanças e catálogo.
          </p>
        </div>

        {/* 3 Primary Metric Cards on Top */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          {/* Total Peças */}
          <div 
            onClick={() => setActiveTab('spreadsheet')}
            className="cursor-pointer bg-white p-4 rounded-xl shadow-xs border border-gray-200/80 hover:border-[#722F37]/30 transition-all min-w-[150px]"
            id="metric-total-pieces"
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Total Peças
            </p>
            <p className="text-2xl font-bold font-serif-chic text-gray-900 mt-1">
              {totalItemsCount}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {totalUniqueProducts} modelos
            </p>
          </div>

          {/* Investimento */}
          <div 
            onClick={() => setActiveTab('pricing')}
            className="cursor-pointer bg-white p-4 rounded-xl shadow-xs border border-gray-200/80 hover:border-amber-400 transition-all min-w-[150px]"
            id="metric-total-invested"
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Investimento
            </p>
            <p className="text-2xl font-bold font-serif-chic text-gray-900 mt-1">
              {formatCurrency(currentStockInvestment)}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Custo em arara
            </p>
          </div>

          {/* Lucro Total */}
          <div 
            onClick={() => setActiveTab('pos')}
            className="cursor-pointer bg-green-50/90 p-4 rounded-xl shadow-xs border border-green-200/80 hover:border-green-400 transition-all min-w-[160px]"
            id="metric-total-profit"
          >
            <p className="text-green-700 text-xs font-semibold uppercase tracking-wider">
              Lucro Total
            </p>
            <p className="text-2xl font-bold font-serif-chic text-green-800 mt-1">
              {formatCurrency(grandTotalProfit)}
            </p>
            <p className="text-[11px] text-green-700/80 mt-0.5">
              +{formatCurrency(totalSalesProfit)} já no caixa
            </p>
          </div>
        </div>
      </header>

      {/* Main 3-Column Section matching the Professional Polish HTML architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Catalog + Agenda + Charts */}
        <section className="lg:col-span-2 space-y-6">
          {/* 1. Recent Catalog Gallery Preview */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 font-serif-chic text-lg">
                  Catálogo Recente
                </h3>
                <p className="text-xs text-gray-500">Últimas peças disponíveis para venda na loja</p>
              </div>
              <button 
                onClick={() => setActiveTab('catalog')}
                className="text-[#722F37] hover:text-[#581C26] text-xs font-bold inline-flex items-center gap-1 hover:underline"
              >
                Ver Tudo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setActiveTab('catalog')}
                    className="cursor-pointer group bg-white rounded-xl border border-gray-100 hover:border-gray-300 overflow-hidden shadow-2xs transition-all hover:shadow-sm"
                  >
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={p.photo} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-gray-800 shadow-2xs backdrop-blur-xs font-mono">
                        {p.code}
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#722F37] text-white">
                        {p.quantity} un
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-800 truncate" title={p.name}>
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.category} • Tam {p.size || 'M'}
                      </p>
                      <p className="text-[#722F37] font-bold text-sm mt-1.5">
                        {formatCurrency(p.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-xs text-gray-400">
                  Nenhuma peça cadastrada ainda.
                </div>
              )}
            </div>
          </div>

          {/* 2. Agenda Hoje Box */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm font-serif-chic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#722F37]" />
                Agenda & Compromissos do Ateliê
              </h3>
              <button
                onClick={() => setActiveTab('agenda')}
                className="text-[#722F37] text-xs font-semibold hover:underline"
              >
                Abrir Agenda
              </button>
            </div>

            <div className="space-y-2">
              {todayTasks.length > 0 ? (
                todayTasks.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setActiveTab('agenda')}
                    className="cursor-pointer flex items-center justify-between gap-3 p-2.5 bg-gray-50 hover:bg-[#F5E6E8]/40 border border-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        t.priority === 'alta' ? 'bg-[#722F37]' : t.priority === 'media' ? 'bg-amber-400' : 'bg-emerald-500'
                      }`} />
                      <span className="text-xs text-gray-700 font-medium truncate">
                        {t.time ? `${t.time} - ` : ''}{t.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                      {t.date}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-400 bg-gray-50 rounded-lg">
                  Nenhum compromisso agendado para hoje.
                </div>
              )}
            </div>
          </div>

          {/* 3. Investment x Profit Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-chic font-bold text-gray-900">
                  Investimento x Lucro por Categoria
                </h3>
                <p className="text-xs text-gray-500">
                  Retorno de lucro esperado versus custo investido
                </p>
              </div>
              <span className="p-1.5 rounded-lg bg-[#F5E6E8] text-[#722F37]">
                <Layers className="w-4 h-4" />
              </span>
            </div>

            <div className="h-56 w-full">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip 
                      formatter={(val: number) => formatCurrency(val)} 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
                    />
                    <Bar dataKey="invested" name="Investido (Custo)" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="potentialProfit" name="Lucro Projetado" fill="#722F37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Sem dados para exibição de gráfico
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right 1 Column: Quick Margin Calculator + Dica do Ateliê + Low Stock */}
        <section className="space-y-6">
          {/* Quick Margin Calculator matching the Professional Polish HTML element */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 flex flex-col shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 font-serif-chic text-lg">
                Calculadora de Margem
              </h3>
              <span className="text-[10px] font-bold uppercase text-[#722F37] bg-[#F5E6E8] px-2 py-0.5 rounded">
                Rápida
              </span>
            </div>

            <div className="space-y-3.5 text-sm">
              <div>
                <label className="block text-gray-500 text-xs font-semibold mb-1">
                  Valor Pago (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    value={quickCost}
                    onChange={(e) => setQuickCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full border-gray-200 border rounded-lg pl-9 pr-3 py-2 bg-gray-50 focus:bg-white focus:border-[#722F37] focus:outline-none text-sm font-semibold text-gray-800" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-500 text-xs font-semibold">
                    Margem Desejada (%)
                  </label>
                  <span className="text-xs font-bold text-[#722F37]">{quickMargin}%</span>
                </div>
                <input 
                  type="range"
                  min="30"
                  max="300"
                  step="5"
                  value={quickMargin}
                  onChange={(e) => setQuickMargin(parseInt(e.target.value, 10))}
                  className="w-full accent-[#722F37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <button type="button" onClick={() => setQuickMargin(80)} className="hover:text-gray-800">80%</button>
                  <button type="button" onClick={() => setQuickMargin(100)} className="hover:text-gray-800">100% (2x)</button>
                  <button type="button" onClick={() => setQuickMargin(120)} className="hover:text-gray-800">120%</button>
                  <button type="button" onClick={() => setQuickMargin(150)} className="hover:text-gray-800">150% (2.5x)</button>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-gray-200">
                <p className="text-gray-400 text-xs uppercase font-semibold">
                  Sugestão de Venda
                </p>
                <p className="text-3xl font-bold text-[#722F37] font-serif-chic mt-0.5">
                  {formatCurrency(quickSuggestedSelling)}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Lucro estimado: +{formatCurrency(Math.max(0, quickSuggestedSelling - quickCostNum))} por peça
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setActiveTab('register')}
                className="w-full bg-[#722F37] hover:bg-[#581C26] text-white py-2.5 rounded-lg font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar com este valor</span>
              </button>
            </div>

            {/* Dica do Ateliê card */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                  💡 Dica do Ateliê
                </p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Mantenha seu estoque atualizado diariamente para um cálculo de lucro real e controle de arara preciso.
                </p>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {lowStockItems.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                    Peças com Estoque Baixo ({lowStockItems.length})
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab('spreadsheet')}
                  className="text-xs text-[#722F37] font-semibold hover:underline"
                >
                  Ver
                </button>
              </div>

              <div className="space-y-2">
                {lowStockItems.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                    <div className="truncate mr-2">
                      <span className="font-semibold text-gray-800 truncate block">{p.name}</span>
                      <span className="text-[10px] text-gray-500">{p.code}</span>
                    </div>
                    <span className="font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] shrink-0">
                      {p.quantity} un
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
