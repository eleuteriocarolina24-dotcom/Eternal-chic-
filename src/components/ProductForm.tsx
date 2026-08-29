import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Upload, 
  Camera, 
  Sparkles, 
  DollarSign, 
  Tag, 
  Hash, 
  Layers, 
  Check, 
  X, 
  Image as ImageIcon,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { Product } from '../types';
import { FASHION_PHOTO_PRESETS } from '../data/initialData';

interface ProductFormProps {
  onSaveProduct: (product: Product) => void;
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
  onNavigateToCatalog: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSaveProduct,
  editingProduct,
  onCancelEdit,
  onNavigateToCatalog
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [photo, setPhoto] = useState('');
  const [category, setCategory] = useState('Vestidos');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  
  const [showPresets, setShowPresets] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or update when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCode(editingProduct.code);
      setQuantity(editingProduct.quantity);
      setCostPrice(editingProduct.costPrice);
      setSellingPrice(editingProduct.sellingPrice);
      setPhoto(editingProduct.photo);
      setCategory(editingProduct.category || 'Vestidos');
      setSize(editingProduct.size || 'M');
      setColor(editingProduct.color || '');
      setDescription(editingProduct.description || '');
    } else {
      resetForm();
      generateRandomCode();
    }
  }, [editingProduct]);

  const generateRandomCode = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setCode(`ECHIC-${randomNum}`);
  };

  const resetForm = () => {
    setName('');
    generateRandomCode();
    setQuantity(1);
    setCostPrice('');
    setSellingPrice('');
    setPhoto('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80');
    setCategory('Vestidos');
    setSize('M');
    setColor('');
    setDescription('');
  };

  // Real-time profit calculations
  const cost = Number(costPrice) || 0;
  const selling = Number(sellingPrice) || 0;
  const unitProfit = selling - cost;
  const profitMargin = cost > 0 ? ((unitProfit / cost) * 100).toFixed(1) : '0';
  const totalStockInvestment = cost * (Number(quantity) || 0);
  const totalStockProfit = unitProfit * (Number(quantity) || 0);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera capture functionality
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      alert('Não foi possível acessar a câmera. Você pode fazer upload de imagem ou escolher um modelo da galeria.');
    }
  };

  const capturePhotoFromCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe o nome da peça.');
      return;
    }
    if (!code.trim()) {
      alert('Por favor, informe o código da peça.');
      return;
    }
    if (costPrice === '' || Number(costPrice) < 0) {
      alert('Por favor, informe o valor que você pagou (custo).');
      return;
    }
    if (sellingPrice === '' || Number(sellingPrice) < 0) {
      alert('Por favor, informe o valor que vai cobrar (venda).');
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      quantity: Math.max(0, Number(quantity) || 1),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      photo: photo || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      category: category || 'Geral',
      size: size || 'M',
      color: color || '',
      description: description || '',
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveProduct(newProduct);
    setSuccessMessage(true);

    if (!editingProduct) {
      resetForm();
    }

    setTimeout(() => {
      setSuccessMessage(false);
    }, 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              {editingProduct ? 'Editar Peça' : 'Cadastrar Nova Peça'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Preencha a foto, nome, código, quantidade, custo e valor de venda para atualizar seu estoque da Eternal Chique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editingProduct && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3.5 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar Edição
            </button>
          )}
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="px-3.5 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
          >
            Ver Catálogo
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 bg-emerald-100 p-0.5 rounded-full" />
            <span className="text-sm font-semibold">
              Peça {editingProduct ? 'atualizada' : 'cadastrada'} com sucesso na Eternal Chique!
            </span>
          </div>
          <button 
            onClick={() => setSuccessMessage(false)}
            className="text-xs text-emerald-700 hover:underline font-semibold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Photo Upload & Preview (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Foto da Peça *
              </label>

              {/* Photo Preview Container */}
              <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center group">
                {isCameraActive ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={capturePhotoFromCamera}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500"
                      >
                        Capturar Foto
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : photo ? (
                  <>
                    <img 
                      src={photo} 
                      alt="Prévia da peça" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow hover:bg-gray-100"
                        title="Trocar Foto"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="p-2.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow hover:bg-gray-100"
                        title="Usar Câmera"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Nenhuma foto selecionada</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-[#722F37]" />
                  <span>Câmera</span>
                </button>
              </div>

              {/* Preset Models Quick Selector */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="w-full flex items-center justify-between text-xs font-medium text-[#722F37] hover:underline pt-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Escolher da Galeria de Moda Nalú Chic
                  </span>
                  <span>{showPresets ? '▲ Ocultar' : '▼ Ver'}</span>
                </button>

                {showPresets && (
                  <div className="grid grid-cols-5 gap-1.5 mt-2.5 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {FASHION_PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhoto(preset.url);
                          setShowPresets(false);
                        }}
                        className="group/preset relative aspect-square rounded-lg overflow-hidden border border-gray-300 hover:ring-2 hover:ring-[#722F37] transition-all"
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Piece Details & Financials (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                2. Informações da Peça
              </h3>

              {/* Nome da Peça */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nome da Peça *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Vestido Midi Seda Vinho Marsala"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                />
              </div>

              {/* Código & Quantidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Código */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Código / SKU *
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="text-[11px] text-[#722F37] hover:underline flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" /> Gerar código
                    </button>
                  </div>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: ECHIC-108"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-transparent text-sm font-mono uppercase text-gray-800 bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Quantidade */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-transparent text-sm text-gray-800 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Categoria, Tamanho e Cor */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#722F37]"
                  >
                    <option value="Vestidos">Vestidos</option>
                    <option value="Blusas">Blusas</option>
                    <option value="Conjuntos">Conjuntos</option>
                    <option value="Calças">Calças</option>
                    <option value="Saias">Saias</option>
                    <option value="Macacões">Macacões</option>
                    <option value="Casacos/Blazers">Casacos/Blazers</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Tamanho
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#722F37]"
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XG">XG</option>
                    <option value="Único">Único</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Cor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Vinho"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Valores Financeiros: Valor que paguei & Valor que vou cobrar */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  3. Valores Financeiros & Precificação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Valor que paguei */}
                  <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200">
                    <label className="block text-xs font-semibold text-amber-900 mb-1.5">
                      Valor que eu Paguei (Custo R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-700">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-amber-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-amber-800 mt-1">Preço de compra / confecção</p>
                  </div>

                  {/* Valor que vou cobrar */}
                  <div className="bg-[#F5E6E8]/70 p-3.5 rounded-lg border border-[#722F37]/30">
                    <label className="block text-xs font-semibold text-[#722F37] mb-1.5">
                      Valor que vou Cobrar (Venda R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#722F37]">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-[#722F37]/40 text-sm font-bold text-[#722F37] focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                      />
                    </div>
                    <p className="text-[10px] text-[#722F37]/80 mt-1">Preço final na etiqueta</p>
                  </div>
                </div>

                {/* Real-time Profit Preview Card */}
                <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#722F37]" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Lucro por Peça Vendida</p>
                      <p className="text-[11px] text-gray-500">
                        {selling > cost 
                          ? `Margem de retorno de +${profitMargin}%` 
                          : 'Ajuste os valores para visualizar a margem'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-xs text-gray-500 block">Lucro Unitário:</span>
                      <span className={`text-base font-serif-chic font-bold ${unitProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {formatCurrency(unitProfit)}
                      </span>
                    </div>
                    {Number(quantity) > 1 && (
                      <div className="border-l border-gray-300 pl-4">
                        <span className="text-xs text-gray-500 block">Lucro Total do Lote:</span>
                        <span className="text-base font-serif-chic font-bold text-[#722F37]">
                          {formatCurrency(totalStockProfit)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  Limpar Formulário
                </button>
                <button
                  type="submit"
                  id="btn-save-product"
                  className="px-6 py-2.5 rounded-lg bg-[#722F37] hover:bg-[#591C26] text-white text-sm font-semibold shadow-xs hover:shadow transition-all active:scale-98 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Peça'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
