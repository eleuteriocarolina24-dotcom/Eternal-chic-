import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare, Wifi, WifiOff, Laptop } from 'lucide-react';
import { ButterflyLogo } from './ButterflyLogo';
import { isRunningStandalone, isIOS, BeforeInstallPromptEvent } from '../utils/pwa';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstallSuccess: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
}) => {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    setIsStandalone(isRunningStandalone());
    setIsIOSDevice(isIOS());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      return;
    }
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        onInstallSuccess();
        onClose();
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
      >
        {/* Header with Wine Background & Logo */}
        <div className="bg-gradient-to-br from-[#8B1E3F] via-[#722F37] to-[#4A0E17] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#F5E6E8] border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-lg">
            <ButterflyLogo size="lg" variant="wine" />
          </div>

          <h3 id="pwa-modal-title" className="font-serif-chic text-2xl font-bold text-white tracking-tight">
            Eternal Chique App
          </h3>
          <p className="text-xs text-stone-200 font-sans mt-1">
            Instale o aplicativo no seu Celular, Tablet ou Computador
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5E6E8]/50 border border-[#722F37]/15">
            <div className="flex items-center gap-2.5">
              {isOnline ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Wifi className="w-3.5 h-3.5" /> Conectado à internet
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <WifiOff className="w-3.5 h-3.5" /> Modo Offline Ativo
                </span>
              )}
            </div>
            {isStandalone && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#722F37] bg-white px-2 py-0.5 rounded-full border border-[#722F37]/20 shadow-2xs">
                <Check className="w-3 h-3" /> Já instalado
              </span>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="space-y-2.5 text-xs text-gray-600">
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-[#722F37]/10 text-[#722F37] mt-0.5 shrink-0">
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <span><strong>Acesso direto pela tela inicial:</strong> Abra sem precisar digitar o link no navegador.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-[#722F37]/10 text-[#722F37] mt-0.5 shrink-0">
                <Laptop className="w-3.5 h-3.5" />
              </span>
              <span><strong>Experiência em tela cheia:</strong> Sem barras de endereço, como um aplicativo nativo.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-[#722F37]/10 text-[#722F37] mt-0.5 shrink-0">
                <Wifi className="w-3.5 h-3.5" />
              </span>
              <span><strong>Funciona Offline:</strong> Acesse seu estoque e catálogo mesmo sem sinal de internet.</span>
            </div>
          </div>

          {/* Installation Instructions / Action */}
          {isStandalone ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Você já está usando o Eternal Chique como aplicativo PWA instalado!
              </p>
            </div>
          ) : deferredPrompt ? (
            <button
              onClick={handleNativeInstall}
              disabled={installing}
              className="w-full py-3 px-4 rounded-xl bg-[#722F37] hover:bg-[#5e262d] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              {installing ? 'Instalando...' : 'Instalar Aplicativo Agora'}
            </button>
          ) : isIOSDevice ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#722F37]" />
                Como instalar no iPhone / iPad (Safari):
              </h4>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside font-medium">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#722F37]">1.</span>
                  <span>Toque no botão de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline text-[#722F37] mx-0.5" /> no menu inferior do Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#722F37]">2.</span>
                  <span>Role a lista e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-[#722F37] mx-0.5" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#722F37]">3.</span>
                  <span>Toque em <strong>Adicionar</strong> no canto superior direito.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-xs text-gray-600">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[#722F37]" />
                Como instalar no Chrome / Edge / Android:
              </h4>
              <p>
                Clique no menu do navegador (ícone de 3 pontinhos no canto superior) e selecione <strong>"Instalar Eternal Chique"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
              Continuar no navegador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
