import React from 'react';
import { useApp, ScreenName } from '../context/AppContext';
import { Home, Search, PlusCircle, Heart, FolderKanban } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  const navItems: { screen: ScreenName; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { screen: 'search', label: 'Pesquisar', icon: <Search className="w-5 h-5" /> },
    { screen: 'create', label: 'Publicar', icon: <PlusCircle className="w-6 h-6 text-[#C89B3C]" /> },
    { screen: 'favorites', label: 'Favoritos', icon: <Heart className="w-5 h-5" /> },
    { screen: 'my-listings', label: 'Meus Anúncios', icon: <FolderKanban className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#14181B] border-t border-slate-800 text-slate-400 py-2 px-3 z-40 sm:hidden shadow-nav">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigateTo(item.screen)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-[#C89B3C] font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C89B3C]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
