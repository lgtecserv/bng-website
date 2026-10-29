import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Smartphone, 
  Home, 
  Building2, 
  Briefcase, 
  Mail, 
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { WebsiteUser } from '../services/supabase';

export type ActivePage = 
  | 'home' 
  | 'imobiliario' 
  | 'baixar-app' 
  | 'servicos-limpeza' 
  | 'servicos-procurement' 
  | 'contato' 
  | 'admin' 
  | 'publicar'
  | 'privacidade'
  | 'termos'
  | 'parcerias';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser: WebsiteUser | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenPublish: () => void;
  onLogout: () => void;
  onOpenAiHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenPublish,
  onLogout,
  onOpenAiHelp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServicesActive = activePage === 'servicos-limpeza' || activePage === 'servicos-procurement';

  return (
    <header className="sticky top-0 z-50 bg-[#12161A]/95 backdrop-blur-md border-b border-white/10 text-white shadow-xl transition-all">
      {/* Menu Principal de Navegação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
        {/* Logotipo Oficial do Grupo BNG */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center cursor-pointer group py-1"
          title="Grupo BNG - Página Inicial"
        >
          <img 
            src="/logo-transparent.png" 
            alt="Grupo BNG Logotipo Oficial" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.indexOf('logo.png') === -1) {
                target.src = '/logo.png';
              }
            }}
          />
        </div>

        {/* Links Centrais (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-200">
          <button 
            onClick={() => handleNav('home')} 
            className={`transition-all py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 ${
              activePage === 'home' 
                ? 'text-[#C89B3C] font-bold' 
                : 'hover:text-[#C89B3C] text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>

          <button 
            onClick={() => handleNav('imobiliario')} 
            className={`transition-all py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 ${
              activePage === 'imobiliario' 
                ? 'text-[#C89B3C] font-bold' 
                : 'hover:text-[#C89B3C] text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Imobiliário</span>
          </button>

          {/* Menu Dropdown de Serviços Particulares */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button 
              onClick={() => handleNav('servicos-limpeza')}
              className={`transition-all py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 ${
                isServicesActive 
                  ? 'text-[#C89B3C] font-bold' 
                  : 'hover:text-[#C89B3C] text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Serviços</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Submenu Dropdown com Páginas Particulares */}
            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#14181B] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => handleNav('servicos-limpeza')}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2.5 ${
                    activePage === 'servicos-limpeza' 
                      ? 'bg-white/10 text-[#C89B3C] font-bold' 
                      : 'hover:bg-white/5 text-slate-200 hover:text-[#C89B3C]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#C89B3C]/15 flex items-center justify-center text-[#C89B3C]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Limpeza & Facility</div>
                    <div className="text-[10px] text-slate-400">Higienização e pós-obra</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('servicos-procurement')}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2.5 border-t border-white/5 ${
                    activePage === 'servicos-procurement' 
                      ? 'bg-white/10 text-emerald-400 font-bold' 
                      : 'hover:bg-white/5 text-slate-200 hover:text-emerald-400'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Procurement & Negócios</div>
                    <div className="text-[10px] text-slate-400">Compras corporativas e EPIs</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNav('baixar-app')} 
            className={`transition-all py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 ${
              activePage === 'baixar-app' 
                ? 'text-[#C89B3C] font-bold' 
                : 'hover:text-[#C89B3C] text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#C89B3C]" />
            <span>Aplicativo</span>
          </button>

          <button 
            onClick={() => handleNav('contato')} 
            className={`transition-all py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 ${
              activePage === 'contato' 
                ? 'text-[#C89B3C] font-bold' 
                : 'hover:text-[#C89B3C] text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contato</span>
          </button>

          {onOpenAiHelp && (
            <button
              onClick={onOpenAiHelp}
              className="transition-all py-1.5 px-3 rounded-xl flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 border border-[#C89B3C]/50 text-[#C89B3C] hover:text-white hover:border-[#C89B3C] font-bold shadow-xs active:scale-95"
              title="Consultor Imobiliário Oficial de IA"
            >
              <Bot className="w-4 h-4 text-[#C89B3C]" />
              <span>Ajuda IA</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}
        </nav>

        {/* Lado Direito do Header — Limpo, Elegante e Sem Repetições */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Botão de Publicar Imóvel */}
          <button
            onClick={onOpenPublish}
            className="bg-gradient-to-r from-[#D4AF37] via-[#C89B3C] to-[#AA7C1E] hover:opacity-95 text-[#14181B] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-[#C89B3C]/15 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Imóvel</span>
          </button>

          {/* Estado do Utilizador */}
          {currentUser ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              {/* Se for estritamente Admin oficial, mostra o botão do Painel Admin */}
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => handleNav(activePage === 'admin' ? 'home' : 'admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activePage === 'admin'
                      ? 'bg-white/15 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-[#C89B3C] text-slate-950 hover:bg-[#B6882C] shadow-sm'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activePage === 'admin' ? 'Ver Portal' : 'Painel Admin'}</span>
                </button>
              ) : (
                /* Usuário Normal: identificação limpa com avatar e primeiro nome */
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center font-bold text-[10px]">
                    {(currentUser.fullName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-200 max-w-[100px] truncate">
                    {currentUser.fullName?.split(' ')[0] || currentUser.email.split('@')[0]}
                  </span>
                </div>
              )}

              <button
                onClick={onLogout}
                title="Terminar Sessão"
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 border border-white/10 transition-colors"
            >
              <User className="w-4 h-4 text-[#C89B3C]" />
              <span>Entrar</span>
            </button>
          )}
        </div>

        {/* Botão Hamburger (Mobile) */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Retrátil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#14181B] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activePage === 'home' ? 'bg-[#C89B3C]/10 text-[#C89B3C] font-bold' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>

          <button
            onClick={() => handleNav('imobiliario')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activePage === 'imobiliario' ? 'bg-[#C89B3C]/10 text-[#C89B3C] font-bold' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Imobiliário</span>
          </button>

          {/* Submenu Serviços Mobile */}
          <div className="pl-2 border-l-2 border-white/10 my-1 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Serviços Corporativos</span>
            </div>
            <button
              onClick={() => handleNav('servicos-limpeza')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                activePage === 'servicos-limpeza' 
                  ? 'bg-[#C89B3C]/15 text-[#C89B3C] font-bold' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-[#C89B3C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Limpeza & Facility</span>
            </button>
            <button
              onClick={() => handleNav('servicos-procurement')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                activePage === 'servicos-procurement' 
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-emerald-400'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Procurement & Negócios</span>
            </button>
          </div>

          <button
            onClick={() => handleNav('baixar-app')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activePage === 'baixar-app' ? 'bg-[#C89B3C]/10 text-[#C89B3C] font-bold' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#C89B3C]" />
              <span>Baixar Aplicativo</span>
            </div>
            <span className="bg-[#C89B3C]/20 text-[#C89B3C] text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">APK</span>
          </button>

          <button
            onClick={() => handleNav('contato')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activePage === 'contato' ? 'bg-[#C89B3C]/10 text-[#C89B3C] font-bold' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contato</span>
          </button>

          {onOpenAiHelp && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiHelp();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between bg-amber-500/15 border border-[#C89B3C]/40 text-[#C89B3C]"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-[#C89B3C]" />
                <span>Ajuda IA • Consultor BNG</span>
              </div>
              <span className="bg-[#D4AF37] text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">ONLINE</span>
            </button>
          )}

          {/* Atalho Painel Admin no Menu Mobile */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNav('admin')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-between ${
                activePage === 'admin' ? 'bg-[#C89B3C] text-slate-950 font-black' : 'bg-[#C89B3C]/15 text-[#C89B3C] border border-[#C89B3C]/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>Painel de Administração</span>
              </div>
              <span className="bg-[#D4AF37] text-slate-900 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">ADMIN</span>
            </button>
          )}

          {/* Área de Ações e Sessão no Mobile */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPublish();
              }}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-900 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Imóvel</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="text-xs text-slate-300">
                  <span>Sessão: </span>
                  <strong className="text-white">{currentUser.fullName || currentUser.email}</strong>
                  <span className="text-[10px] text-[#C89B3C] ml-1">({currentUser.role === 'admin' ? 'Admin' : 'Anunciante'})</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-red-400 font-bold underline"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 border border-white/10"
              >
                <User className="w-4 h-4 text-[#C89B3C]" />
                <span>Entrar / Registar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
