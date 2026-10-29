import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Bed, Bath, Maximize2, ShieldCheck, Phone, 
  MessageSquare, Check, Car, Droplets, Wind, Shield, Eye, Share2, CheckCircle2 
} from 'lucide-react';
import { Listing } from '../types';
import { recordListingView } from '../services/supabase';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [views, setViews] = useState<number>(listing.viewsCount || 1);
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (listing?.id) {
      recordListingView(listing.id).then((newCount) => {
        if (isMounted && typeof newCount === 'number') {
          setViews(newCount);
        }
      });
    }
    return () => { isMounted = false; };
  }, [listing?.id]);

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos.map(p => p.url)
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const whatsappUrl = `https://wa.me/258880096995?text=${encodeURIComponent(
    `Olá Grupo BNG! Tenho interesse no imóvel "${listing.title}" (Ref: ${listing.id}, Preço: ${listing.price.toLocaleString()} MT). Gostaria de agendar uma visita e obter mais detalhes.`
  )}`;

  const handleShare = () => {
    const officialDomainUrl = `https://www.grupobngoficial.com/?imovel=${listing.id}`;
    const priceFormatted = `${new Intl.NumberFormat('pt-MZ').format(listing.price)} MT`;
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

  const isCondo = listing.categoryId === 'b9d6d6ee-bc70-4197-95e1-43568854f5bc' || 
                  listing.categoryId === 'condominios' || 
                  listing.categoryName?.toLowerCase().includes('condom') ||
                  Boolean(listing.condoTotalHouses);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Topo do Modal com Fechar e Partilhar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              listing.transactionType === 'sale' ? 'bg-[#C89B3C] text-[#14181B]' : 'bg-emerald-600 text-white'
            }`}>
              {listing.transactionType === 'sale' ? 'Para Venda' : 'Para Arrendamento'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Categoria: <strong className="text-slate-800">{listing.categoryName}</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            {/* Contador de Visualizações com Ícone de Olho */}
            <div 
              className="inline-flex items-center gap-1.5 bg-amber-50/90 text-amber-950 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200/80 shadow-xs"
              title="Número de visualizações do imóvel"
            >
              <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>{new Intl.NumberFormat('pt-MZ').format(views)} visualizações</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              title="Partilhar link oficial"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-[#C89B3C] hover:text-slate-950 text-slate-700 text-xs font-bold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{shareFeedback ? 'Link Copiado!' : 'Partilhar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Modal com Scroll */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Galeria de Fotos - 100% íntegras sem cortes */}
          <div className="space-y-3">
            <div className="relative h-80 sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0A0D10] shadow-xl flex items-center justify-center group">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${photos[activePhotoIndex]})` }}
              />

              <img
                src={photos[activePhotoIndex]}
                alt={listing.title}
                className="relative z-10 max-w-full max-h-full object-contain transition-all duration-300 drop-shadow-lg"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md transition shadow-md hover:scale-105"
                    title="Foto anterior"
                    aria-label="Foto anterior"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md transition shadow-md hover:scale-105"
                    title="Próxima foto"
                    aria-label="Próxima foto"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 z-20 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                Foto {activePhotoIndex + 1} de {photos.length}
              </div>
            </div>

            {photos.length > 1 && (
              <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 bg-slate-900 transition-all ${
                      activePhotoIndex === idx 
                        ? 'border-[#C89B3C] scale-105 shadow-md ring-2 ring-[#C89B3C]/30' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cabeçalho do Imóvel e Preço */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {listing.title}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1.5">
                <MapPin className="w-4 h-4 text-[#C89B3C]" />
                <span>
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.district}, {listing.province}
                </span>
                {listing.addressReference && (
                  <span className="text-xs text-slate-400">({listing.addressReference})</span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Preço Oficial</span>
              <div className="text-3xl font-black text-slate-900">
                {listing.price.toLocaleString()} <span className="text-lg font-bold text-[#C89B3C]">MT</span>
                {listing.transactionType === 'rent' && <span className="text-sm font-normal text-slate-500">/mês</span>}
              </div>
            </div>
          </div>

          {/* SEÇÃO ESPECÍFICA DE CONDOMÍNIOS RESIDENCIAIS */}
          {isCondo && (
            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/70 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                  Características Gerais do Condomínio
                </span>
                {listing.condoCommercialModel && (
                  <span className="bg-[#14181B] text-[#C89B3C] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {listing.condoCommercialModel === 'venda_todo' ? 'Venda do Condomínio Todo' :
                     listing.condoCommercialModel === 'arrendamento_casas' ? 'Arrendamento das Casas' :
                     listing.condoCommercialModel === 'venda_e_arrendamento' ? 'Venda e Arrendamento' : 'Venda de Casas Particulares'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {listing.condoTotalAreaM2 ? (
                  <div className="bg-white p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Área do Condomínio</span>
                    <span className="font-extrabold text-slate-900 text-sm">{listing.condoTotalAreaM2} m²</span>
                  </div>
                ) : null}

                {listing.condoTotalHouses ? (
                  <div className="bg-white p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total de Casas</span>
                    <span className="font-extrabold text-slate-900 text-sm">{listing.condoTotalHouses} Casas</span>
                  </div>
                ) : null}

                {listing.condoConstructionStatus ? (
                  <div className="bg-white p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estado da Obra</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {listing.condoConstructionStatus === 'pronto_habitar' ? 'Pronto a Habitar' :
                       listing.condoConstructionStatus === 'em_obra' ? 'Em Obras' : 'Em Projeto'}
                    </span>
                  </div>
                ) : null}

                {listing.condoHasSecurity !== undefined ? (
                  <div className="bg-white p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Segurança Privada</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {listing.condoHasSecurity ? 'Portaria 24h & Guarita' : 'Sem portaria'}
                    </span>
                  </div>
                ) : null}
              </div>

              {listing.condoLocationReference && (
                <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <span><strong>Localização do Condomínio:</strong> {listing.condoLocationReference}</span>
                </div>
              )}

              {/* Comodidades Comuns */}
              <div className="flex flex-wrap gap-2 text-xs">
                {listing.condoHasCommonPool && (
                  <span className="bg-white text-slate-800 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Piscina Comum</span>
                  </span>
                )}
                {listing.condoHasPlayground && (
                  <span className="bg-white text-slate-800 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>Parque Infantil</span>
                  </span>
                )}
                {listing.condoHasGeneratorOrBorehole && (
                  <span className="bg-white text-slate-800 border border-amber-200 px-3 py-1 rounded-full font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gerador / Furo de Água Comum</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Destaques das Características da Moradia / Imóvel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {listing.bedrooms ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <Bed className="w-6 h-6 text-[#C89B3C]" />
                <div>
                  <span className="text-xs text-slate-500 block">Quartos</span>
                  <span className="font-extrabold text-sm text-slate-900">{listing.bedrooms} Quartos</span>
                  {listing.suites ? <span className="text-[10px] text-slate-400">({listing.suites} suíte)</span> : null}
                </div>
              </div>
            ) : null}

            {listing.bathrooms ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <Bath className="w-6 h-6 text-[#C89B3C]" />
                <div>
                  <span className="text-xs text-slate-500 block">Casas de Banho</span>
                  <span className="font-extrabold text-sm text-slate-900">{listing.bathrooms} WC</span>
                </div>
              </div>
            ) : null}

            {listing.areaM2 ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <Maximize2 className="w-6 h-6 text-[#C89B3C]" />
                <div>
                  <span className="text-xs text-slate-500 block">Área Construída</span>
                  <span className="font-extrabold text-sm text-slate-900">{listing.areaM2} m²</span>
                </div>
              </div>
            ) : null}

            {listing.parkingSpaces ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <Car className="w-6 h-6 text-[#C89B3C]" />
                <div>
                  <span className="text-xs text-slate-500 block">Estacionamento</span>
                  <span className="font-extrabold text-sm text-slate-900">{listing.parkingSpaces} Vagas</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Comodidades e Infraestruturas */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Comodidades & Segurança</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <Droplets className={`w-4 h-4 ${listing.hasWaterAndLight ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Água e Energia: {listing.hasWaterAndLight ? 'Sim' : 'A confirmar'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className={`w-4 h-4 ${listing.hasAirConditioning ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Climatização: {listing.hasAirConditioning ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className={`w-4 h-4 ${listing.hasSecurity ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Segurança: {listing.hasSecurity ? '24h / Protegido' : 'Normal'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>Documentos: {listing.declaredDocumentation || 'Regulares'}</span>
              </div>
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div>
            <h4 className="text-base font-extrabold text-slate-900 mb-2">Sobre este Imóvel</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Rodapé Fixo do Modal com Ações Rápidas */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Imóvel catalogado e verificado pelo Grupo BNG Moçambique</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a
              href="tel:+258841524822"
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-700" />
              <span>Ligar (84 152 4822)</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Agendar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
