import React from 'react';
import { Smartphone, Download, QrCode, BellRing, Zap, Shield, Sparkles } from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  return (
    <section id="app-download" className="py-20 bg-[#14181B] text-white relative overflow-hidden border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-900 to-[#1F2429] rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Lado Esquerdo: Descrição e Vantagens */}
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 bg-[#C89B3C]/15 border border-[#C89B3C]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F3C35B] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Experiência Nativa nos Seus Bolsos</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Instale o Aplicativo Oficial <br />
              <span className="gold-gradient-text">BNG Imóvel no seu Celular</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Tenha o mercado imobiliário de Moçambique na palma da sua mão. Seja alertado no mesmo segundo em que um novo terreno ou casa for publicado, com notificações sonoras e navegação fluida.
            </p>

            {/* Lista de Vantagens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C89B3C] shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Notificações em Tempo Real</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Receba avisos instantâneos com som na barra de status.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C89B3C] shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ultra-Rápido & Leve</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Apenas 2.48 MB, sem consumir o armazenamento do seu celular.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C89B3C] shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Seguro & Verificado</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Assinado digitalmente nos esquemas v1, v2 e v3.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C89B3C] shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Contato Direto no WhatsApp</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Conecte-se com consultores em 1 clique sem burocracia.</p>
                </div>
              </div>
            </div>

            {/* Botão de Download */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/BNG_Imovel.apk"
                download="BNG_Imovel.apk"
                className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-extrabold px-8 py-4 rounded-2xl text-sm flex items-center space-x-3 shadow-xl transition-all active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Baixar APK Direto (2.48 MB)</span>
              </a>

              <span className="text-xs text-slate-400 font-light">
                Compatível com Android 5.0 até Android 14
              </span>
            </div>
          </div>

          {/* Lado Direito: Card com QR Code e Celular */}
          <div className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl max-w-sm w-full">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
              {/* QR Code SVG simulado elegante que aponta para o download */}
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                <QrCode className="w-32 h-32 text-[#C89B3C]" />
                <span className="text-[10px] text-slate-300 font-semibold tracking-wider uppercase mt-1">
                  Escanear para Baixar
                </span>
              </div>
            </div>

            <h4 className="text-base font-extrabold text-white">
              Baixe com a Câmara do Celular
            </h4>
            <p className="text-xs text-slate-400 font-light mt-1 max-w-xs">
              Aponte a câmara do seu smartphone para o código acima para instalar o aplicativo oficial instantaneamente.
            </p>

            <a
              href="/BNG_Imovel.apk"
              download="BNG_Imovel.apk"
              className="mt-5 text-xs font-bold text-[#C89B3C] hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ou clique aqui para download manual</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
