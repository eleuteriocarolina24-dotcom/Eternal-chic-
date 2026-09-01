import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Calculator, 
  Barcode, 
  Calendar, 
  Table, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { ActiveTab, Product, AgendaTask } from '../types';
import { ButterflyLogo } from './ButterflyLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  products: Product[];
  tasks: AgendaTask[];
  onOpenQuickPOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  products,
  tasks,
  onOpenQuickPOS
}) => {
  const lowStockCount = products.filter(p => p.quantity <= 2).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksToday = tasks.filter(t => !t.completed && t.date === todayStr).length;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'register' as ActiveTab, label: 'Cadastrar Peça', icon: PlusCircle },
    { id: 'catalog' as ActiveTab, label: 'Catálogo', icon: ShoppingBag },
    { id: 'pricing' as ActiveTab, label: 'Calculadora', icon: Calculator },
    { 
      id: 'pos' as ActiveTab, 
      label: 'Dar Baixa / Código', 
      icon: Barcode, 
      highlight: true 
    },
    { 
      id: 'agenda' as ActiveTab, 
      label: 'Agenda da Loja', 
      icon: Calendar,
      badge: pendingTasksToday > 0 ? pendingTasksToday : undefined
    },
    { id: 'spreadsheet' as ActiveTab, label: 'Planilha', icon: Table }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity: Eternal Chic in Wine with Butterfly Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group"
          id="brand-header"
        >
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-br from-[#FAF0F2] via-[#F5E6E8] to-[#EBD3D8] border border-[#722F37]/20 shadow-xs group-hover:shadow-md transition-all">
            <ButterflyLogo size="md" variant="wine" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif-chic font-bold tracking-tight text-[#722F37] leading-none">
                Eternal Chic
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#722F37]/10 text-[#722F37] border border-[#722F37]/20 tracking-wider uppercase">
                Moda & Ateliê
              </span>
            </div>
            <p className="text-xs text-stone-500 font-sans-chic font-medium tracking-wide">
              Gestão de Estoque, Catálogo & Vendas
            </p>
          </div>
        </div>

        {/* Quick Actions & Stock Indicators */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          {lowStockCount > 0 && (
            <button
              onClick={() => setActiveTab('spreadsheet')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors"
              title={`${lowStockCount} peças com estoque baixo`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{lowStockCount} item{lowStockCount > 1 ? 's' : ''} em baixa</span>
            </button>
          )}

          <button
            onClick={onOpenQuickPOS}
            id="btn-quick-sale-scanner"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full bg-[#722F37] hover:bg-[#581C26] text-white shadow-sm hover:shadow transition-all active:scale-98"
          >
            <Barcode className="w-4 h-4 text-amber-300" />
            <span>Ler Código / Vender</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-stone-100 bg-[#FAF7F5]/80">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-150
                    ${isActive 
                      ? 'bg-[#722F37] text-white shadow-xs font-semibold' 
                      : 'text-stone-600 hover:text-[#722F37] hover:bg-stone-200/60'
                    }
                    ${item.highlight && !isActive ? 'ring-1 ring-[#722F37]/30 bg-[#722F37]/5 text-[#722F37]' : ''}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500 group-hover:text-[#722F37]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-amber-400 text-stone-900' : 'bg-[#722F37] text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
