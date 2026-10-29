import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListingById, recordContactClick, recordListingView } from '../services/supabase';
import { openExternalUrl } from '../services/nativeBridge';
import { Listing } from '../types';
import { 
  ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, 
  Bed, Bath, Maximize, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight,
  Calendar, FileText, AlertCircle, Eye
} from 'lucide-react';

export const ListingDetailScreen: React.FC = () => {
  const { selectedListingId, navigateTo, favorites, toggleFavorite, currentUser } = useApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Contactos Oficiais do Grupo BNG definidos pelo utilizador
  const BNG_OFFICIAL_PHONE = '+258841524822'; // 84 152 4822
  const BNG_OFFICIAL_PHONE_DISPLAY = '+258 84 152 4822';
  const BNG_OFFICIAL_WHATSAPP = '258880096995'; // 88 009 6995
  const BNG_OFFICIAL_WHATSAPP_DISPLAY = '+258 88 009 6995';

  useEffect(() => {
    if (!selectedListingId) {
      navigateTo('home');
      return;
    }

    let isMounted = true;
    fetchListingById(selectedListingId)
      .then(res => {
        if (isMounted) {
          setListing(res);
          setLoading(false);
          // Incrementa e sincroniza visualizações oficiais
          recordListingView(selectedListingId).then((newCount) => {
            if (isMounted) {
              setListing(prev => prev ? { ...prev, viewsCount: newCount } : prev);
            }
          });
        }
      })
      .catch(err => {
        console.error('Erro ao buscar anúncio:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedListingId]);

  if (loading || !listing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">A carregar detalhes do anúncio...</p>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(listing.id);
  const formatPrice = (val: number) => new Intl.NumberFormat('pt-MZ').format(val);

  const handlePhoneClick = () => {
    recordContactClick(listing.id);
    openExternalUrl(`tel:${BNG_OFFICIAL_PHONE}`);
  };

  const handleWhatsappClick = () => {
    recordContactClick(listing.id);
    const message = encodeURIComponent(
      `Olá Grupo BNG! Tenho interesse no anúncio "${listing.title}" (Ref: ${listing.id}) em ${listing.district}, ${listing.province}. Poderia me fornecer mais detalhes?`
    );
    openExternalUrl(`https://wa.me/${BNG_OFFICIAL_WHATSAPP}?text=${message}`);
  };

  const handleShare = () => {
    const officialDomainUrl = `https://www.grupobngoficial.com/?imovel=${listing.id}`;
    const priceFormatted = `${formatPrice(listing.price)} MT`;
    const shareTitle = `${listing.title} • Grupo BNG`;
    const shareText = `Confira este imóvel no Grupo BNG: ${listing.title} por ${priceFormatted} em ${listing.district}, ${listing.province}.\n\nAcesse no link: ${officialDomainUrl}`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: officialDomainUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${officialDomainUrl}`);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 3000);
    }
  };

  const photos = listing.photos && listing.photos.length > 0 
    ? listing.photos 
    : [{ id: 'default', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 1 }];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28 sm:pb-16">
      {/* Top Bar Flutuante */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              aria-label="Partilhar"
              className="p-2 rounded-full hover:bg-white/10 text-slate-300"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(listing.id)}
              aria-label="Favoritar"
              className="p-2 rounded-full hover:bg-white/10 text-slate-300"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {shareFeedback && (
        <div className="bg-emerald-600 text-white text-xs text-center py-2 font-bold animate-pulse">
          Link do anúncio copiado para a área de transferência!
        </div>
      )}

      {/* Galeria de Fotos */}
      <div className="relative max-w-4xl mx-auto bg-black aspect-[16/10] sm:aspect-[21/9] overflow-hidden sm:rounded-b-3xl">
        <img
          src={photos[currentPhotoIdx]?.url}
          alt={listing.title}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Contador de fotos */}
        <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow">
          {currentPhotoIdx + 1} / {photos.length} Fotos
        </div>

        {/* Setas de navegação */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas de Fotos */}
      {photos.length > 1 && (
        <div className="max-w-4xl mx-auto px-4 mt-2 flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {photos.map((photo, i) => (
            <button
              key={photo.id || i}
              onClick={() => setCurrentPhotoIdx(i)}
              className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                i === currentPhotoIdx ? 'border-[#C89B3C] shadow-md scale-105' : 'border-transparent opacity-60'
              }`}
            >
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-5">
        {/* Bloco de Título, Preço e Badges */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              {(listing.isSold || listing.status === 'completed') && (
                <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  VENDIDO
                </span>
              )}
              <span className="bg-[#14181B] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {listing.categoryName}
              </span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                listing.transactionType === 'sale' 
                  ? 'bg-[#C89B3C] text-[#14181B]' 
                  : 'bg-emerald-600 text-white'
              }`}>
                {listing.transactionType === 'sale' ? 'Para Venda' : 'Para Arrendamento'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Ref: {listing.id}</span>
              <span className="text-slate-300">•</span>
              <div 
                className="inline-flex items-center gap-1.5 bg-amber-50/90 text-amber-950 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-200/80 shadow-xs"
                title="Número de visualizações do imóvel"
              >
                <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>{new Intl.NumberFormat('pt-MZ').format(listing.viewsCount || 1)} visualizações</span>
              </div>
            </div>
          </div>

          {(listing.isSold || listing.status === 'completed') && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>Imóvel / Bem negociado e vendido com sucesso pela intermediação do Grupo BNG.</span>
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {listing.title}
          </h1>

          <div className="flex items-center text-slate-500 text-xs">
            <MapPin className="w-4 h-4 text-[#C89B3C] mr-1.5 shrink-0" />
            <span>
              {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.district}, {listing.province}
              {listing.addressReference && ` • (${listing.addressReference})`}
            </span>
          </div>

          {/* Preço em Destaque */}
          <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Preço Solicitado</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#14181B]">
                {formatPrice(listing.price)} <span className="text-base text-[#C89B3C] font-bold">MT</span>
                {listing.transactionType === 'rent' && <span className="text-xs text-slate-400 font-normal"> /mês</span>}
              </div>
            </div>
            {listing.paymentConditions.planType === 'installments' && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                Opção de Prestações
              </span>
            )}
          </div>
        </div>

        {/* Características Principais Específicas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {listing.categoryName?.toLowerCase().includes('condomínio') || listing.categoryName?.toLowerCase().includes('condominio') || listing.condoTotalHouses !== undefined ? 'Especificações do Condomínio & Moradias' :
             listing.categoryName?.toLowerCase().includes('terreno') ? 'Especificações do Terreno' :
             listing.categoryName?.toLowerCase().includes('viatura') || listing.categoryName?.toLowerCase().includes('carro') ? 'Especificações da Viatura / Máquina' :
             listing.categoryName?.toLowerCase().includes('armazém') || listing.categoryName?.toLowerCase().includes('comercial') || listing.categoryName?.toLowerCase().includes('escritório') ? 'Especificações Comerciais' :
             'Características do Imóvel'}
          </h2>

          {/* CONDOMÍNIO RESIDENCIAL */}
          {(listing.categoryName?.toLowerCase().includes('condomínio') || listing.categoryName?.toLowerCase().includes('condominio') || listing.condoTotalHouses !== undefined) ? (
            <div className="space-y-4">
              {/* DADOS GERAIS DO CONDOMÍNIO */}
              <div className="bg-amber-50/70 border border-[#C89B3C]/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-[#C89B3C]">
                  <span className="material-symbols-outlined text-[20px]">holiday_village</span>
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                    Dados Gerais do Empreendimento / Condomínio
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {listing.condoCommercialModel && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Modalidade</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {listing.condoCommercialModel === 'venda_todo' ? 'Condomínio Completo' :
                         listing.condoCommercialModel === 'arrendamento_casas' ? 'Arrendamento de Casas' :
                         listing.condoCommercialModel === 'venda_e_arrendamento' ? 'Venda & Arrendamento' : 'Venda de Fracções'}
                      </span>
                    </div>
                  )}

                  {(listing.condoTotalAreaM2 || listing.areaM2) && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Área Total do Condomínio</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {listing.condoTotalAreaM2 || listing.areaM2} m²
                      </span>
                    </div>
                  )}

                  {listing.condoTotalHouses !== undefined && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Total de Moradias</span>
                      <span className="font-extrabold text-[#C89B3C] text-sm">
                        {listing.condoTotalHouses} Casas
                      </span>
                    </div>
                  )}

                  {listing.condoAvailableHouses !== undefined && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Casas Disponíveis</span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        {listing.condoAvailableHouses} Disponíveis
                      </span>
                    </div>
                  )}

                  {listing.condoConstructionStatus && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Estado da Obra</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {listing.condoConstructionStatus === 'pronto_habitar' ? 'Pronto a Habitar' :
                         listing.condoConstructionStatus === 'em_obra' ? 'Em Obras / Construção' : 'Projeto em Planta'}
                      </span>
                    </div>
                  )}

                  {listing.condoHasSecurity !== undefined && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Segurança Privada</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {listing.condoHasSecurity ? 'Sim (Portaria & Acesso)' : 'Sem segurança'}
                      </span>
                    </div>
                  )}
                </div>

                {listing.condoLocationReference && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-600 block text-[10px] uppercase font-bold">Localização do Condomínio:</strong>
                      <span className="text-slate-900 font-semibold">{listing.condoLocationReference}</span>
                    </div>
                  </div>
                )}

                {/* Comodidades Comuns do Condomínio */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                  {listing.condoHasCommonPool && (
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Piscina Comum</span>
                    </span>
                  )}
                  {listing.condoHasPlayground && (
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B3C]" />
                      <span>Parque Infantil / Lazer</span>
                    </span>
                  )}
                  {listing.condoHasGeneratorOrBorehole && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gerador / Furo de Água Comum</span>
                    </span>
                  )}
                </div>
              </div>

              {/* CARACTERÍSTICAS DA MORADIA */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800">
                  <span className="material-symbols-outlined text-[18px] text-[#C89B3C]">cottage</span>
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                    Características das Moradias {listing.condoHouseTypology ? `(${listing.condoHouseTypology})` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {listing.bedrooms !== undefined && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-[#C89B3C]" />
                      <div>
                        <div className="font-bold text-slate-900">{listing.bedrooms} Quartos</div>
                        {listing.suites ? <div className="text-[10px] text-slate-400">({listing.suites} suíte)</div> : null}
                      </div>
                    </div>
                  )}

                  {listing.bathrooms !== undefined && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-2">
                      <Bath className="w-4 h-4 text-[#C89B3C]" />
                      <div>
                        <div className="font-bold text-slate-900">{listing.bathrooms} Casas de Banho</div>
                      </div>
                    </div>
                  )}

                  {listing.areaM2 !== undefined && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-2">
                      <Maximize className="w-4 h-4 text-[#C89B3C]" />
                      <div>
                        <div className="font-bold text-slate-900">{listing.areaM2} m²</div>
                        <div className="text-[10px] text-slate-400">Área Útil da Moradia</div>
                      </div>
                    </div>
                  )}

                  {listing.parkingSpaces !== undefined && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[#C89B3C] text-[18px]">local_parking</span>
                      <div>
                        <div className="font-bold text-slate-900">{listing.parkingSpaces} Vagas</div>
                        <div className="text-[10px] text-slate-400">Estacionamento</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (listing.categoryName?.toLowerCase().includes('terreno') || listing.landDimensions) ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {listing.landDimensions && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Dimensões</span>
                    <span className="font-extrabold text-slate-900 text-sm">{listing.landDimensions}</span>
                  </div>
                )}
                {listing.areaM2 && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Área Total</span>
                    <span className="font-extrabold text-slate-900 text-sm">{listing.areaM2} m²</span>
                  </div>
                )}
                {listing.landZoneType && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Tipo de Zona</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {listing.landZoneType === 'vip_urbana' ? 'Zona VIP / Urbana' :
                       listing.landZoneType === 'residencial' ? 'Residencial' :
                       listing.landZoneType === 'expansao' ? 'Expansão' : 'Rural / Agrícola'}
                    </span>
                  </div>
                )}
                {listing.landRoadAccess && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Acesso Rodoviário</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {listing.landRoadAccess === 'alcatrao' ? 'Asfalto / Alcatrão' :
                       listing.landRoadAccess === 'terra_boa' ? 'Terra Batida Boa' : 'Acesso Regular / 4x4'}
                    </span>
                  </div>
                )}
                {listing.landTopography && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Topografia</span>
                    <span className="font-extrabold text-slate-900 text-xs capitalize">{listing.landTopography}</span>
                  </div>
                )}
                {listing.landIsFenced !== undefined && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Vedação</span>
                    <span className="font-extrabold text-slate-900 text-xs">{listing.landIsFenced ? 'Vedado / Murado' : 'Aberto / Não Vedado'}</span>
                  </div>
                )}
              </div>

              {listing.landDistanceToMainRoad && (
                <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-2xl text-xs text-amber-900 flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Acessibilidade / Paragem: </strong>
                    <span>{listing.landDistanceToMainRoad}</span>
                  </div>
                </div>
              )}

              {listing.declaredDocumentation && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-800">
                  <strong className="font-bold text-slate-500 block text-[10px] uppercase">Documentação Declarada:</strong>
                  <span>{listing.declaredDocumentation}</span>
                </div>
              )}
            </div>
          ) : (listing.categoryName?.toLowerCase().includes('viatura') || listing.vehicleBrand) ? (
            /* VIATURA */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {listing.vehicleBrand && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Marca & Modelo</span>
                  <span className="font-extrabold text-slate-900 text-xs">{listing.vehicleBrand} {listing.vehicleModel}</span>
                </div>
              )}
              {listing.vehicleYear && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Ano de Fabrico</span>
                  <span className="font-extrabold text-slate-900 text-sm">{listing.vehicleYear}</span>
                </div>
              )}
              {listing.vehicleMileage !== undefined && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Quilometragem</span>
                  <span className="font-extrabold text-slate-900 text-sm">{listing.vehicleMileage.toLocaleString()} km</span>
                </div>
              )}
              {listing.vehicleFuel && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Combustível</span>
                  <span className="font-extrabold text-slate-900 text-xs capitalize">{listing.vehicleFuel}</span>
                </div>
              )}
              {listing.vehicleTransmission && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Transmissão</span>
                  <span className="font-extrabold text-slate-900 text-xs capitalize">{listing.vehicleTransmission}</span>
                </div>
              )}
              {listing.conditionState && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Estado</span>
                  <span className="font-extrabold text-slate-900 text-xs capitalize">{listing.conditionState}</span>
                </div>
              )}
            </div>
          ) : (
            /* RESIDENCIAL (CASAS E APARTAMENTOS) */
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 text-xs">
                {listing.bedrooms !== undefined && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
                    <Bed className="w-5 h-5 text-[#C89B3C]" />
                    <div>
                      <div className="font-bold text-slate-900">{listing.bedrooms} Quartos</div>
                      {listing.suites !== undefined && (
                        <div className="text-[10px] text-slate-400">({listing.suites} em suíte)</div>
                      )}
                    </div>
                  </div>
                )}
                {listing.bathrooms !== undefined && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
                    <Bath className="w-5 h-5 text-[#C89B3C]" />
                    <div>
                      <div className="font-bold text-slate-900">{listing.bathrooms} Casas de Banho</div>
                      <div className="text-[10px] text-slate-400">Completas</div>
                    </div>
                  </div>
                )}
                {listing.areaM2 !== undefined && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
                    <Maximize className="w-5 h-5 text-[#C89B3C]" />
                    <div>
                      <div className="font-bold text-slate-900">{listing.areaM2} m²</div>
                      <div className="text-[10px] text-slate-400">Área declarada</div>
                    </div>
                  </div>
                )}
                {listing.parkingSpaces !== undefined && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center space-x-2.5">
                    <span className="material-symbols-outlined text-[#C89B3C] text-[20px]">local_parking</span>
                    <div>
                      <div className="font-bold text-slate-900">{listing.parkingSpaces} Vagas</div>
                      <div className="text-[10px] text-slate-400">Estacionamento</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comodidades adicionais */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                {listing.hasWaterAndLight && (
                  <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Água e Eletricidade da Rede</span>
                  </span>
                )}
                {listing.hasAirConditioning && (
                  <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Climatizado</span>
                  </span>
                )}
                {listing.hasPool && (
                  <span className="inline-flex items-center space-x-1 bg-sky-50 text-sky-800 px-3 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Piscina</span>
                  </span>
                )}
                {listing.hasSecurity && (
                  <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Segurança / Condomínio</span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Condições de Pagamento e Simulação (PRD Item 5) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#C89B3C]">payments</span>
            <span>Condições Comerciais e de Pagamento</span>
          </h2>

          {listing.paymentConditions.planType === 'installments' ? (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold text-amber-900">
                Plano em Prestações Declarado pelo Anunciante
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">Entrada ({listing.paymentConditions.downPaymentPercentage}%)</span>
                  <span className="font-extrabold text-slate-900">
                    {formatPrice(listing.paymentConditions.downPaymentAmount || 0)} MT
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">Saldo Restante</span>
                  <span className="font-extrabold text-slate-900">
                    {formatPrice(listing.paymentConditions.remainingBalance || 0)} MT
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-slate-500 block">
                    {listing.paymentConditions.installmentsCount} Prestações ({listing.paymentConditions.installmentFrequency || 'mensais'})
                  </span>
                  <span className="font-extrabold text-[#C89B3C]">
                    {formatPrice(listing.paymentConditions.installmentAmount || 0)} MT/mês
                  </span>
                </div>
              </div>
              {listing.paymentConditions.firstInstallmentTrigger && (
                <p className="text-[11px] text-slate-600">
                  <strong>Vencimento da 1ª prestação:</strong> {listing.paymentConditions.firstInstallmentTrigger}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Pagamento Integral à Vista:</span> Pagamento direto no ato de formalização do contrato ou escritura pública.
            </div>
          )}

          {listing.paymentConditions.additionalNotes && (
            <p className="text-xs text-slate-500 italic">
              <strong>Observações do anunciante:</strong> {listing.paymentConditions.additionalNotes}
            </p>
          )}

          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>As condições financeiras são declaradas pelo anunciante e sujeitas a verificação contratual.</span>
          </div>
        </div>

        {/* Descrição Detalhada */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Descrição do Anúncio
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
            {listing.description}
          </p>

          {listing.declaredDocumentation && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-1">
                <FileText className="w-4 h-4 text-[#C89B3C]" />
                <span>Situação Documental Declarada</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {listing.declaredDocumentation}
              </p>
            </div>
          )}
        </div>

        {/* Anunciante & Confiança Grupo BNG */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#14181B] text-[#C89B3C] font-extrabold flex items-center justify-center text-sm shadow">
              {listing.authorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs text-slate-400">Anunciado por</div>
              <div className="font-extrabold text-slate-900 text-sm">{listing.authorName}</div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Canal Oficial de Atendimento Grupo BNG</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <Phone className="w-4 h-4 text-[#C89B3C] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Linha Telefónica Direta</span>
                <span className="font-bold text-slate-800">{BNG_OFFICIAL_PHONE_DISPLAY}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-700 block font-medium">WhatsApp Oficial</span>
                <span className="font-bold text-emerald-950">{BNG_OFFICIAL_WHATSAPP_DISPLAY}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Fixa Inferior de Contactos (WhatsApp e Telefone Direto) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#14181B] text-white p-3 border-t border-slate-800 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex flex-col shrink-0 min-w-0 pr-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Preço</span>
            <div className="text-sm sm:text-lg font-extrabold text-white truncate">
              {formatPrice(listing.price)} <span className="text-[#C89B3C] text-[11px] sm:text-xs">MT</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-1 justify-end max-w-sm">
            <button
              onClick={handlePhoneClick}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 sm:px-4 py-3 rounded-2xl text-[11px] sm:text-xs font-bold transition-all border border-slate-700 active:scale-95 shadow-sm"
              title={`Ligar para o Grupo BNG: ${BNG_OFFICIAL_PHONE_DISPLAY}`}
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C89B3C] shrink-0" />
              <span className="truncate">Ligar Agora</span>
            </button>

            <button
              onClick={handleWhatsappClick}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 sm:px-5 py-3 rounded-2xl text-[11px] sm:text-xs font-extrabold transition-all shadow-md active:scale-95"
              title={`Conversar no WhatsApp Grupo BNG: ${BNG_OFFICIAL_WHATSAPP_DISPLAY}`}
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
