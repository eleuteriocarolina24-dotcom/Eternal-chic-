import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Barcode, 
  Edit3, 
  Share2, 
  Check, 
  Plus, 
  Sparkles,
  Eye,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { Product } from '../types';
import { DEFAULT_PHOTO_PLACEHOLDER } from '../utils/imageOptimizer';

interface CatalogProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onSellProduct: (product: Product) => void;
  onNavigateToRegister: () => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  onEditProduct,
  onSellProduct,
  onNavigateToRegister
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name' | 'stock'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImageModal, setSelectedImageModal] = useState<Product | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category || 'Geral')))];

  // Filter & Sort
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = product.quantity > 0;
    else if (stockFilter === 'low_stock') matchesStock = product.quantity > 0 && product.quantity <= 2;
    else if (stockFilter === 'out_of_stock') matchesStock = product.quantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return b.quantity - a.quantity;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleShareWhatsApp = (product: Product) => {
    const text = `🌸 *Eternal Chic* 🌸\n\n✨ *${product.name}*\n🏷️ *Código:* ${product.code}\n${product.size ? `📏 *Tamanho:* ${product.size}\n` : ''}${product.color ? `🎨 *Cor:* ${product.color}\n` : ''}💰 *Valor:* ${formatCurrency(product.sellingPrice)}\n\n_Entre em contato para garantir a sua peça exclusiva!_`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              Catálogo de Fotos & Vitrine
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Galeria visual de todas as peças cadastradas na Eternal Chic com valores de venda e estoque.
          </p>
        </div>

        <button
          onClick={onNavigateToRegister}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#722F37] hover:bg-[#581C26] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Cadastrar Nova Peça</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, código (ex: ECHIC-101) ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37] bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Stock Filter */}
          <div className="sm:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#722F37]"
            >
              <option value="all">Todos os estoques</option>
              <option value="in_stock">Em Estoque (&gt; 0)</option>
              <option value="low_stock">Estoque Baixo (1 ou 2)</option>
              <option value="out_of_stock">Esgotados (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#722F37]"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Preço: Menor ao Maior</option>
                <option value="price_desc">Preço: Maior ao Menor</option>
                <option value="name">Nome (A - Z)</option>
                <option value="stock">Maior Quantidade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#722F37] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Todas as Categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Gallery */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.quantity === 0;
            const isLowStock = product.quantity > 0 && product.quantity <= 2;
            const isCopied = copiedId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#722F37]/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
                    <img
                      src={product.photo}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PHOTO_PLACEHOLDER;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-xs">
                          Esgotado
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                          Últimas {product.quantity} un!
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-700/90 text-white backdrop-blur-xs shadow-xs">
                          {product.quantity} disponíveis
                        </span>
                      )}
                    </div>

                    {/* Code Tag Top Right */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs tracking-wider">
                        {product.code}
                      </span>
                    </div>

                    {/* Hover Quick View Button */}
                    <button
                      onClick={() => setSelectedImageModal(product)}
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/90 text-gray-800 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      title="Ver imagem ampliada"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="font-medium text-[#722F37] uppercase tracking-wider">{product.category}</span>
                      {product.size && <span>Tam: <strong>{product.size}</strong></span>}
                    </div>

                    <h3 className="font-serif-chic font-bold text-base text-gray-900 line-clamp-1 group-hover:text-[#722F37] transition-colors">
                      {product.name}
                    </h3>

                    {/* Pricing Display */}
                    <div className="pt-1 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-semibold">Valor de Venda</span>
                        <span className="text-xl font-serif-chic font-bold text-[#722F37]">
                          {formatCurrency(product.sellingPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Custo Pago</span>
                        <span className="text-xs font-semibold text-gray-500">
                          {formatCurrency(product.costPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 border-t border-gray-100 mt-2 grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onSellProduct(product)}
                    disabled={isOutOfStock}
                    className={`col-span-2 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#722F37] hover:bg-[#581C26] text-white shadow-xs active:scale-98'
                    }`}
                    title="Vender esta peça no PDV"
                  >
                    <Barcode className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dar Baixa</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShareWhatsApp(product)}
                      className="p-2 flex-1 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                      title={isCopied ? 'Copiado!' : 'Copiar texto para WhatsApp'}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 flex-1 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#722F37] transition-colors"
                      title="Editar peça"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200/80 space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-serif-chic font-bold text-gray-800">
            Nenhuma peça encontrada
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Não encontramos peças com os filtros aplicados. Tente buscar por outro termo ou cadastre novas peças.
          </p>
          <button
            onClick={onNavigateToRegister}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#722F37] text-white text-xs font-semibold hover:bg-[#581C26] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Peça</span>
          </button>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedImageModal(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-3/4 bg-gray-900">
              <img 
                src={selectedImageModal.photo} 
                alt={selectedImageModal.name} 
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PHOTO_PLACEHOLDER;
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImageModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-500">{selectedImageModal.code}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                  {selectedImageModal.quantity} em estoque
                </span>
              </div>
              <h3 className="text-xl font-serif-chic font-bold text-gray-900">
                {selectedImageModal.name}
              </h3>
              <p className="text-xs text-gray-600">
                {selectedImageModal.description || 'Peça exclusiva Eternal Chic.'}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <span className="text-2xl font-serif-chic font-bold text-[#722F37]">
                  {formatCurrency(selectedImageModal.sellingPrice)}
                </span>
                <button
                  onClick={() => {
                    const item = selectedImageModal;
                    setSelectedImageModal(null);
                    onSellProduct(item);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#722F37] text-white text-xs font-bold hover:bg-[#581C26]"
                >
                  Dar Baixa / Vender
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
