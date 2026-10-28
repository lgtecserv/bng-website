import React, { useState, useEffect } from 'react';
import { fetchPlatformConfig } from '../services/supabase';
import { AppUpdateConfig } from '../types';
import { Download, Sparkles, X, ShieldCheck, AlertCircle } from 'lucide-react';

export const AppUpdateModal: React.FC = () => {
  const [updateConfig, setUpdateConfig] = useState<AppUpdateConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const config = await fetchPlatformConfig();
        if (config?.appUpdate?.isUpdateAvailable && config?.appUpdate?.downloadUrl) {
          // Verifica se já foi dispensado nesta sessão caso não seja obrigatório
          const dismissedVersion = sessionStorage.getItem('bng_update_dismissed_version');
          if (!config.appUpdate.isMandatory && dismissedVersion === config.appUpdate.versionName) {
            return;
          }
          setUpdateConfig(config.appUpdate);
          setIsOpen(true);
        }
      } catch (e) {
        console.warn('Erro ao verificar atualização:', e);
      }
    };

    checkUpdate();

    // Listener para atualizações disparadas em tempo real pelo admin
    const handleSync = () => {
      checkUpdate();
    };
    window.addEventListener('bng_notifications_updated', handleSync);
    return () => window.removeEventListener('bng_notifications_updated', handleSync);
  }, []);

  if (!isOpen || !updateConfig) return null;

  const handleDownload = () => {
    if (!updateConfig.downloadUrl) return;
    window.open(updateConfig.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    if (updateConfig.isMandatory) return;
    sessionStorage.setItem('bng_update_dismissed_version', updateConfig.versionName);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#14181B] border border-[#C89B3C]/50 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white space-y-5 relative text-center">
        
        {/* Botão de Fechar caso não seja obrigatório */}
        {!updateConfig.isMandatory && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Emblema Oficial Dourado */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#C89B3C] text-[#14181B] p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center">
          <img
            src="./icon-192.png"
            alt="Grupo BNG"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* Informações da Atualização */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versão {updateConfig.versionName || '1.1.0'} Disponível</span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight">
            {updateConfig.title || 'Nova Versão do BNG Imóvel'}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-normal px-2">
            {updateConfig.message || 
              'Uma nova versão do aplicativo está pronta para download com melhorias de desempenho, novos recursos e avisos instantâneos.'}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Atualização (APK)</span>
          </button>

          {!updateConfig.isMandatory && (
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold transition-colors"
            >
              Lembrar Mais Tarde
            </button>
          )}

          {updateConfig.isMandatory && (
            <p className="text-[10px] text-amber-400 font-bold">
              * Esta atualização é necessária para continuar a aceder ao catálogo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
