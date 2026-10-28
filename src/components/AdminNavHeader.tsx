import React from 'react';
import { useApp, ScreenName } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Building2, 
  Megaphone, 
  CreditCard, 
  Globe, 
  ArrowLeft,
  Bell,
  PlusCircle
} from 'lucide-react';
import logoImg from '../assets/logo.png';

interface AdminNavHeaderProps {
  currentTab: 'dashboard' | 'listings' | 'banners' | 'settings';
  pendingCount?: number;
}

export const AdminNavHeader: React.FC<AdminNavHeaderProps> = ({ currentTab, pendingCount = 0 }) => {
  const { navigateTo, openNotificationCenter, unreadNotificationsCount } = useApp();

  const navItems: {
    id: 'dashboard' | 'listings' | 'banners' | 'settings';
    screen: ScreenName;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      screen: 'admin-dashboard',
      label: 'Visão Geral',
      shortLabel: 'Geral',
      icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'listings',
      screen: 'admin-listings',
      label: 'Imóveis & Mod.',
      shortLabel: 'Imóveis',
      icon: <Building2 className="w-3.5 h-3.5 shrink-0" />,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    {
      id: 'banners',
      screen: 'admin-banners',
      label: 'Publicidades',
      shortLabel: 'Banners',
      icon: <Megaphone className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'settings',
      screen: 'admin-settings',
      label: 'Pagamentos',
      shortLabel: 'Contas',
      icon: <CreditCard className="w-3.5 h-3.5 shrink-0" />
    }
  ];

  return (
    <header className="bg-[#14181B] text-white sticky top-0 z-40 shadow-md w-full max-w-full overflow-hidden">
      {/* Barra Superior Compacta — Logo + Badge ADMIN + Ações */}
      <div className="px-2 sm:px-6 py-1.5 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Lado Esquerdo: Voltar + Logo + Badge Admin */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={() => navigateTo('home')}
              title="Voltar ao início público"
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img
              src={logoImg}
              onError={(e) => { e.currentTarget.src = './logo.png'; }}
              alt="Grupo BNG"
              className="h-6 sm:h-8 w-auto object-contain shrink-0 drop-shadow cursor-pointer"
              onClick={() => navigateTo('admin-dashboard')}
            />
            <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-[#C89B3C] text-[#14181B] shrink-0">
              Admin
            </span>
          </div>

          {/* Lado Direito: Ações compactas */}
          <div className="flex items-center gap-1">
            {/* Publicar Imóvel */}
            <button
              onClick={() => navigateTo('create')}
              title="Cadastrar Imóvel"
              className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all shadow active:scale-95 flex items-center gap-1 shrink-0"
            >
              <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden min-[340px]:inline">Publicar</span>
            </button>

            {/* Notificações */}
            <button
              onClick={openNotificationCenter}
              title="Notificações"
              className="p-1.5 text-slate-300 hover:text-[#C89B3C] hover:bg-white/10 rounded-lg transition-all relative shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 text-white font-black text-[7px] rounded-full flex items-center justify-center animate-pulse shadow">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Portal Público */}
            <button
              onClick={() => navigateTo('home')}
              title="Portal Público"
              className="p-1.5 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-1 shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span className="hidden sm:inline text-[11px] font-semibold">Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de 4 Abas — Responsivo para 320px */}
      <div className="px-1.5 sm:px-6 py-1 bg-slate-900/95 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <nav className="grid grid-cols-4 gap-0.5 sm:gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.screen)}
                  className={`flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-0.5 sm:px-1.5 rounded-lg text-[10px] sm:text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#C89B3C] text-[#14181B] font-extrabold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 font-semibold'
                  }`}
                >
                  {item.icon}
                  <span className="truncate max-w-[52px] sm:max-w-none">{item.shortLabel}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[8px] sm:text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shrink-0 ${
                      isActive ? 'bg-[#14181B] text-[#C89B3C]' : 'bg-amber-400 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
