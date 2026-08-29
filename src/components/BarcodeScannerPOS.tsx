import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  Search, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  CheckCircle2,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, SaleRecord } from '../types';

interface BarcodeScannerPOSProps {
  products: Product[];
  sales: SaleRecord[];
  onCompleteSale: (sale: SaleRecord) => void;
  onRefundSale: (saleId: string) => void;
  preSelectedProduct?: Product | null;
  onClearPreSelected?: () => void;
}

export const BarcodeScannerPOS: React.FC<BarcodeScannerPOSProps> = ({
  products,
  sales,
  onCompleteSale,
  onRefundSale,
  preSelectedProduct,
  onClearPreSelected
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saleQuantity, setSaleQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<SaleRecord['paymentMethod']>('pix');
  const [customerNotes, setCustomerNotes] = useState('');
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<SaleRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync if opened via "Vender / Dar Baixa" from Catalog/Spreadsheet
  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProduct(preSelectedProduct);
      setCodeInput(preSelectedProduct.code);
      setSaleQuantity(1);
      setCustomPrice(preSelectedProduct.sellingPrice);
      if (onClearPreSelected) onClearPreSelected();
    }
  }, [preSelectedProduct, onClearPreSelected]);

  // Handle barcode/code search
  const handleSearchCode = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    if (!cleanCode) return;

    const found = products.find(
      p => p.code.toUpperCase() === cleanCode || 
           p.id.toUpperCase() === cleanCode ||
           p.name.toUpperCase().includes(cleanCode)
    );

    if (found) {
      setSelectedProduct(found);
      setSaleQuantity(1);
      setCustomPrice(found.sellingPrice);
      setErrorMessage('');
    } else {
      setErrorMessage(`Nenhuma peça encontrada com o código "${codeToSearch}".`);
      setSelectedProduct(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchCode(codeInput);
    }
  };

  // Process the stock discharge / sale
  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      setErrorMessage('Selecione ou leia o código de uma peça primeiro.');
      return;
    }

    if (selectedProduct.quantity < saleQuantity) {
      setErrorMessage(`Estoque insuficiente! Temos apenas ${selectedProduct.quantity} peças deste modelo.`);
      return;
    }

    const unitSelling = customPrice !== '' ? Number(customPrice) : selectedProduct.sellingPrice;
    const totalAmount = unitSelling * saleQuantity;
    const totalCost = selectedProduct.costPrice * saleQuantity;
    const totalProfit = totalAmount - totalCost;

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      productId: selectedProduct.id,
      productCode: selectedProduct.code,
      productName: selectedProduct.name,
      quantity: saleQuantity,
      unitCostPrice: selectedProduct.costPrice,
      unitSellingPrice: unitSelling,
      totalAmount,
      totalCost,
      totalProfit,
      paymentMethod,
      timestamp: new Date().toISOString(),
      notes: customerNotes.trim()
    };

    onCompleteSale(newSale);
    setSaleSuccessMessage(newSale);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#722F37', '#D4AF37', '#E5C158', '#9E2A2B']
      });
    } catch {
      // ignore
    }

    // Reset selection
    setSelectedProduct(null);
    setCodeInput('');
    setSaleQuantity(1);
    setCustomPrice('');
    setCustomerNotes('');
    setErrorMessage('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#722F37] text-amber-300">
              <Barcode className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              Leitor de Código & Baixa de Venda
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Digite o código ou use o leitor de código de barras para localizar a roupa e dar a baixa imediata no estoque da Eternal Chique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            ● Leitor de Código Ativo
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saleSuccessMessage && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 text-emerald-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-emerald-600 text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-emerald-900 font-serif-chic">
                Baixa Realizada com Sucesso! 👗✨
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Venda de <strong>{saleSuccessMessage.quantity}x {saleSuccessMessage.productName}</strong> ({saleSuccessMessage.productCode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/70 px-4 py-2 rounded-lg border border-emerald-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Recebido</span>
              <span className="text-sm font-bold text-emerald-800">
                {formatCurrency(saleSuccessMessage.totalAmount)}
              </span>
            </div>
            <div className="border-l border-emerald-300 pl-4">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Lucro no Bolso</span>
              <span className="text-sm font-bold text-[#722F37]">
                +{formatCurrency(saleSuccessMessage.totalProfit)}
              </span>
            </div>
            <button
              onClick={() => setSaleSuccessMessage(null)}
              className="text-xs text-gray-500 hover:text-gray-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="hover:underline">Fechar</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Barcode Search & Fast POS Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Barcode Search Bar */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Ler ou Digitar Código da Roupa (SKU)
            </label>

            <div className="relative">
              <Barcode className="w-6 h-6 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Escaneie o código de barras ou digite (ex: ECHIC-101) e aperte Enter..."
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-28 py-3.5 rounded-lg border-2 border-gray-300 focus:border-[#722F37] focus:outline-none text-base font-mono uppercase font-semibold text-gray-900 bg-gray-50/50"
              />
              <button
                type="button"
                onClick={() => handleSearchCode(codeInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#722F37] hover:bg-[#581C26] text-white text-xs font-bold rounded-md shadow-xs transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-gray-500 font-medium block mb-1.5">
                Peças em Destaque no Estoque (clique para carregar):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {products.filter(p => p.quantity > 0).slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setCodeInput(p.code);
                      handleSearchCode(p.code);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5 ${
                      selectedProduct?.id === p.id 
                        ? 'bg-[#722F37] text-white border-[#722F37]' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-[#F5E6E8]'
                    }`}
                  >
                    <span className="font-mono font-bold">{p.code}</span>
                    <span className="truncate max-w-[120px]">{p.name}</span>
                    <span className="text-[10px] opacity-75">({p.quantity} un)</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Checkout Form (Appears when piece is found) */}
          {selectedProduct && (
            <form onSubmit={handleConfirmSale} className="bg-white p-6 rounded-xl border-2 border-[#722F37]/40 shadow-xs space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Check className="w-4 h-4" />
                  </span>
                  <h3 className="font-serif-chic font-bold text-lg text-gray-900">
                    Peça Identificada: {selectedProduct.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Limpar
                </button>
              </div>

              {/* Product Info Summary Box */}
              <div className="flex items-center gap-4 p-3.5 rounded-lg bg-[#FAF7F5] border border-gray-200">
                <img
                  src={selectedProduct.photo}
                  alt={selectedProduct.name}
                  className="w-16 h-20 rounded-md object-cover border border-gray-300 shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-gray-200 px-1.5 py-0.5 rounded text-gray-800">
                      {selectedProduct.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {selectedProduct.quantity} em estoque
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">{selectedProduct.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Tam: <strong>{selectedProduct.size || 'M'}</strong></span>
                    {selectedProduct.color && <span>Cor: <strong>{selectedProduct.color}</strong></span>}
                    <span>Custo: {formatCurrency(selectedProduct.costPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Sale Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quantidade Vendida *
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(Math.max(1, saleQuantity - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-300 font-bold text-gray-700 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.quantity}
                      value={saleQuantity}
                      onChange={(e) => setSaleQuantity(Math.min(selectedProduct.quantity, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                      className="w-full text-center py-2 rounded-lg border border-gray-300 font-bold text-base text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(Math.min(selectedProduct.quantity, saleQuantity + 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-300 font-bold text-gray-700 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Valor Cobrado por Peça (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#722F37]">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 font-bold text-[#722F37] text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Forma de Pagamento Recebida
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'pix', label: 'Pix / Dinheiro', icon: QrCode },
                    { id: 'credit', label: 'Cartão Crédito', icon: CreditCard },
                    { id: 'debit', label: 'Cartão Débito', icon: CreditCard },
                    { id: 'cash', label: 'Dinheiro Espécie', icon: DollarSign },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#722F37] text-white border-[#722F37] shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Observações da Venda / Nome da Cliente (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cliente Camila (comprou pelo WhatsApp)"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                />
              </div>

              {/* Real-time calculated totals for this sale */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#722F37]/10 via-[#722F37]/5 to-transparent border border-[#722F37]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-600 block">Total a Receber:</span>
                  <span className="text-2xl font-serif-chic font-bold text-[#722F37]">
                    {formatCurrency((customPrice !== '' ? Number(customPrice) : selectedProduct.sellingPrice) * saleQuantity)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-600 block">Seu Lucro Nesta Venda:</span>
                  <span className="text-xl font-serif-chic font-bold text-emerald-700">
                    +{formatCurrency(((customPrice !== '' ? Number(customPrice) : selectedProduct.sellingPrice) - selectedProduct.costPrice) * saleQuantity)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                id="btn-confirm-pos-sale"
                className="w-full py-3.5 px-4 rounded-lg bg-[#722F37] hover:bg-[#581C26] text-white font-bold text-sm shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 text-amber-300" />
                <span>Confirmar Venda & Dar Baixa no Estoque</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Recent Sales History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F5E6E8] text-[#722F37]">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="font-serif-chic font-bold text-base text-gray-900">
                  Histórico de Baixas & Vendas
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {sales.length} vendas registradas
              </span>
            </div>

            {/* Sales List */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-3.5 rounded-lg bg-gray-50/70 border border-gray-200 hover:border-gray-300 transition-colors flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-gray-200 text-gray-800">
                            {sale.productCode}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(sale.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <h5 className="font-semibold text-xs text-gray-900 mt-1 line-clamp-1">
                          {sale.productName}
                        </h5>
                        <p className="text-[11px] text-gray-500">
                          {sale.quantity}x por {formatCurrency(sale.unitSellingPrice)} • {sale.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900 block">
                          {formatCurrency(sale.totalAmount)}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +{formatCurrency(sale.totalProfit)}
                        </span>
                      </div>
                    </div>

                    {sale.notes && (
                      <p className="text-[10px] text-gray-500 italic bg-white p-1.5 rounded border border-gray-100">
                        {sale.notes}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-end border-t border-gray-200/50">
                      <button
                        onClick={() => {
                          if (confirm(`Deseja estornar esta venda e devolver ${sale.quantity} peça(s) ao estoque?`)) {
                            onRefundSale(sale.id);
                          }
                        }}
                        className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <RotateCcw className="w-3 h-3" /> Estornar Venda
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                  <p>Nenhuma venda registrada ainda.</p>
                  <p className="text-[11px]">Use o leitor acima para dar baixa em suas peças vendidas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
