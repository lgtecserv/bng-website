import React, { useState, useEffect, useMemo } from 'react';
import { ListingCard } from '../components/ListingCard';
import { Listing } from '../types';
import { WebsiteUser, fetchWebsiteBanners } from '../services/supabase';
import { 
  Search, 
  SlidersHorizontal, 
  Home, 
  Building, 
  MapPin, 
  Briefcase, 
  Store, 
  Truck, 
  Car,
  Layers,
  PlusCircle, 
  User, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ImobiliarioPageProps {
  listings: Listing[];
  categories: { id: string; name: string }[];
  loading: boolean;
  currentUser: WebsiteUser | null;
  onSelectListing: (listing: Listing) => void;
  onOpenPublish: () => void;
  onOpenLogin: () => void;
}

export const ImobiliarioPage: React.FC<ImobiliarioPageProps> = ({
  listings,
  categories,
  loading,
  currentUser,
  onSelectListing,
  onOpenPublish,
  onOpenLogin,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'smart' | 'recent' | 'price_asc' | 'price_desc'>('smart');
  
  // Banners
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchWebsiteBanners().then(bans => {
      setBanners(bans.filter(b => b.isActive));
    });
  }, []);

  // Rotação de banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const CATEGORY_TABS = [
    { id: 'all', name: 'Todos', icon: Layers },
    { id: 'casas', name: 'Casas', icon: Home },
    { id: 'apartamentos', name: 'Apartamentos', icon: Building },
    { id: 'terrenos', name: 'Terrenos', icon: MapPin },
    { id: 'escritorios', name: 'Escritórios', icon: Briefcase },
    { id: 'armazens', name: 'Armazéns', icon: Store },
    { id: 'comerciais', name: 'Espaços Comerciais', icon: Store },
    { id: 'viaturas', name: 'Viaturas', icon: Car },
  ];

  const PROVINCES = [
    'Todas as Províncias',
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa'
  ];

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // 1. Categoria
      if (activeCategory !== 'all') {
        const catSlug = (item.categoryId || item.categoryName || '').toLowerCase();
        if (activeCategory === 'casas' && !catSlug.includes('casa')) return false;
        if (activeCategory === 'apartamentos' && !catSlug.includes('apartamento')) return false;
        if (activeCategory === 'terrenos' && !catSlug.includes('terreno')) return false;
        if (activeCategory === 'escritorios' && !catSlug.includes('escritório') && !catSlug.includes('escritorio')) return false;
        if (activeCategory === 'armazens' && !catSlug.includes('armazém') && !catSlug.includes('armazem')) return false;
        if (activeCategory === 'comerciais' && !catSlug.includes('comercia')) return false;
        if (activeCategory === 'viaturas' && !catSlug.includes('viatura') && !catSlug.includes('carro')) return false;
      }

      // 2. Tipo de Negócio (Venda / Arrendamento)
      if (purposeFilter !== 'all') {
        const type = (item.transactionType || item.purpose || 'sale').toLowerCase();
        if (purposeFilter === 'sale' && type !== 'sale') return false;
        if (purposeFilter === 'rent' && type !== 'rent') return false;
      }

      // 3. Província
      if (provinceFilter !== 'all' && provinceFilter !== 'Todas as Províncias') {
        if (item.province !== provinceFilter) return false;
      }

      // 4. Busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDistrict = item.district?.toLowerCase().includes(q);
        const matchesNeighborhood = item.neighborhood?.toLowerCase().includes(q);
        const matchesCode = (item.code || item.id)?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDistrict && !matchesNeighborhood && !matchesCode) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      if (sortOption === 'recent') {
        const dateA = new Date(a.created_at || a.createdAt || '').getTime() || 0;
        const dateB = new Date(b.created_at || b.createdAt || '').getTime() || 0;
        return dateB - dateA;
      }
      // Rotação inteligente (destaques primeiro)
      const aScore = (a.isFeatured ? 50 : 0) + (a.impressionsCount || 0);
      const bScore = (b.isFeatured ? 50 : 0) + (b.impressionsCount || 0);
      return bScore - aScore;
    });
  }, [listings, activeCategory, purposeFilter, provinceFilter, searchQuery, sortOption]);

  const currentBanner = banners[currentBannerIndex] || null;

  return (
    <div className="pb-24 sm:pb-16 bg-[#F5F7FA] min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Carrossel de Banners no Topo (Identico ao Screenshot 3) */}
        {currentBanner && (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[21/9] sm:aspect-[28/9] max-h-72 shadow-lg bg-slate-900 group">
            <img
              src={currentBanner.desktopImageUrl || currentBanner.mobileImageUrl}
              alt={currentBanner.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
              <span className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Destaque Oficial Grupo BNG
              </span>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black max-w-xl leading-tight">
                {currentBanner.title}
              </h2>
              {currentBanner.shortText && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1 line-clamp-2">
                  {currentBanner.shortText}
                </p>
              )}
              <div className="mt-3">
                <button
                  onClick={onOpenPublish}
                  className="bg-[#D4AF37] hover:bg-[#B6882C] text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition flex items-center gap-1.5"
                >
                  <span>{currentBanner.ctaText || 'Explorar Imóveis'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Indicadores de slides */}
            {banners.length > 1 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentBannerIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categorias de Anúncios (Pílulas Horizontais Idênticas ao Screenshot 3) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Categorias de Anúncios
            </h3>
            <span className="text-xs text-[#C89B3C] font-semibold cursor-pointer hover:underline" onClick={() => setActiveCategory('all')}>
              Ver todas
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            {CATEGORY_TABS.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0 border ${
                    isActive
                      ? 'bg-[#14181B] text-white border-[#14181B] shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#C89B3C]'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de Busca e Filtros Complementares */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que procura? Ex: Triunfo, Djonasse, T3 com piscina..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Filtro Província */}
            <select
              aria-label="Filtrar por Província"
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none bg-slate-50 hover:bg-white flex-1 md:w-44"
            >
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Filtro Venda / Arrendamento */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPurposeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  purposeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setPurposeFilter('sale')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  purposeFilter === 'sale' ? 'bg-[#C89B3C] text-slate-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Venda
              </button>
              <button
                onClick={() => setPurposeFilter('rent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  purposeFilter === 'rent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Renda
              </button>
            </div>
          </div>
        </div>

        {/* Título da Seção e Ordenação (Identico ao Screenshot 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Imóveis e Classificados
            </h2>
            <p className="text-xs text-slate-500">
              Apresentação dinâmica e rotativa com oportunidades actualizadas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Ordem:</span>
            <select
              aria-label="Ordenar Imóveis"
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none shadow-sm"
            >
              <option value="smart">Rotação Inteligente</option>
              <option value="recent">Mais Recentes</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Grelha de Imóveis (Cards idênticos ao Screenshot 3) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Nenhum imóvel encontrado</h3>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros de categoria ou localização.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setPurposeFilter('all');
                setProvinceFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-slate-950 font-bold rounded-xl text-xs hover:bg-[#B6882C] transition"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredListings.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                onSelect={onSelectListing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
