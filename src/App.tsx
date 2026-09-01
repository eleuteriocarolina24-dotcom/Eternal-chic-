import React, { useState, useEffect } from 'react';
import { ActiveTab, Product, SaleRecord, AgendaTask } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_TASKS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductForm } from './components/ProductForm';
import { Catalog } from './components/Catalog';
import { PricingCalculator } from './components/PricingCalculator';
import { AgendaCalendar } from './components/AgendaCalendar';
import { SpreadsheetView } from './components/SpreadsheetView';
import { BarcodeScannerPOS } from './components/BarcodeScannerPOS';
import { ButterflyLogo } from './components/ButterflyLogo';
import { PWAInstallModal } from './components/PWAInstallModal';
import { BeforeInstallPromptEvent, isRunningStandalone } from './utils/pwa';
import { Menu, Barcode, PlusCircle, Download, WifiOff } from 'lucide-react';

export default function App() {
  // 1. Products State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_chique_products_v1') || localStorage.getItem('atelie_nalu_products_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load products from storage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Sales State with LocalStorage Persistence
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_chique_sales_v1') || localStorage.getItem('atelie_nalu_sales_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load sales from storage:', e);
    }
    return INITIAL_SALES;
  });

  // 3. Agenda Tasks State with LocalStorage Persistence
  const [tasks, setTasks] = useState<AgendaTask[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_chique_tasks_v1') || localStorage.getItem('atelie_nalu_tasks_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load tasks from storage:', e);
    }
    return INITIAL_TASKS;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'product-form' || tabParam === 'register') return 'register';
      if (tabParam === 'pos') return 'pos';
      if (tabParam === 'catalog') return 'catalog';
      if (tabParam === 'agenda') return 'agenda';
      if (tabParam === 'spreadsheet') return 'spreadsheet';
      if (tabParam === 'pricing') return 'pricing';
    }
    return 'dashboard';
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [posSelectedProduct, setPosSelectedProduct] = useState<Product | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // PWA State & Offline Detection
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isRunningStandalone());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('Eternal Chic PWA was installed successfully');
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('eternal_chique_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('eternal_chique_sales_v1', JSON.stringify(sales));
    } catch (e) {
      console.error('Error saving sales:', e);
    }
  }, [sales]);

  useEffect(() => {
    try {
      localStorage.setItem('eternal_chique_tasks_v1', JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  }, [tasks]);

  // Product CRUD Handlers
  const handleSaveProduct = (savedProduct: Product) => {
    setProducts(prev => {
      const existingIndex = prev.findIndex(p => p.id === savedProduct.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedProduct;
        return updated;
      }
      return [savedProduct, ...prev];
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('register');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleQuickUpdateQuantity = (productId: string, newQty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, quantity: Math.max(0, newQty) };
      }
      return p;
    }));
  };

  // Sale & Stock Discharge Handler
  const handleCompleteSale = (newSale: SaleRecord) => {
    // 1. Add to sales history
    setSales(prev => [newSale, ...prev]);

    // 2. Reduce stock quantity
    setProducts(prev => prev.map(p => {
      if (p.id === newSale.productId || p.code.toUpperCase() === newSale.productCode.toUpperCase()) {
        return {
          ...p,
          quantity: Math.max(0, p.quantity - newSale.quantity)
        };
      }
      return p;
    }));
  };

  const handleRefundSale = (saleId: string) => {
    const saleToRefund = sales.find(s => s.id === saleId);
    if (!saleToRefund) return;

    // Return stock
    setProducts(prev => prev.map(p => {
      if (p.id === saleToRefund.productId || p.code.toUpperCase() === saleToRefund.productCode.toUpperCase()) {
        return {
          ...p,
          quantity: p.quantity + saleToRefund.quantity
        };
      }
      return p;
    }));

    // Remove from sales
    setSales(prev => prev.filter(s => s.id !== saleId));
  };

  // Quick Action to Sell directly from Catalog or Spreadsheet
  const handleStartSaleForProduct = (product: Product) => {
    setPosSelectedProduct(product);
    setActiveTab('pos');
  };

  // Quick Action to trigger POS with a specific Code entered in sidebar
  const handleQuickPosWithCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = products.find(
      p => p.code.toUpperCase() === clean || 
           p.id.toUpperCase() === clean || 
           p.name.toUpperCase().includes(clean)
    );
    if (found) {
      setPosSelectedProduct(found);
    }
    setActiveTab('pos');
  };

  // Apply Calculated Pricing directly into Registration Tab
  const handleApplyPricingToProduct = (cost: number, suggestedSellingPrice: number) => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      code: `ECHIC-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      quantity: 1,
      costPrice: cost,
      sellingPrice: suggestedSellingPrice,
      photo: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      category: 'Vestidos',
      size: 'M',
      color: '',
      description: '',
      createdAt: new Date().toISOString()
    });
    setActiveTab('register');
  };

  // Agenda Task Handlers
  const handleAddTask = (task: AgendaTask) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-row font-sans text-gray-800 selection:bg-[#722F37] selection:text-white">
      {/* Sleek Desktop/Mobile Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        products={products}
        tasks={tasks}
        onOpenQuickPOSWithCode={handleQuickPosWithCode}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Offline Banner when disconnected */}
        {!isOnline && (
          <div className="bg-amber-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>
                <strong>Modo Offline:</strong> Você está sem conexão com a internet. O aplicativo continua funcionando normalmente com os dados salvos neste dispositivo.
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono uppercase font-bold">
              Offline
            </span>
          </div>
        )}

        {/* Mobile Header (visible only on screens < lg) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-1.5 rounded-lg text-gray-700 hover:bg-[#F5E6E8]/60 hover:text-[#722F37] transition-colors focus:outline-none"
              aria-label="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="p-1 rounded-lg bg-[#F5E6E8]/80 border border-[#722F37]/20 shadow-2xs flex items-center justify-center">
                <ButterflyLogo size="sm" variant="wine" />
              </div>
              <span className="font-serif-chic font-bold text-lg text-[#722F37] tracking-tight">
                Eternal Chic
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isStandalone && (
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="p-2 rounded-lg bg-[#F5E6E8]/80 text-[#722F37] hover:bg-[#F5E6E8] transition-colors"
                title="Instalar Aplicativo PWA"
                aria-label="Instalar Aplicativo PWA"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveTab('pos')}
              className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37] hover:bg-[#ebd3d8] transition-colors"
              title="Dar Baixa / PDV"
            >
              <Barcode className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('register');
              }}
              className="p-2 rounded-lg bg-[#722F37] text-white hover:bg-[#581C26] transition-colors"
              title="Nova Peça"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              products={products}
              sales={sales}
              tasks={tasks}
              setActiveTab={setActiveTab}
              onOpenQuickPOS={() => setActiveTab('pos')}
            />
          )}

          {activeTab === 'register' && (
            <ProductForm
              onSaveProduct={handleSaveProduct}
              editingProduct={editingProduct}
              onCancelEdit={() => setEditingProduct(null)}
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />
          )}

          {activeTab === 'catalog' && (
            <Catalog
              products={products}
              onEditProduct={handleEditProduct}
              onSellProduct={handleStartSaleForProduct}
              onNavigateToRegister={() => {
                setEditingProduct(null);
                setActiveTab('register');
              }}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingCalculator
              onApplyToNewProduct={handleApplyPricingToProduct}
            />
          )}

          {activeTab === 'pos' && (
            <BarcodeScannerPOS
              products={products}
              sales={sales}
              onCompleteSale={handleCompleteSale}
              onRefundSale={handleRefundSale}
              preSelectedProduct={posSelectedProduct}
              onClearPreSelected={() => setPosSelectedProduct(null)}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaCalendar
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'spreadsheet' && (
            <SpreadsheetView
              products={products}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onSellProduct={handleStartSaleForProduct}
              onQuickUpdateQuantity={handleQuickUpdateQuantity}
              onNavigateToRegister={() => {
                setEditingProduct(null);
                setActiveTab('register');
              }}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
           <div className="flex items-center gap-2">
            <span className="font-serif-chic font-bold text-[#722F37]">Eternal Chic</span>
            <span>•</span>
            <span>Sistema de Gestão Profissional</span>
          </div>
          <div className="text-gray-400 text-[11px] flex items-center gap-3">
            <span>Estoque • Catálogo • Precificação • Agenda • PDV</span>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-[#722F37] font-semibold hover:underline hidden sm:inline-flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> PWA App
            </button>
          </div>
        </footer>
      </div>

      {/* PWA Install & Help Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => setIsStandalone(true)}
      />
    </div>
  );
}
