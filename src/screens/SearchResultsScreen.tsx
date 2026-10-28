import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListings } from '../services/supabase';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ArrowLeft, SlidersHorizontal, X, Building2 } from 'lucide-react';

export const SearchResultsScreen: React.FC = () => {
  const { navigateTo, searchFilters, setSearchFilters } = useApp();
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'smart' | 'recent' | 'price_asc' | 'price_desc'>('smart');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const list = await fetchListings(searchFilters, sortOption);
        if (isMounted) setResults(list);
      } catch (err) {
        console.error('Erro ao buscar resultados:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [searchFilters, sortOption]);

  const removeFilter = (key: keyof typeof searchFilters) => {
    const updated = { ...searchFilters };
    delete updated[key];
    setSearchFilters(updated);
  };

  const hasActiveFilters = Boolean(
    searchFilters.searchQuery ||
    searchFilters.categoryId ||
    searchFilters.province ||
    searchFilters.district ||
    searchFilters.transactionType ||
    searchFilters.minPrice ||
    searchFilters.maxPrice ||
    searchFilters.bedrooms ||
    searchFilters.planType
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 sm:pb-12">
      {/* Top Header */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                Resultados da Pesquisa
              </h1>
              <p className="text-[11px] text-[#C89B3C]">
                {loading ? 'A carregar imóveis...' : `${results.length} anúncio(s) encontrado(s)`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('search')}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Filtros:</span>
            {searchFilters.searchQuery && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
                <span>"{searchFilters.searchQuery}"</span>
                <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => removeFilter('searchQuery')} />
              </span>
            )}
            {searchFilters.province && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
                <span>{searchFilters.province}</span>
                <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => removeFilter('province')} />
              </span>
            )}
            {searchFilters.district && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
                <span>{searchFilters.district}</span>
                <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => removeFilter('district')} />
              </span>
            )}
            {searchFilters.transactionType && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
                <span>{searchFilters.transactionType === 'sale' ? 'Venda' : 'Arrendamento'}</span>
                <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => removeFilter('transactionType')} />
              </span>
            )}
            {searchFilters.planType && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 shadow-sm">
                <span>{searchFilters.planType === 'installments' ? 'Prestações' : 'Integral'}</span>
                <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => removeFilter('planType')} />
              </span>
            )}
            <button
              onClick={() => setSearchFilters({})}
              className="text-[11px] font-bold text-[#C89B3C] hover:underline ml-2"
            >
              Limpar todos
            </button>
          </div>
        )}

        {/* Toolbar de Ordenação */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="font-semibold text-slate-700">
            {results.length} resultados correspondentes
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-[11px]">Ordenar por:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="smart">Relevância / Rotação</option>
              <option value="recent">Mais Recentes</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Lista de Resultados */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 py-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 my-6 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Nenhum resultado para estes critérios
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tente alargar a pesquisa para outra província ou remover alguns filtros aplicados.
            </p>
            <button
              onClick={() => setSearchFilters({})}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#14181B] text-[#C89B3C] text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {results.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
