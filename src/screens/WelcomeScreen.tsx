import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="relative min-h-[calc(100vh-45px)] bg-[#121417] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Background Luxury Home Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Moradia de luxo iluminada Grupo BNG"
          className="w-full h-full object-cover object-center brightness-60 scale-105 animate-pulse duration-1000"
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
        />
        {/* Vinheta Superior */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111317] via-[#111317]/80 to-transparent h-[50%]" />
        {/* Vinheta Inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/90 to-transparent top-[30%]" />
      </div>

      {/* Top Header com Marca Oficial */}
      <div className="relative z-10 pt-10 px-6 text-center flex flex-col items-center">
        <img
          src={logoImg}
          onError={(e) => { e.currentTarget.src = './logo.png'; }}
          alt="Grupo BNG — Imobiliária & Negócios"
          className="h-24 sm:h-28 w-auto object-contain mb-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter"
        />
        <h1 className="font-extrabold text-2xl sm:text-3xl tracking-wider text-white">
          GRUPO BNG
        </h1>
        <p className="text-[#C89B3C] text-xs uppercase tracking-[0.25em] font-semibold mt-1">
          Imobiliária &amp; Negócios
        </p>
      </div>

      {/* Conteúdo Central e Chamada */}
      <div className="relative z-10 px-6 max-w-md mx-auto text-center my-auto py-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#E5B95C] text-xs font-medium mb-4 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Líder em Classificados em Moçambique</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-3">
          O seu próximo imóvel <span className="gold-gradient-text">com segurança</span>
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
          Casas de prestígio, apartamentos modernos, terrenos documentados e viaturas seleccionadas com transparência comercial.
        </p>

        {/* Pilares */}
        <div className="grid grid-cols-2 gap-3 text-left mb-8">
          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Moderação Rigorosa</div>
              <div className="text-[10px] text-slate-400">Anúncios verificados</div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-start space-x-2.5">
            <span className="material-symbols-outlined text-[#C89B3C] text-[20px] shrink-0 mt-0.5">payments</span>
            <div>
              <div className="text-xs font-bold text-white">Prestações Claras</div>
              <div className="text-[10px] text-slate-400">Condições transparentes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Ação Inferior */}
      <div className="relative z-10 px-6 pb-12 max-w-md mx-auto w-full">
        <button
          onClick={() => navigateTo('home')}
          className="w-full bg-gradient-to-r from-[#C89B3C] to-[#E5B95C] hover:from-[#B6882C] hover:to-[#C89B3C] text-[#14181B] py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-2xl transition-all transform active:scale-95"
        >
          <span>Explorar Plataforma</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-slate-500 text-[11px] mt-3">
          Mercado Moçambicano • Preços em Meticais (MT)
        </p>
      </div>
    </div>
  );
};
