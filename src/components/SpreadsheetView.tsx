import React, { useState } from 'react';
import { 
  Table, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Barcode, 
  Edit3, 
  Trash2, 
  Plus, 
  Sparkles,
  ArrowUpDown,
  Check,
  Package
} from 'lucide-react';
import { Product } from '../types';

interface SpreadsheetViewProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSellProduct: (product: Product) => void;
  onQuickUpdateQuantity: (productId: string, newQty: number) => void;
  onNavigateToRegister: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
  onSellProduct,
  onQuickUpdateQuantity,
  onNavigateToRegister
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Product | 'unitProfit' | 'totalInvested' | 'totalProfit'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineQty, setInlineQty] = useState<number>(0);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category || 'Geral')))];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort items
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.color && p.color.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    let valA: any = a[sortField as keyof Product];
    let valB: any = b[sortField as keyof Product];

    if (sortField === 'unitProfit') {
      valA = a.sellingPrice - a.costPrice;
      valB = b.sellingPrice - b.costPrice;
    } else if (sortField === 'totalInvested') {
      valA = a.costPrice * a.quantity;
      valB = b.costPrice * b.quantity;
    } else if (sortField === 'totalProfit') {
      valA = (a.sellingPrice - a.costPrice) * a.quantity;
      valB = (b.sellingPrice - b.costPrice) * b.quantity;
    }

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
  });

  // Calculate Column Totals
  const totalPieces = filteredProducts.reduce((acc, p) => acc + p.quantity, 0);
  const totalInvestedSum = filteredProducts.reduce((acc, p) => acc + (p.costPrice * p.quantity), 0);
  const totalPotentialGrossSum = filteredProducts.reduce((acc, p) => acc + (p.sellingPrice * p.quantity), 0);
  const totalPotentialProfitSum = totalPotentialGrossSum - totalInvestedSum;

  // Export to CSV / Excel function
  const exportToCSV = () => {
    const headers = [
      'Código',
      'Nome da Peça',
      'Categoria',
      'Tamanho',
      'Cor',
      'Quantidade Estoque',
      'Valor Pago (Custo R$)',
      'Valor Cobrado (Venda R$)',
      'Lucro Unitário (R$)',
      'Margem (%)',
      'Total Investido (R$)',
      'Lucro Total Projetado (R$)'
    ];

    const rows = products.map(p => {
      const unitProfit = p.sellingPrice - p.costPrice;
      const margin = p.costPrice > 0 ? ((unitProfit / p.costPrice) * 100).toFixed(1) : '0';
      const totalInvested = p.costPrice * p.quantity;
      const totalProfit = unitProfit * p.quantity;

      return [
        `"${p.code}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category || ''}"`,
        `"${p.size || ''}"`,
        `"${p.color || ''}"`,
        p.quantity,
        p.costPrice.toFixed(2).replace('.', ','),
        p.sellingPrice.toFixed(2).replace('.', ','),
        unitProfit.toFixed(2).replace('.', ','),
        `"${margin}%"`,
        totalInvested.toFixed(2).replace('.', ','),
        totalProfit.toFixed(2).replace('.', ',')
      ].join(';');
    });

    // Add totals row
    rows.push([
      '"TOTAL GERAL"',
      '""',
      '""',
      '""',
      '""',
      totalPieces,
      '""',
      '""',
      '""',
      '""',
      totalInvestedSum.toFixed(2).replace('.', ','),
      totalPotentialProfitSum.toFixed(2).replace('.', ',')
    ].join(';'));

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Planilha_Estoque_Eternal_Chique_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <Table className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              Planilha Geral de Estoque & Peças
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Visualização completa e tabulada com custo, valor de venda, lucro unitário e total investido da Eternal Chique.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
            title="Exportar dados para Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Baixar Excel / CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Imprimir Planilha</span>
          </button>

          <button
            onClick={onNavigateToRegister}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#722F37] hover:bg-[#581C26] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Nova Peça</span>
          </button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome, código ou cor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#722F37] bg-gray-50/50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-medium">Categoria:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#722F37]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'Todas' : c}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {filteredProducts.length} item{filteredProducts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead className="bg-[#FAF7F5] border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Foto</th>
                <th 
                  onClick={() => handleSort('code')} 
                  className="py-3 px-3 cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Código</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3 px-3 cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Peça</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-2">Tam / Cor</th>
                <th 
                  onClick={() => handleSort('quantity')} 
                  className="py-3 px-3 text-center cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Qtd</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('costPrice')} 
                  className="py-3 px-3 text-right cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor Pago (Custo)</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sellingPrice')} 
                  className="py-3 px-3 text-right cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor Cobrado (Venda)</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('unitProfit')} 
                  className="py-3 px-3 text-right cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lucro Unitário</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('totalInvested')} 
                  className="py-3 px-3 text-right cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Investido</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('totalProfit')} 
                  className="py-3 px-3 text-right cursor-pointer hover:bg-gray-200/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lucro Total</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center no-print w-24">Ações</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const unitProfit = product.sellingPrice - product.costPrice;
                  const totalInvested = product.costPrice * product.quantity;
                  const totalProfit = unitProfit * product.quantity;
                  const isLow = product.quantity <= 2;
                  const isOut = product.quantity === 0;

                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-[#FAF7F5]/70 transition-colors group"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-3 text-center">
                        <img 
                          src={product.photo} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-md object-cover mx-auto border border-gray-200"
                        />
                      </td>

                      {/* Code */}
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">
                          {product.code}
                        </span>
                      </td>

                      {/* Name & Category */}
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400">{product.category}</p>
                      </td>

                      {/* Size & Color */}
                      <td className="py-2.5 px-2 text-[11px] text-gray-500">
                        {product.size && <span className="font-semibold text-gray-700">{product.size}</span>}
                        {product.color && <span> • {product.color}</span>}
                      </td>

                      {/* Quantity with quick editor */}
                      <td className="py-2.5 px-3 text-center">
                        {inlineEditingId === product.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={inlineQty}
                              onChange={(e) => setInlineQty(parseInt(e.target.value, 10) || 0)}
                              className="w-12 px-1 py-0.5 text-center text-xs border border-[#722F37] rounded"
                            />
                            <button
                              onClick={() => {
                                onQuickUpdateQuantity(product.id, inlineQty);
                                setInlineEditingId(null);
                              }}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span 
                            onClick={() => {
                              setInlineEditingId(product.id);
                              setInlineQty(product.quantity);
                            }}
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs cursor-pointer hover:ring-1 hover:ring-gray-400 ${
                              isOut 
                                ? 'bg-rose-100 text-rose-800' 
                                : isLow 
                                  ? 'bg-amber-100 text-amber-900' 
                                  : 'bg-emerald-100 text-emerald-900'
                            }`}
                            title="Clique para alterar a quantidade"
                          >
                            {product.quantity}
                          </span>
                        )}
                      </td>

                      {/* Valor que Pagou (Custo) */}
                      <td className="py-2.5 px-3 text-right font-medium text-gray-600">
                        {formatCurrency(product.costPrice)}
                      </td>

                      {/* Valor que vai Cobrar (Venda) */}
                      <td className="py-2.5 px-3 text-right font-bold text-[#722F37] font-serif-chic text-sm">
                        {formatCurrency(product.sellingPrice)}
                      </td>

                      {/* Lucro Unitário */}
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-semibold ${unitProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatCurrency(unitProfit)}
                        </span>
                      </td>

                      {/* Total Investido */}
                      <td className="py-2.5 px-3 text-right font-medium text-gray-800">
                        {formatCurrency(totalInvested)}
                      </td>

                      {/* Lucro Total Projetado */}
                      <td className="py-2.5 px-3 text-right font-bold text-[#722F37] font-serif-chic text-sm">
                        {formatCurrency(totalProfit)}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSellProduct(product)}
                            disabled={isOut}
                            className="p-1.5 rounded-lg text-amber-800 bg-amber-100 hover:bg-amber-200 disabled:opacity-30 disabled:hover:bg-amber-100 transition-colors"
                            title="Dar Baixa / Vender"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                            title="Editar peça"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir ${product.name}?`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                            title="Excluir peça"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    Nenhuma peça encontrada na planilha.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Totals Summary Footer */}
            <tfoot className="bg-[#F5E6E8]/70 font-bold text-gray-900 border-t-2 border-[#722F37]/30 text-xs">
              <tr>
                <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-[#722F37]">
                  TOTAIS GERAIS ETERNAL CHIQUE:
                </td>
                <td className="py-3 px-3 text-center text-sm font-bold text-gray-900">
                  {totalPieces} un
                </td>
                <td className="py-3 px-3 text-right text-gray-500">
                  —
                </td>
                <td className="py-3 px-3 text-right text-[#722F37]">
                  —
                </td>
                <td className="py-3 px-3 text-right text-gray-500">
                  —
                </td>
                <td className="py-3 px-3 text-right text-gray-900 font-serif-chic text-sm font-bold">
                  {formatCurrency(totalInvestedSum)}
                </td>
                <td className="py-3 px-3 text-right text-[#722F37] font-serif-chic text-base font-bold">
                  {formatCurrency(totalPotentialProfitSum)}
                </td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
