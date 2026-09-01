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
  RefreshCw,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { Product } from '../types';
import { FASHION_PHOTO_PRESETS } from '../data/initialData';
import { optimizeImageFile, DEFAULT_PHOTO_PLACEHOLDER, isValidImageUrl } from '../utils/imageOptimizer';

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
  const [photo, setPhoto] = useState(DEFAULT_PHOTO_PLACEHOLDER);
  const [category, setCategory] = useState('Vestidos');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  
  // Photo states & modes
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'camera' | 'url' | 'presets'>('upload');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [showPresets, setShowPresets] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or update when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCode(editingProduct.code);
      setQuantity(editingProduct.quantity);
      setCostPrice(editingProduct.costPrice);
      setSellingPrice(editingProduct.sellingPrice);
      setPhoto(editingProduct.photo || DEFAULT_PHOTO_PLACEHOLDER);
      setCategory(editingProduct.category || 'Vestidos');
      setSize(editingProduct.size || 'M');
      setColor(editingProduct.color || '');
      setDescription(editingProduct.description || '');
      setPhotoError(null);
      setFormError(null);
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
    setPhoto(DEFAULT_PHOTO_PLACEHOLDER);
    setCategory('Vestidos');
    setSize('M');
    setColor('');
    setDescription('');
    setPhotoUrlInput('');
    setPhotoError(null);
    setFormError(null);
  };

  // Real-time profit calculations
  const cost = Number(costPrice) || 0;
  const selling = Number(sellingPrice) || 0;
  const unitProfit = selling - cost;
  const profitMargin = cost > 0 ? ((unitProfit / cost) * 100).toFixed(1) : '0';
  const totalStockInvestment = cost * (Number(quantity) || 0);
  const totalStockProfit = unitProfit * (Number(quantity) || 0);

  // Safe file processing with automatic compression
  const processImageFile = async (file: File) => {
    if (!file) return;

    // Check if it is an image
    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp)$/i)) {
      setPhotoError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoError(null);

    try {
      // Compress and scale to high quality ~1200px
      const optimizedDataUrl = await optimizeImageFile(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.84,
        format: 'image/jpeg'
      });

      setPhoto(optimizedDataUrl);
      setPhotoError(null);
    } catch (err: any) {
      console.error('Error processing photo:', err);
      setPhotoError(
        err?.message || 'Não foi possível processar esta foto. Tente outro arquivo ou tire uma foto com a câmera.'
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Handle local image file upload from input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input so same file can be selected again
    e.target.value = '';
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle URL apply
  const handleApplyUrl = () => {
    const trimmed = photoUrlInput.trim();
    if (!trimmed) {
      setPhotoError('Digite ou cole a URL da imagem.');
      return;
    }

    if (!isValidImageUrl(trimmed)) {
      setPhotoError('A URL precisa começar com http:// ou https://');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoError(null);

    // Test load the image URL
    const testImg = new Image();
    testImg.onload = () => {
      setPhoto(trimmed);
      setPhotoUrlInput('');
      setIsProcessingPhoto(false);
      setPhotoError(null);
    };
    testImg.onerror = () => {
      setIsProcessingPhoto(false);
      setPhotoError('Não foi possível carregar a imagem deste link. Verifique se o link é público.');
    };
    testImg.src = trimmed;
  };

  // Camera capture functionality (WebRTC / Desktop)
  const startCamera = async () => {
    setPhotoError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      // If WebRTC is blocked in iframe, trigger mobile camera input fallback!
      if (mobileCameraInputRef.current) {
        mobileCameraInputRef.current.click();
      } else {
        setPhotoError('Acesso à câmera indisponível neste navegador. Use a opção de escolher foto ou tire uma foto com o celular.');
      }
    }
  };

  const capturePhotoFromCamera = () => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 800;
        canvas.height = videoRef.current.videoHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhoto(dataUrl);
          setPhotoError(null);
          stopCamera();
        }
      } catch (err) {
        console.error('Error capturing photo from canvas:', err);
        setPhotoError('Erro ao capturar foto da câmera.');
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
    setFormError(null);

    if (!name.trim()) {
      setFormError('Por favor, informe o nome da peça.');
      return;
    }
    if (!code.trim()) {
      setFormError('Por favor, informe o código da peça (SKU).');
      return;
    }
    if (costPrice === '' || Number(costPrice) < 0) {
      setFormError('Por favor, informe o valor de custo que você pagou pela peça.');
      return;
    }
    if (sellingPrice === '' || Number(sellingPrice) < 0) {
      setFormError('Por favor, informe o valor que vai cobrar na venda.');
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      quantity: Math.max(0, Number(quantity) || 1),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      photo: photo || DEFAULT_PHOTO_PLACEHOLDER,
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
            Preencha a foto, nome, código, quantidade, custo e valor de venda para atualizar seu estoque da Eternal Chic.
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

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 bg-emerald-100 p-0.5 rounded-full" />
            <span className="text-sm font-semibold">
              Peça {editingProduct ? 'atualizada' : 'cadastrada'} com sucesso na Eternal Chic!
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

      {/* Form Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-sm font-semibold">{formError}</span>
          </div>
          <button 
            onClick={() => setFormError(null)}
            className="text-xs text-rose-700 hover:underline font-semibold"
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  1. Foto da Peça *
                </label>
                {photo && photo !== DEFAULT_PHOTO_PLACEHOLDER && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(DEFAULT_PHOTO_PLACEHOLDER);
                      setPhotoError(null);
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                    title="Remover foto personalizada"
                  >
                    <Trash2 className="w-3 h-3" /> Restaurar Padrão
                  </button>
                )}
              </div>

              {/* Photo Error Banner */}
              {photoError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Erro ao carregar foto</p>
                    <p className="text-[11px] mt-0.5 text-rose-700">{photoError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoError(null)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Photo Preview Container with Drag & Drop */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative aspect-3/4 rounded-xl overflow-hidden bg-stone-50 border-2 transition-all flex items-center justify-center group ${
                  isDragOver 
                    ? 'border-[#722F37] bg-[#F5E6E8]/40 ring-4 ring-[#722F37]/20 scale-[1.01]' 
                    : 'border-dashed border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* Processing Overlay */}
                {isProcessingPhoto && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                    <Loader2 className="w-8 h-8 text-amber-300 animate-spin mb-2" />
                    <p className="text-xs font-bold">Otimizando imagem...</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Comprimindo para carregamento instantâneo</p>
                  </div>
                )}

                {isCameraActive ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10 px-4">
                      <button
                        type="button"
                        onClick={capturePhotoFromCamera}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" /> Capturar Foto
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-white text-xs font-bold hover:bg-gray-700"
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
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PHOTO_PLACEHOLDER;
                      }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    
                    {/* Hover Overlay with Quick Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <p className="text-white text-xs font-medium mb-1 drop-shadow-sm">Alterar Foto da Peça</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow hover:bg-gray-100 flex items-center gap-1.5"
                          title="Escolher do dispositivo"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#722F37]" />
                          <span>Galeria</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (mobileCameraInputRef.current) {
                              mobileCameraInputRef.current.click();
                            } else {
                              startCamera();
                            }
                          }}
                          className="p-2.5 rounded-lg bg-white text-gray-800 text-xs font-semibold shadow hover:bg-gray-100 flex items-center gap-1.5"
                          title="Tirar nova foto"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#722F37]" />
                          <span>Câmera</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Nenhuma foto selecionada</p>
                    <p className="text-[11px] text-gray-400">Arraste uma foto aqui ou escolha abaixo</p>
                  </div>
                )}
              </div>

              {/* Hidden Native File Inputs */}
              {/* 1. General File & Photo Gallery Picker */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/*" 
                className="hidden" 
              />
              
              {/* 2. Direct Camera Trigger for Mobile Devices */}
              <input 
                type="file" 
                ref={mobileCameraInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                capture="environment"
                className="hidden" 
              />

              {/* Upload Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-[#722F37]" />
                  <span>Subir da Galeria</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Check if mobile user or if we can use native camera input directly
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile && mobileCameraInputRef.current) {
                      mobileCameraInputRef.current.click();
                    } else {
                      startCamera();
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#F5E6E8]/70 border border-[#722F37]/20 text-[#722F37] text-xs font-semibold hover:bg-[#F5E6E8] active:scale-98 transition-all shadow-2xs"
                >
                  <Camera className="w-4 h-4 text-[#722F37]" />
                  <span>Tirar Foto</span>
                </button>
              </div>

              {/* Alternative Modes: Link / Presets */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoInputMode(photoInputMode === 'url' ? 'upload' : 'url');
                      setPhotoError(null);
                    }}
                    className="text-[#722F37] font-medium hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{photoInputMode === 'url' ? 'Ocultar Link' : 'Colar Link de Foto da Web'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-gray-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showPresets ? 'Ocultar Modelos' : 'Modelos Prontos'}</span>
                  </button>
                </div>

                {/* Paste URL Input Box */}
                {photoInputMode === 'url' && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 animate-fadeIn">
                    <label className="block text-[11px] font-semibold text-gray-700">
                      Cole a URL direta da imagem (ex: Google Imagens, Unsplash, Imgur):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://exemplo.com/foto-vestido.jpg"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#722F37] bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        disabled={isProcessingPhoto}
                        className="px-3 py-1.5 bg-[#722F37] text-white text-xs font-semibold rounded hover:bg-[#591C26] transition-colors shrink-0 disabled:opacity-50"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}

                {/* Preset Models Quick Selector */}
                {showPresets && (
                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
                    <p className="text-[11px] font-semibold text-gray-600 mb-2">
                      Clique em um modelo para aplicar a foto:
                    </p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {FASHION_PHOTO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPhoto(preset.url);
                            setPhotoError(null);
                            setShowPresets(false);
                          }}
                          className="group/preset relative aspect-square rounded-lg overflow-hidden border border-gray-300 hover:ring-2 hover:ring-[#722F37] transition-all bg-white"
                          title={preset.label}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.label} 
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PHOTO_PLACEHOLDER;
                            }}
                            className="w-full h-full object-cover" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Helpful tips note */}
              <div className="flex items-start gap-1.5 text-[11px] text-gray-400 bg-gray-50/60 p-2.5 rounded-lg">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  As fotos são otimizadas automaticamente para carregar com alta nitidez sem pesar a memória do aparelho.
                </span>
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
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formError) setFormError(null);
                  }}
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
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        if (formError) setFormError(null);
                      }}
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

              {/* Descrição Adicional */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Detalhes / Observações da Peça (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tecido em linho puro com botões encapados, forro duplo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-[#722F37]"
                />
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
                        onChange={(e) => {
                          setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value));
                          if (formError) setFormError(null);
                        }}
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
                        onChange={(e) => {
                          setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value));
                          if (formError) setFormError(null);
                        }}
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
                  disabled={isProcessingPhoto}
                  className="px-6 py-2.5 rounded-lg bg-[#722F37] hover:bg-[#591C26] text-white text-sm font-semibold shadow-xs hover:shadow transition-all active:scale-98 flex items-center gap-2 disabled:opacity-60"
                >
                  {isProcessingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Processando Foto...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-amber-300" />
                      <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Peça'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
