import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { navigateTo, favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(listing.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ').format(price);
  };

  const coverPhoto = listing.photos.find(p => p.isCover)?.url || listing.photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  const isSold = Boolean(listing.isSold || listing.status === 'completed');

  return (
    <div 
      onClick={() => navigateTo('detail', { listingId: listing.id })}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all cursor-pointer group flex flex-col h-full relative"
    >
      {/* Imagem e Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={coverPhoto}
          alt={listing.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSold ? 'grayscale-[25%]' : ''}`}
          loading="lazy"
        />

        {/* Selo Vermelho Central de VENDIDO (Destaque e Credibilidade) */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center z-20 pointer-events-none">
            <span className="bg-red-600 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-lg uppercase tracking-wider shadow-2xl border-2 border-white transform -rotate-6 drop-shadow-md">
              VENDIDO
            </span>
          </div>
        )}

        {/* Gradiente sutil para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges superiores */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {isSold ? (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Vendido
            </span>
          ) : (
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              listing.transactionType === 'sale' 
                ? 'bg-[#C89B3C] text-[#14181B]' 
                : 'bg-emerald-600 text-white'
            }`}>
              {listing.transactionType === 'sale' ? 'Venda' : 'Renda'}
            </span>
          )}
          <span className="bg-[#14181B]/80 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase hidden sm:inline">
            {listing.categoryName}
          </span>
        </div>

        {/* Botão de Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          aria-label="Guardar nos favoritos"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors z-10 shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Preço sobre a imagem */}
        <div className="absolute bottom-2 left-2 right-2 flex items-baseline justify-between text-white z-10">
          <div>
            <div className="text-[13px] sm:text-base font-extrabold tracking-tight text-white leading-none">
              {formatPrice(listing.price)} <span className="text-[10px] sm:text-xs text-[#C89B3C] font-bold">MT</span>
              {listing.transactionType === 'rent' && <span className="text-[9px] text-slate-300 font-normal"> /mês</span>}
            </div>
          </div>
          {listing.paymentConditions.planType === 'installments' && (
            <span className="bg-amber-400 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase shrink-0">
              Prestações
            </span>
          )}
        </div>
      </div>

      {/* Informações Textuais Compactas */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#C89B3C] transition-colors">
            {listing.title}
          </h3>

          {/* Localização */}
          <div className="flex items-center text-slate-500 text-[10px] sm:text-xs mt-0.5 line-clamp-1">
            <MapPin className="w-3 h-3 text-[#C89B3C] mr-0.5 shrink-0" />
            <span className="truncate">
              {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.district}
            </span>
          </div>
        </div>

        {/* Features Compactos (lado a lado 2x2) */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[10px]">
          {listing.condoTotalHouses !== undefined ? (
            <div className="flex items-center space-x-0.5 text-[#C89B3C]" title={`${listing.condoTotalHouses} Casas no Condomínio`}>
              <span className="material-symbols-outlined text-[13px]">holiday_village</span>
              <span className="font-extrabold text-slate-900">{listing.condoTotalHouses}</span>
              <span className="text-slate-400">casas</span>
            </div>
          ) : listing.bedrooms !== undefined ? (
            <div className="flex items-center space-x-0.5" title={`${listing.bedrooms} Quartos`}>
              <Bed className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-700">{listing.bedrooms}</span>
              <span className="text-slate-400">qts</span>
            </div>
          ) : <div />}

          {listing.bathrooms !== undefined && (
            <div className="flex items-center space-x-0.5" title={`${listing.bathrooms} Casas de Banho`}>
              <Bath className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-700">{listing.bathrooms}</span>
              <span className="text-slate-400">wc</span>
            </div>
          )}

          {listing.areaM2 !== undefined && (
            <div className="flex items-center space-x-0.5" title={`${listing.areaM2} m²`}>
              <Maximize className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-700">{listing.areaM2}</span>
              <span className="text-slate-400">m²</span>
            </div>
          )}

          {listing.vehicleYear !== undefined && (
            <div className="flex items-center space-x-0.5" title={`Ano ${listing.vehicleYear}`}>
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-700">{listing.vehicleYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
