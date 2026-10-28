import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListings, updateListingStatus } from '../services/supabase';
import { Listing, ListingStatus } from '../types';
import { 
  ArrowLeft, PlusCircle, AlertTriangle, CheckCircle, Clock, 
  Eye, MessageSquare, Edit3, Trash2, ArrowUpRight, ShieldAlert
} from 'lucide-react';

export const MyListingsScreen: React.FC = () => {
  const { navigateTo, currentUser, refreshTrigger, triggerRefresh } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const list = await fetchListings({ userId: currentUser.id || 'user-adv-1' });
        if (isMounted) setListings(list);
      } catch (err) {
        console.error('Erro ao carregar meus anúncios:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [currentUser.id, refreshTrigger]);

  const filtered = statusFilter === 'all' 
    ? listings 
    : listings.filter(l => l.status === statusFilter);

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'published':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Publicado</span></span>;
      case 'under_review':
      case 'submitted':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Em Análise</span></span>;
      case 'changes_requested':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><AlertTriangle className="w-3 h-3" /><span>Correcção Solicitada</span></span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1"><Trash2 className="w-3 h-3" /><span>Rejeitado</span></span>;
      case 'draft':
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Rascunho</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  const handleResubmitForReview = async (listingId: string) => {
    try {
      await updateListingStatus(listingId, 'under_review');
      setActionFeedback('Anúncio reenviado com sucesso para a moderação!');
      triggerRefresh();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-MZ').format(val);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 sm:pb-12">
      {/* Top Bar */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                Meus Anúncios
              </h1>
              <p className="text-[11px] text-[#C89B3C]">
                {listings.length} imóvel(is) cadastrado(s)
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('create')}
            className="flex items-center space-x-1.5 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-600 text-white text-xs text-center py-2 font-bold animate-pulse">
          {actionFeedback}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
        {/* Filtros de Status */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'published', label: 'Publicados' },
            { id: 'under_review', label: 'Em Análise' },
            { id: 'changes_requested', label: 'Requer Correcção' },
            { id: 'draft', label: 'Rascunhos' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                statusFilter === f.id
                  ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de Meus Anúncios */}
        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-32 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm my-6">
            <h3 className="font-extrabold text-slate-800 text-sm">Nenhum anúncio neste estado</h3>
            <p className="text-xs text-slate-500 mt-1">Crie um novo anúncio ou mude o filtro.</p>
            <button
              onClick={() => navigateTo('create')}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#14181B] text-[#C89B3C] text-xs font-bold"
            >
              Publicar Agora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video sm:aspect-square sm:w-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 sm:hidden">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Dados do Imóvel */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="hidden sm:flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {item.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Taxa: <strong>{item.feePayment?.status === 'confirmed' ? '150 MT Paga' : 'Em Verificação'}</strong>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.district}, {item.province} • {item.categoryName}
                    </p>

                    <div className="text-sm font-extrabold text-[#14181B] mt-1">
                      {formatPrice(item.price)} <span className="text-[#C89B3C] text-xs">MT</span>
                    </div>

                    {/* ALERTA DE CORRECÇÃO SOLICITADA PELO ADMIN */}
                    {item.status === 'changes_requested' && item.correctionMessage && (
                      <div className="mt-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-amber-950">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mensagem da Moderação do Grupo BNG:</span>
                        </div>
                        <p className="italic text-[11px] leading-relaxed">
                          "{item.correctionMessage}"
                        </p>
                        <button
                          onClick={() => handleResubmitForReview(item.id)}
                          className="mt-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Concluí a correcção — Reenviar para Moderação
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Métricas e Ações */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="flex items-center space-x-1" title="Visualizações">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{item.viewsCount || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1" title="Cliques no Contacto">
                        <MessageSquare className="w-3 h-3 text-slate-400" />
                        <span>{item.contactClicksCount || 0}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateTo('detail', { listingId: item.id })}
                        className="text-xs font-bold text-[#C89B3C] hover:underline flex items-center space-x-0.5"
                      >
                        <span>Ver Detalhes</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
