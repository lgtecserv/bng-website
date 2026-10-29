import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { ActivePage } from './Header';

interface CookieBannerProps {
  onNavigate: (page: ActivePage) => void;
}

const STORAGE_KEY = 'bng_cookie_consent_v1';

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Exibe com um ligeiro atraso para transição suave
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'all');
    } catch {}
    setVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'essential');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      role="dialog"
      aria-label="Consentimento de Cookies e Privacidade"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-fade-in"
    >
      <div className="bg-[#12161A]/95 backdrop-blur-xl border border-white/15 text-white p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5 text-[#C89B3C]">
            <div className="w-8 h-8 rounded-xl bg-[#C89B3C]/15 flex items-center justify-center">
              <Cookie className="w-4 h-4 text-[#C89B3C]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                Transparência & Privacidade
              </h3>
              <p className="text-[10px] text-slate-400">Grupo BNG Moçambique</p>
            </div>
          </div>

          <button
            onClick={handleAcceptEssential}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
            aria-label="Fechar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-light">
          Utilizamos cookies essenciais e tecnologias seguras para otimizar o carregamento do catálogo de imóveis, manter as suas preferências de sessão e analisar de forma anónima o desempenho do website. Ao continuar ou clicar em <strong>"Aceitar Todos"</strong>, consente a utilização de cookies de acordo com as nossas diretrizes de privacidade.
        </p>

        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <button
              onClick={() => {
                onNavigate('privacidade');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#C89B3C] hover:underline font-semibold"
            >
              Políticas de Privacidade
            </button>
            <span>•</span>
            <button
              onClick={() => {
                onNavigate('termos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-300 hover:text-white transition underline"
            >
              Termos de Uso
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAcceptEssential}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all border border-white/10"
            >
              Apenas Necessários
            </button>

            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-950 text-xs font-black shadow-md hover:opacity-95 transition-all active:scale-95"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
