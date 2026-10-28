import React, { useState, useEffect } from 'react';
import { useApp, ScreenName } from '../context/AppContext';
import { fetchListings, fetchCategories, fetchBanners } from '../services/supabase';
import { Listing, Category, Banner } from '../types';
import { ListingCard } from '../components/ListingCard';
import { openExternalUrl } from '../services/nativeBridge';
import { Search, SlidersHorizontal, ArrowRight, Sparkles, Building2, ChevronRight } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { navigateTo, refreshTrigger } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'smart' | 'recent' | 'price_asc' | 'price_desc'>('smart');
  const [loading, setLoading] = useState(true);

  // Carrega anúncios com rotação inteligente (baseada em sessão aleatória)
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [cats, bans] = await Promise.all([
          fetchCategories(),
          fetchBanners()
        ]);
        if (isMounted) {
          setCategories(cats);
          setBanners(bans.filter(b => b.isActive));
        }

        const sessionSeed = Math.floor(Date.now() / (1000 * 60 * 30)); // Rotação a cada 30 minutos
        const list = await fetchListings(
          activeCategory !== 'all' ? { categoryId: activeCategory } : undefined,
          sortOption,
          sessionSeed
        );

        if (isMounted) {
          setListings(list);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da Home:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activeCategory, sortOption, refreshTrigger]);

  // Rotação automática de banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerClick = (banner: Banner) => {
    if (!banner.linkUrl || !banner.linkUrl.trim()) {
      navigateTo('search');
      return;
    }

    const raw = banner.linkUrl.trim();

    // 1. Redirecionamento para anúncio específico: "detail:id"
    if (raw.startsWith('detail:')) {
      const listingId = raw.replace('detail:', '').trim();
      navigateTo('detail', { listingId });
      return;
    }

    // 2. Telas internas do aplicativo
    const knownScreens: ScreenName[] = [
      'welcome', 'home', 'search', 'search-results', 'detail',
      'create', 'my-listings', 'favorites', 'account',
      'admin-login', 'admin-dashboard', 'admin-listings', 'admin-banners', 'admin-settings'
    ];

    if (knownScreens.includes(raw as ScreenName)) {
      navigateTo(raw as ScreenName);
      return;
    }

    // 3. Destino externo (website como www.mozvita.online, WhatsApp wa.me, etc.)
    openExternalUrl(raw);
  };

  const featuredListings = listings.filter(l => l.isFeatured);
  const regularListings = listings;

  return (
    <div className="pb-24 sm:pb-12 bg-[#F5F7FA] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Banner de Busca Rápida Hero */}
      <div className="bg-[#14181B] text-white pt-2 pb-5 px-3 sm:px-6 shadow-inner w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Quick Search Bar */}
          <div 
            onClick={() => navigateTo('search')}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all shadow-lg group"
          >
            <div className="flex items-center space-x-3 text-slate-300 min-w-0">
              <Search className="w-5 h-5 text-[#C89B3C] group-hover:scale-110 transition-transform shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">Pesquise em Moçambique...</div>
                <div className="text-[11px] text-slate-400 truncate">Cidade de Maputo, Matola, Beira, Nampula</div>
              </div>
            </div>
            <div className="bg-[#C89B3C] text-[#14181B] p-2 rounded-xl shadow-md shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-4 space-y-6 w-full max-w-full overflow-hidden">
        {/* Carrossel de Banners Rotativos 100% Responsivo Sem Quebra */}
        {banners.length > 0 && (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md w-full max-w-full aspect-[2/1] sm:aspect-[21/9] bg-slate-900">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                  idx === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                onClick={() => handleBannerClick(banner)}
              >
                <img
                  src={banner.mobileImageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover brightness-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 sm:p-8 flex flex-col justify-end text-white">
                  <span className="text-[#C89B3C] text-[10px] sm:text-xs uppercase font-extrabold tracking-widest mb-0.5 sm:mb-1">
                    Grupo BNG Serviços
                  </span>
                  <h3 className="text-sm sm:text-2xl font-extrabold leading-tight max-w-xl line-clamp-2">
                    {banner.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-slate-200 line-clamp-1 max-w-md mt-0.5 sm:mt-1 font-light">
                    {banner.shortText}
                  </p>
                  <div className="mt-2 sm:mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBannerClick(banner);
                      }}
                      className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md inline-flex items-center space-x-1.5 transition-all active:scale-95"
                    >
                      <span>{banner.ctaText || 'Saber Mais'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-2.5 right-3.5 z-20 flex space-x-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBannerIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentBannerIndex ? 'w-5 bg-[#C89B3C]' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Linha de Categorias Horizontais */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
              <span>Categorias de Anúncios</span>
            </h2>
            <button
              onClick={() => navigateTo('search')}
              className="text-xs font-bold text-[#C89B3C] hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="flex space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all shadow-sm ${
                activeCategory === 'all'
                  ? 'bg-[#14181B] text-white border border-[#C89B3C]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all shadow-sm flex items-center space-x-2 ${
                  activeCategory === cat.id
                    ? 'bg-[#14181B] text-white border border-[#C89B3C]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#C89B3C]">
                  {cat.icon || 'home'}
                </span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destaques do Grupo BNG */}
        {featuredListings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C89B3C]" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Destaques Exclusivos
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Grupo BNG Selecção
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {featuredListings.slice(0, 4).map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Catálogo Geral com Rotação Inteligente */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Imóveis e Classificados
              </h2>
              <p className="text-xs text-slate-500">
                Apresentação dinâmica e rotativa com oportunidades actualizadas
              </p>
            </div>

            {/* Seletor de Ordenação */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs">
              <span className="text-slate-400 text-[11px]">Ordem:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="smart">Rotação Inteligente</option>
                <option value="recent">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 py-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-2xl h-52 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : regularListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-4">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">Nenhum anúncio encontrado nesta categoria</h3>
              <p className="text-xs text-slate-500 mt-1">Experimente alterar a categoria ou limpar os filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {regularListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
