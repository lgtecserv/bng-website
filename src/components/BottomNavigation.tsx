import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, PlusCircle, Heart, Sparkles } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentScreen, navigateTo, openAiHelp, isAiHelpOpen } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#14181B] border-t border-slate-800 text-slate-400 py-1.5 px-2 z-40 sm:hidden shadow-nav">
      <div className="flex items-center justify-around">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentScreen === 'home' ? 'text-[#C89B3C] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {currentScreen === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C89B3C]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Início</span>
        </button>

        <button
          onClick={() => navigateTo('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentScreen === 'search' ? 'text-[#C89B3C] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Search className="w-5 h-5" />
            {currentScreen === 'search' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C89B3C]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Pesquisar</span>
        </button>

        {/* Atalho Inteligente Oficial "Ajuda" com IA */}
        <button
          onClick={openAiHelp}
          className="flex flex-col items-center justify-center flex-1 py-0.5 transition-transform active:scale-95 text-[#C89B3C] hover:text-[#e0b04c] group"
          title="Assistente de IA Ajuda Grupo BNG"
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-[#9B7423] via-[#C89B3C] to-[#F3D785] text-[#14181B] flex items-center justify-center shadow-md shadow-[#C89B3C]/30 group-hover:scale-105 transition-transform ${isAiHelpOpen ? 'ring-2 ring-white' : ''}`}>
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-[#E3BE63]">Ajuda</span>
        </button>

        <button
          onClick={() => navigateTo('create')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentScreen === 'create' ? 'text-[#C89B3C] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <PlusCircle className="w-5 h-5 text-[#C89B3C]" />
            {currentScreen === 'create' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C89B3C]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Publicar</span>
        </button>

        <button
          onClick={() => navigateTo('favorites')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentScreen === 'favorites' ? 'text-[#C89B3C] font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {currentScreen === 'favorites' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C89B3C]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Favoritos</span>
        </button>
      </div>
    </nav>
  );
};
