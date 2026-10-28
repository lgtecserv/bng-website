import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListings } from '../services/supabase';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ArrowLeft, Heart, Search } from 'lucide-react';

export const FavoritesScreen: React.FC = () => {
  const { navigateTo, favorites } = useApp();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings().then(all => {
      const favs = all.filter(item => favorites.includes(item.id));
      setFavoriteListings(favs);
      setLoading(false);
    });
  }, [favorites]);

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
                Imóveis Guardados
              </h1>
              <p className="text-[11px] text-[#C89B3C]">
                {favoriteListings.length} favorito(s) salvos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : favoriteListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm my-6 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Ainda não guardou nenhum imóvel
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Clique no ícone de coração nos anúncios que mais gostar para consultar mais tarde.
            </p>
            <button
              onClick={() => navigateTo('search')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#14181B] text-[#C89B3C] text-xs font-bold shadow-md hover:bg-slate-800 transition-colors inline-flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explorar Anúncios</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {favoriteListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
