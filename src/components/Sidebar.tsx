import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Calculator, 
  Barcode, 
  Calendar, 
  Table, 
  AlertTriangle,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  CheckCircle2,
  Download
} from 'lucide-react';
import { ActiveTab, Product, AgendaTask } from '../types';
import { ButterflyLogo } from './ButterflyLogo';
import { isRunningStandalone } from '../utils/pwa';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  products: Product[];
  tasks: AgendaTask[];
  onOpenQuickPOSWithCode?: (code: string) => void;
  onOpenInstallModal?: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  products,
  tasks,
  onOpenQuickPOSWithCode,
  onOpenInstallModal,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const [quickCode, setQuickCode] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isRunningStandalone());
  }, []);

  const lowStockCount = products.filter(p => p.quantity <= 2).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksToday = tasks.filter(t => !t.completed && t.date === todayStr).length;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register' as ActiveTab, label: 'Cadastro', icon: PlusCircle },
    { id: 'catalog' as ActiveTab, label: 'Catálogo', icon: ShoppingBag },
    { id: 'pricing' as ActiveTab, label: 'Calculadora', icon: Calculator },
    { 
      id: 'pos' as ActiveTab, 
      label: 'Dar Baixa / PDV', 
      icon: Barcode,
      highlight: true
    },
    { 
      id: 'agenda' as ActiveTab, 
      label: 'Agenda', 
      icon: Calendar,
      badge: pendingTasksToday > 0 ? pendingTasksToday : undefined
    },
    { id: 'spreadsheet' as ActiveTab, label: 'Planilha', icon: Table }
  ];

  const handleQuickCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    if (onOpenQuickPOSWithCode) {
      onOpenQuickPOSWithCode(quickCode.trim());
    } else {
      setActiveTab('pos');
    }
    setQuickCode('');
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-gray-800 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => {
          setActiveTab('dashboard');
          setIsMobileOpen(false);
        }}
        className="p-6 pb-4 flex items-center gap-3 cursor-pointer border-b border-gray-100"
        id="sidebar-brand-header"
      >
        <div className="p-1.5 rounded-xl bg-[#F5E6E8]/70 border border-[#722F37]/15">
          <ButterflyLogo size="sm" variant="wine" />
        </div>
        <div>
          <h1 className="text-[#722F37] font-serif-chic font-bold text-xl tracking-tight leading-none">
            Eternal Chique
          </h1>
          <p className="text-[11px] text-gray-400 font-sans mt-0.5 font-medium tracking-wide">
            Moda & Ateliê
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Menu Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive 
                  ? 'bg-[#F5E6E8] text-[#722F37] font-semibold shadow-2xs' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#722F37]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-[#722F37] text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Low Stock Warning Pill in Sidebar */}
        {lowStockCount > 0 && (
          <button
            onClick={() => {
              setActiveTab('spreadsheet');
              setIsMobileOpen(false);
            }}
            className="w-full mt-3 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{lowStockCount} peças em baixa</span>
          </button>
        )}
      </nav>

      {/* Bottom Actions: PWA Install + Baixa Rápida Card */}
      <div className="p-4 mt-auto border-t border-gray-100 bg-white space-y-3">
        {/* PWA App Install Button */}
        {onOpenInstallModal && (
          <button
            onClick={() => {
              onOpenInstallModal();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#F5E6E8]/70 hover:bg-[#F5E6E8] border border-[#722F37]/20 text-[#722F37] transition-all group shadow-2xs text-left"
            title="Instalar aplicativo no celular ou PC"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-white text-[#722F37] shadow-2xs group-hover:scale-105 transition-transform">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-serif-chic leading-tight">
                  {isStandalone ? 'App Instalado' : 'Instalar App (PWA)'}
                </span>
                <span className="text-[10px] text-gray-500 font-sans leading-tight">
                  {isStandalone ? 'Modo standalone ativo' : 'Acesso direto e offline'}
                </span>
              </div>
            </div>
            {isStandalone ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#722F37] group-hover:translate-y-0.5 transition-transform shrink-0" />
            )}
          </button>
        )}

        {/* Baixa Rápida Card matching Professional Polish theme */}
        <div className="bg-[#722F37] p-3.5 rounded-xl text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-amber-300" />
              Baixa rápida
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-200/80 bg-white/10 px-1.5 py-0.5 rounded">
              PDV
            </span>
          </div>
          <form onSubmit={handleQuickCodeSubmit} className="mt-2.5 flex gap-1.5">
            <input
              type="text"
              placeholder="Código (ex: ECHIC-101)..."
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              className="w-full bg-white/15 border border-white/25 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 outline-none font-mono uppercase"
            />
            <button
              type="submit"
              className="bg-white hover:bg-stone-100 text-[#722F37] px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
            >
              OK
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, fixed width on lg+) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col shadow-xs shrink-0 sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="absolute top-4 right-3">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
