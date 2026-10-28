import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, PlusCircle, User, ShieldCheck, Bell } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const AppHeader: React.FC = () => {
  const { 
    navigateTo, 
    currentUser, 
    isAuthenticated, 
    openAuthModal, 
    openNotificationCenter, 
    unreadNotificationsCount 
  } = useApp();

  const handlePublishClick = () => {
    if (!isAuthenticated || currentUser.role === 'visitor') {
      openAuthModal('register', 'create');
    } else {
      navigateTo('create');
    }
  };

  const handleAccountClick = () => {
    if (!isAuthenticated || currentUser.role === 'visitor') {
      openAuthModal('login', 'account');
    } else {
      navigateTo('account');
    }
  };

  return (
    <header className="bg-[#14181B] text-white px-2 sm:px-6 py-2 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logótipo Real Oficial do Grupo BNG */}
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center text-left transition-transform active:scale-95 py-0.5 shrink-0"
          aria-label="Grupo BNG - Início"
        >
          <img
            src={logoImg}
            onError={(e) => { e.currentTarget.src = './logo.png'; }}
            alt="Grupo BNG — Imobiliária &amp; Negócios"
            className="h-8 sm:h-11 w-auto object-contain drop-shadow"
          />
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Botão de Pesquisa */}
          <button
            onClick={() => navigateTo('search')}
            aria-label="Pesquisar"
            className="p-1.5 sm:p-2 text-slate-300 hover:text-[#C89B3C] hover:bg-white/5 rounded-full transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Botão de Notificações com Badge */}
          <button
            onClick={openNotificationCenter}
            aria-label="Notificações"
            className="p-1.5 sm:p-2 text-slate-300 hover:text-[#C89B3C] hover:bg-white/5 rounded-full transition-colors relative"
            title="Notificações e Alertas Sonoros"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-600 text-white font-black text-[8px] sm:text-[9px] rounded-full flex items-center justify-center animate-pulse shadow">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Botão Publicar Anúncio (Destaque Dourado) */}
          <button
            onClick={handlePublishClick}
            className="flex items-center gap-1 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-2.5 sm:px-3.5 py-1.5 rounded-full font-bold text-[11px] sm:text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Publicar</span>
          </button>

          {/* Atalho Admin exclusivo se estiver logado como administrador */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin-dashboard')}
              title="Painel Administrativo"
              className="p-1.5 rounded-full bg-amber-400 text-slate-950 font-bold transition-all shadow-sm hover:bg-amber-300 shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Perfil ou Entrar */}
          <button
            onClick={handleAccountClick}
            aria-label="Conta"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
              isAuthenticated
                ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
                : 'border-slate-700 text-slate-300 hover:text-white hover:border-[#C89B3C]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAuthenticated ? currentUser.fullName.split(' ')[0] : 'Entrar'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
