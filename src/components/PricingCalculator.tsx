import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  CreditCard, 
  Package, 
  HelpCircle,
  PlusCircle
} from 'lucide-react';

interface PricingCalculatorProps {
  onApplyToNewProduct: (cost: number, price: number) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  onApplyToNewProduct
}) => {
  const [costPrice, setCostPrice] = useState<number | ''>(50);
  const [desiredMarginPercent, setDesiredMarginPercent] = useState<number>(120); // 120% markup default
  const [packagingCost, setPackagingCost] = useState<number>(3.50); // sacola, tag, seda
  const [cardFeePercent, setCardFeePercent] = useState<number>(3.99); // taxa maquininha média
  const [fixedOverheadPercent, setFixedOverheadPercent] = useState<number>(5.00); // energia, ateliê
  const [roundToEnding, setRoundToEnding] = useState<'.90' | '.00' | 'exact'>('.90');

  const cost = Number(costPrice) || 0;

  // Calculation formulas
  // 1. Direct Base Markup Price
  const basePriceBeforeFees = (cost + packagingCost) * (1 + desiredMarginPercent / 100);
  
  // 2. Adjust for card fees and overhead deductions: Price = Base / (1 - fees%)
  const totalDeductionsPercent = (cardFeePercent + fixedOverheadPercent) / 100;
  let finalCalculatedPrice = totalDeductionsPercent < 1 
    ? basePriceBeforeFees / (1 - totalDeductionsPercent)
    : basePriceBeforeFees * 1.1;

  // Apply rounding preference
  if (roundToEnding === '.90') {
    finalCalculatedPrice = Math.floor(finalCalculatedPrice) + 0.90;
  } else if (roundToEnding === '.00') {
    finalCalculatedPrice = Math.round(finalCalculatedPrice);
  }

  // Financial Breakdown with Final Price
  const estimatedCardFee = finalCalculatedPrice * (cardFeePercent / 100);
  const estimatedOverhead = finalCalculatedPrice * (fixedOverheadPercent / 100);
  const totalCostWithExpenses = cost + packagingCost + estimatedCardFee + estimatedOverhead;
  const netProfit = Math.max(0, finalCalculatedPrice - totalCostWithExpenses);
  const realNetMarginPercent = finalCalculatedPrice > 0 ? (netProfit / finalCalculatedPrice) * 100 : 0;
  const markupMultiplier = cost > 0 ? (finalCalculatedPrice / cost).toFixed(2) : '0';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const presetMargins = [
    { label: 'Padrão (100% / 2.0x)', margin: 100 },
    { label: 'Recomendado (120% / 2.2x)', margin: 120 },
    { label: 'Boutique (150% / 2.5x)', margin: 150 },
    { label: 'Exclusivo (200% / 3.0x)', margin: 200 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              Calculadora de Precificação Nalú Chic
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Digite o valor que você pagou na peça e nós calculamos o preço de venda ideal com margem de lucro segura.
          </p>
        </div>

        <button
          onClick={() => onApplyToNewProduct(cost, Number(finalCalculatedPrice.toFixed(2)))}
          disabled={cost <= 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#722F37] hover:bg-[#581C26] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>Usar no Cadastro de Peça</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Cost & Parameter Inputs (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          {/* 1. Main Cost Input */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>1. Quanto você pagou na peça?</span>
              <span className="text-amber-700 text-[11px] font-semibold">Custo Base</span>
            </h3>

            <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200">
              <label className="block text-xs font-semibold text-amber-950 mb-1.5">
                Valor que eu paguei (Custo de Compra / Confecção) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-800">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-amber-300 text-xl font-serif-chic font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Margem de Lucro Desejada */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#722F37]" />
                  Margem de Lucro Desejada
                </label>
                <span className="text-sm font-bold text-[#722F37] bg-[#F5E6E8] px-2.5 py-0.5 rounded-md border border-[#722F37]/20">
                  +{desiredMarginPercent}%
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presetMargins.map((p) => (
                  <button
                    key={p.margin}
                    type="button"
                    onClick={() => setDesiredMarginPercent(p.margin)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-lg border transition-all text-center ${
                      desiredMarginPercent === p.margin
                        ? 'bg-[#722F37] text-white border-[#722F37] shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {p.margin}%
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min="30"
                max="300"
                step="5"
                value={desiredMarginPercent}
                onChange={(e) => setDesiredMarginPercent(parseInt(e.target.value, 10))}
                className="w-full accent-[#722F37] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Optional Retail Expenses (Packaging, Card Fees, Overhead) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              2. Custos Adicionais da Loja (Embalagem & Taxas)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Embalagem & Tag */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-500" />
                  Embalagem / Sacola / Tag (R$)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* Taxa da Maquininha */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                  Taxa Cartão Média (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={cardFeePercent}
                  onChange={(e) => setCardFeePercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Arredondamento do Preço */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Formato do Final do Preço
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rounding"
                    checked={roundToEnding === '.90'}
                    onChange={() => setRoundToEnding('.90')}
                    className="accent-[#722F37]"
                  />
                  <span>Final <strong>,90</strong> (ex: R$ 149,90)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rounding"
                    checked={roundToEnding === '.00'}
                    onChange={() => setRoundToEnding('.00')}
                    className="accent-[#722F37]"
                  />
                  <span>Final <strong>Redondo</strong> (ex: R$ 150,00)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Final Price & Result Card (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#722F37] via-[#5C1A25] to-[#420E17] text-white p-6 rounded-xl shadow-xs border border-[#8C3A44]/40 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-200">
                Resultado da Precificação
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-gray-900">
                Markup {markupMultiplier}x
              </span>
            </div>

            {/* Suggested Price Highlight */}
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-xs border border-white/15 text-center space-y-1">
              <span className="text-xs text-stone-200 block font-medium">
                Valor Final Sugerido para a Etiqueta
              </span>
              <span className="text-4xl sm:text-5xl font-serif-chic font-bold text-amber-300 block tracking-tight">
                {formatCurrency(finalCalculatedPrice)}
              </span>
              <span className="text-[11px] text-stone-300 block">
                Preço ideal de venda na Eternal Chique
              </span>
            </div>

            {/* Financial Breakdown Items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-stone-300">Valor que você pagou:</span>
                <span className="font-semibold text-white">{formatCurrency(cost)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-stone-300">Embalagem + Taxa Cartão:</span>
                <span className="font-semibold text-stone-200">
                  {formatCurrency(packagingCost + estimatedCardFee + estimatedOverhead)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-sm bg-white/15 px-3 rounded-lg font-bold">
                <span className="text-amber-200">Seu Lucro Líquido Real:</span>
                <span className="text-emerald-300 text-base font-serif-chic">
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>

            {/* Action button inside result card */}
            <button
              onClick={() => onApplyToNewProduct(cost, Number(finalCalculatedPrice.toFixed(2)))}
              disabled={cost <= 0}
              className="w-full py-3 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:bg-gray-400 text-gray-950 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Cadastrar Peça com este Valor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing Strategy Scenarios */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Cenários de Venda da Peça
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800 block">À Vista / Pix (10% desc.)</span>
                  <span className="text-[10px] text-gray-500">Lucro de {formatCurrency(Math.max(0, (finalCalculatedPrice * 0.9) - cost - packagingCost))}</span>
                </div>
                <span className="font-serif-chic font-bold text-sm text-gray-900">
                  {formatCurrency(finalCalculatedPrice * 0.9)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5E6E8]/60 border border-[#722F37]/20">
                <div>
                  <span className="font-semibold text-[#722F37] block">Preço de Tabela (Normal)</span>
                  <span className="text-[10px] text-gray-500">Lucro pleno na Eternal Chique</span>
                </div>
                <span className="font-serif-chic font-bold text-sm text-[#722F37]">
                  {formatCurrency(finalCalculatedPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-800 block">Parcelado em até 3x</span>
                  <span className="text-[10px] text-gray-500">3x de {formatCurrency(finalCalculatedPrice / 3)} sem juros</span>
                </div>
                <span className="font-serif-chic font-bold text-sm text-gray-900">
                  {formatCurrency(finalCalculatedPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
