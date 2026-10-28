import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  fetchListings, 
  updateListingStatus, 
  verifyPayment, 
  deleteListing, 
  toggleListingSold, 
  updateListing,
  broadcastGlobalAnnouncement
} from '../services/supabase';
import { Listing, ListingStatus, TransactionType } from '../types';
import { AdminNavHeader } from '../components/AdminNavHeader';
import { 
  CheckCircle2, XCircle, AlertTriangle, Eye, DollarSign, 
  Search, ShieldCheck, Edit3, Trash2, Tag, Maximize2, X,
  Save, Building, Check, ArrowRight, MapPin, PlusCircle
} from 'lucide-react';

export const AdminListingsScreen: React.FC = () => {
  const { navigateTo, triggerRefresh, refreshTrigger } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal de Ação / Moderação Detalhada
  const [activeModalListing, setActiveModalListing] = useState<Listing | null>(null);
  const [correctionMsg, setCorrectionMsg] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [modalMode, setModalMode] = useState<'view' | 'correct' | 'reject'>('view');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal de Edição Rápida
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    price: number;
    description: string;
    neighborhood: string;
    district: string;
    province: string;
    categoryName: string;
    transactionType: TransactionType;
    isSold: boolean;
  }>({
    title: '',
    price: 0,
    description: '',
    neighborhood: '',
    district: '',
    province: 'Maputo Cidade',
    categoryName: 'Casas e Moradias',
    transactionType: 'sale',
    isSold: false
  });

  // Modal de Zoom / Lightbox do Comprovativo
  const [lightboxProofUrl, setLightboxProofUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    // Para admin, lemos diretamente do armazenamento persistente
    const raw = localStorage.getItem('bng_listings_v1');
    if (raw) {
      const parsed: Listing[] = JSON.parse(raw);
      if (isMounted) {
        setListings(parsed);
        setLoading(false);
      }
    } else {
      fetchListings({}).then(res => {
        if (isMounted) {
          setListings(res);
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const underReviewCount = listings.filter(l => l.status === 'under_review' || l.status === 'submitted').length;

  const filtered = listings.filter(l => {
    // Busca textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = l.title.toLowerCase().includes(q) ||
        (l.neighborhood || '').toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.authorName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Filtros de estado
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'under_review') return l.status === 'under_review' || l.status === 'submitted';
    if (selectedFilter === 'pending_payment') return l.feePayment?.status === 'proof_submitted' || l.feePayment?.status === 'under_verification';
    if (selectedFilter === 'published') return l.status === 'published' && !l.isSold;
    if (selectedFilter === 'sold') return l.isSold || l.status === 'completed';
    return l.status === selectedFilter;
  });

  // Ação: Confirmar Pagamento 150 MT
  const handleConfirmPayment = async (listingId: string) => {
    try {
      await verifyPayment(listingId, 'confirmed', 'Pagamento de 150 MT confirmado pelo administrador.');
      await broadcastGlobalAnnouncement('✅ Taxa de 150 MT Confirmada!', 'O pagamento da taxa de publicação foi validado pelo Grupo BNG.', 'payment_confirmed');
      setFeedback('Pagamento de 150 MT confirmado com sucesso!');
      triggerRefresh();
      if (activeModalListing && activeModalListing.id === listingId) {
        setActiveModalListing({
          ...activeModalListing,
          feePayment: { ...activeModalListing.feePayment, status: 'confirmed' }
        });
      }
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Ação: Marcar / Desmarcar como Vendido (Selo Vermelho Público)
  const handleToggleSold = async (listingId: string, isSold: boolean) => {
    try {
      await toggleListingSold(listingId, isSold);
      if (isSold) {
        await broadcastGlobalAnnouncement('🏷️ Imóvel Marcado como VENDIDO!', 'O selo de vendido foi aplicado e já está visível para dar mais autoridade ao portal.', 'promo');
      }
      setFeedback(isSold ? 'Imóvel marcado como VENDIDO com selo vermelho visível no portal!' : 'Selo de Vendido removido. Imóvel volta a estar disponível.');
      triggerRefresh();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o estado de vendido.');
    }
  };

  // Ação: Iniciar Edição
  const startEdit = (item: Listing) => {
    setEditingListing(item);
    setEditForm({
      title: item.title,
      price: item.price,
      description: item.description,
      neighborhood: item.neighborhood || '',
      district: item.district,
      province: item.province,
      categoryName: item.categoryName || 'Casas e Moradias',
      transactionType: item.transactionType,
      isSold: Boolean(item.isSold || item.status === 'completed')
    });
  };

  // Ação: Guardar Edição
  const handleSaveEdit = async () => {
    if (!editingListing) return;
    try {
      const updates: Partial<Listing> = {
        title: editForm.title.trim(),
        price: Number(editForm.price),
        description: editForm.description.trim(),
        neighborhood: editForm.neighborhood.trim(),
        district: editForm.district.trim(),
        province: editForm.province,
        categoryName: editForm.categoryName,
        transactionType: editForm.transactionType,
        isSold: editForm.isSold,
        status: editForm.isSold ? 'completed' : (editingListing.status === 'completed' ? 'published' : editingListing.status)
      };

      await updateListing(editingListing.id, updates);
      setFeedback(`Imóvel "${updates.title}" atualizado com sucesso!`);
      setEditingListing(null);
      triggerRefresh();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar as alterações do imóvel.');
    }
  };

  // Ação: Confirmar e Executar Eliminação de Imóvel (Sem bloqueio de window.confirm)
  const executeDeleteListing = async () => {
    if (!deletingListing) return;
    const targetId = deletingListing.id;
    const targetTitle = deletingListing.title;
    try {
      // Remove imediatamente da interface local
      setListings(prev => prev.filter(l => l.id !== targetId));
      await deleteListing(targetId);
      setDeletingListing(null);
      setFeedback(`Anúncio "${targetTitle}" eliminado permanentemente!`);
      triggerRefresh();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Erro ao eliminar o anúncio.');
    }
  };

  // Ação: Aprovar e Publicar
  const handleApproveAndPublish = async (listingId: string) => {
    try {
      const target = listings.find(l => l.id === listingId);
      if (target?.feePayment?.status !== 'confirmed') {
        alert('Atenção: Confirme o pagamento da taxa de 150 MT antes de aprovar a publicação pública.');
        return;
      }
      await updateListingStatus(listingId, 'published');
      await broadcastGlobalAnnouncement(
        '🎉 Imóvel Aprovado e Publicado!',
        `O anúncio "${target?.title || ''}" está agora visível no catálogo oficial do Grupo BNG.`,
        'listing_published',
        'detail',
        listingId
      );
      setFeedback('Anúncio Aprovado e Publicado com Sucesso!');
      triggerRefresh();
      setActiveModalListing(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Ação: Solicitar Correcções
  const handleRequestCorrections = async () => {
    if (!activeModalListing || !correctionMsg.trim()) {
      alert('Por favor, escreva a instrução de correcção para o anunciante.');
      return;
    }
    try {
      await updateListingStatus(activeModalListing.id, 'changes_requested', {
        correctionMessage: correctionMsg.trim()
      });
      await broadcastGlobalAnnouncement(
        '⚠️ Anúncio Requer Correcções',
        `O anúncio "${activeModalListing.title}" necessita de correções pelo anunciante.`,
        'system'
      );
      setFeedback('Pedido de correcções enviado ao anunciante com sucesso!');
      triggerRefresh();
      setActiveModalListing(null);
      setCorrectionMsg('');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Ação: Rejeitar Anúncio
  const handleRejectListing = async () => {
    if (!activeModalListing || !rejectionReason.trim()) {
      alert('Por favor, indique o motivo da rejeição do anúncio.');
      return;
    }
    try {
      await updateListingStatus(activeModalListing.id, 'rejected', {
        rejectionReason: rejectionReason.trim()
      });
      setFeedback('Anúncio rejeitado com justificativa.');
      triggerRefresh();
      setActiveModalListing(null);
      setRejectionReason('');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Ação: Suspender Anúncio
  const handleSuspendListing = async (listingId: string) => {
    try {
      await updateListingStatus(listingId, 'suspended');
      setFeedback('Anúncio suspenso da visualização pública.');
      triggerRefresh();
      if (activeModalListing) setActiveModalListing(null);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-MZ').format(val);

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 sm:pb-12">
      {/* Top Admin Header 100% Responsivo e Unificado */}
      <AdminNavHeader currentTab="listings" pendingCount={underReviewCount} />

      {/* Subheader com Filtros e Pesquisa */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              Gestão de Imóveis, Moderação e Selos
            </h1>
            <p className="text-[11px] text-[#C89B3C]">
              Edite, elimine anúncios, valide os 150 MT com comprovativo e marque imóveis como VENDIDO
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={() => navigateTo('create')}
              className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center space-x-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Cadastrar Imóvel</span>
            </button>
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por título, ref, bairro..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-600 text-white text-xs text-center py-2.5 font-bold shadow-md animate-pulse">
          {feedback}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 space-y-4">
        {/* Filtros em Abas Pílula 100% Responsivas */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'Todos os Registos' },
            { id: 'under_review', label: `Fila Moderação (${underReviewCount})` },
            { id: 'pending_payment', label: 'Comprovativos 150 MT' },
            { id: 'published', label: 'Publicados Ativos' },
            { id: 'sold', label: '🏷️ Vendidos (Selo Vermelho)' },
            { id: 'changes_requested', label: 'Correcção Solicitada' },
            { id: 'suspended', label: 'Suspensos' },
            { id: 'rejected', label: 'Rejeitados' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedFilter === f.id
                  ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C] shadow-sm ring-1 ring-[#C89B3C]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de Registos */}
        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-32 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm my-6">
            <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-extrabold text-slate-800 text-sm">Nenhum anúncio encontrado</h3>
            <p className="text-xs text-slate-500 mt-1">Experimente mudar o filtro de pesquisa ou a categoria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => {
              const isItemSold = Boolean(item.isSold || item.status === 'completed');
              const hasProof = Boolean(item.feePayment?.proofFileUrl);
              const isPaymentConfirmed = item.feePayment?.status === 'confirmed';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border shadow-sm transition-all ${
                    isItemSold ? 'border-red-200 bg-red-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Imagem + Dados do Imóvel */}
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="relative shrink-0">
                        <img
                          src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                          alt=""
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200"
                        />
                        {isItemSold && (
                          <div className="absolute -top-1.5 -left-1.5 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-white">
                            VENDIDO
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[10px] text-slate-400">Ref: {item.id}</span>
                          
                          {/* Selo Vermelho VENDIDO */}
                          {isItemSold ? (
                            <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                              VENDIDO
                            </span>
                          ) : (
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                              item.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'changes_requested' ? 'bg-amber-100 text-amber-800' :
                              item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.status}
                            </span>
                          )}

                          {/* Tipo */}
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                            {item.categoryName || 'Imóvel'} • {item.transactionType === 'rent' ? 'Arrendamento' : 'Venda'}
                          </span>

                          {/* Estado 150 MT */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaymentConfirmed 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            150 MT: {isPaymentConfirmed ? 'Confirmado ✓' : 'Aguardando Verificação'}
                          </span>
                        </div>

                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.neighborhood ? `${item.neighborhood}, ` : ''}{item.district}, {item.province}</span>
                          <span>•</span>
                          <strong className="text-slate-900">{formatPrice(item.price)} MT</strong>
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Anunciante: <strong>{item.authorName}</strong> ({item.authorPhone})
                        </p>
                      </div>
                    </div>

                    {/* Botões de Ação do Admin */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                      {/* Botão de Selo Vendido */}
                      {isItemSold ? (
                        <button
                          onClick={() => handleToggleSold(item.id, false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                          title="Remover selo de vendido para que volte a ficar disponível no portal"
                        >
                          Desmarcar Vendido
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleSold(item.id, true)}
                          className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center space-x-1"
                          title="Colocar o selo público de VENDIDO neste imóvel"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Marcar VENDIDO</span>
                        </button>
                      )}

                      {/* Botão de Edição Rápida */}
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-[#C89B3C] shadow-sm transition-all flex items-center space-x-1"
                        title="Editar título, preço, localização e detalhes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {/* Botão de Eliminar (Abre Modal Próprio) */}
                      <button
                        onClick={() => setDeletingListing(item)}
                        className="p-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors shadow-sm active:scale-95"
                        title="Eliminar este anúncio permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Botão de Moderação Editorial Completa */}
                      <button
                        onClick={() => {
                          setActiveModalListing(item);
                          setModalMode('view');
                        }}
                        className="bg-[#14181B] text-[#C89B3C] px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow"
                      >
                        Moderar
                      </button>
                    </div>
                  </div>

                  {/* BLOCO DO COMPROVATIVO DE 150 MT DIRETAMENTE NO CARD */}
                  {(hasProof || item.feePayment?.referenceCode) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-amber-50/60 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        {hasProof ? (
                          <div 
                            onClick={() => setLightboxProofUrl(item.feePayment!.proofFileUrl!)}
                            className="relative cursor-pointer group shrink-0"
                          >
                            <img
                              src={item.feePayment!.proofFileUrl!}
                              alt="Comprovativo"
                              className="w-14 h-14 rounded-xl object-cover border border-amber-300 group-hover:opacity-80 transition-opacity bg-white"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                            SEM FOTO
                          </div>
                        )}

                        <div className="text-xs">
                          <span className="font-extrabold text-amber-950 block">
                            Taxa de Publicação (150 MT) • {item.feePayment?.paymentMethod?.toUpperCase() || 'M-PESA'}
                          </span>
                          <span className="text-slate-600 font-mono text-[11px] block">
                            Ref: <strong>{item.feePayment?.referenceCode || 'Sem código'}</strong>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Estado: {isPaymentConfirmed ? '✓ Pagamento validado' : '⚠️ Aguarda conferência bancária/carteira'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        {hasProof && (
                          <button
                            onClick={() => setLightboxProofUrl(item.feePayment!.proofFileUrl!)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-amber-300 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
                            <span>Ver Comprovativo</span>
                          </button>
                        )}

                        {!isPaymentConfirmed && (
                          <button
                            onClick={() => handleConfirmPayment(item.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-sm flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirmar 150 MT</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO RÁPIDA DE IMÓVEL */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Ref: {editingListing.id}</span>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Editar Dados do Imóvel
                </h3>
              </div>
              <button
                onClick={() => setEditingListing(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full text-sm font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Anúncio</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço (MT)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Negócio</label>
                  <select
                    value={editForm.transactionType}
                    onChange={(e) => setEditForm({ ...editForm, transactionType: e.target.value as TransactionType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  >
                    <option value="sale">Venda</option>
                    <option value="rent">Arrendamento</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria do Imóvel</label>
                  <select
                    value={editForm.categoryName}
                    onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  >
                    <option value="Casas e Moradias">Casas e Moradias</option>
                    <option value="Apartamentos">Apartamentos</option>
                    <option value="Terrenos e Parcelas">Terrenos e Parcelas</option>
                    <option value="Comerciais e Armazéns">Comerciais e Armazéns</option>
                    <option value="Escritórios">Escritórios</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Província</label>
                  <select
                    value={editForm.province}
                    onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  >
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala">Sofala</option>
                    <option value="Manica">Manica</option>
                    <option value="Tete">Tete</option>
                    <option value="Zambézia">Zambézia</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado">Cabo Delgado</option>
                    <option value="Niassa">Niassa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distrito / Município</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={editForm.neighborhood}
                    onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              {/* Toggle Selo VENDIDO */}
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-red-950 block text-xs">
                    🏷️ Marcar como VENDIDO (Selo Vermelho Público)
                  </span>
                  <span className="text-[11px] text-red-800">
                    Exibe a faixa vermelha de vendido no portal público para gerar autoridade e credibilidade.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isSold}
                  onChange={(e) => setEditForm({ ...editForm, isSold: e.target.checked })}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setEditingListing(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 font-semibold hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] text-xs font-black shadow transition-all flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE ELIMINAÇÃO (SEM BLOQUEIO DO NAVEGADOR) */}
      {deletingListing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                Eliminar Anúncio Definitivamente?
              </h3>
              <p className="text-xs text-slate-600">
                Tem a certeza que deseja remover o imóvel:
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left">
                <span className="font-bold text-slate-900 block text-xs truncate">{deletingListing.title}</span>
                <span className="text-[11px] text-slate-500 font-mono">Ref: {deletingListing.id} • {deletingListing.district}, {deletingListing.province}</span>
              </div>
              <p className="text-[11px] text-red-600 font-medium">
                ⚠️ Esta ação não pode ser desfeita e removerá o anúncio do portal e da base de dados.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeletingListing(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeDeleteListing}
                className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ZOOM / LIGHTBOX DO COMPROVATIVO */}
      {lightboxProofUrl && (
        <div 
          onClick={() => setLightboxProofUrl(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-3xl p-3 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setLightboxProofUrl(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxProofUrl}
              alt="Comprovativo em alta resolução"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 text-center text-xs text-slate-300">
              Comprovativo de Pagamento de 150 MT • Clique fora para fechar
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMPLETO DE MODERAÇÃO E VERIFICAÇÃO */}
      {activeModalListing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Ref: {activeModalListing.id}</span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {activeModalListing.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalListing(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* SEÇÃO FINANCEIRA: Taxa de 150 MT e Comprovativo */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-[#C89B3C]" />
                  <span>Taxa de Publicação (150 MT)</span>
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  activeModalListing.feePayment?.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {activeModalListing.feePayment?.status === 'confirmed' ? 'CONFIRMADO' : 'PENDENTE DE CONFERÊNCIA'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Método Utilizado:</span>{' '}
                  <strong className="text-slate-900 uppercase">{activeModalListing.feePayment?.paymentMethod || 'M-Pesa'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Código de Referência:</span>{' '}
                  <strong className="font-mono text-slate-900">{activeModalListing.feePayment?.referenceCode || 'N/A'}</strong>
                </div>
              </div>

              {activeModalListing.feePayment?.proofFileUrl && (
                <div className="mt-2 pt-2 border-t border-amber-200/60">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Comprovativo Anexado pelo Anunciante (Clique para ampliar):
                  </span>
                  <div
                    onClick={() => setLightboxProofUrl(activeModalListing.feePayment!.proofFileUrl!)}
                    className="inline-block relative rounded-xl overflow-hidden border border-slate-300 max-h-40 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={activeModalListing.feePayment.proofFileUrl}
                      alt="Comprovativo de Pagamento"
                      className="max-h-40 object-contain bg-black/5"
                    />
                  </div>
                </div>
              )}

              {activeModalListing.feePayment?.status !== 'confirmed' && (
                <button
                  onClick={() => handleConfirmPayment(activeModalListing.id)}
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl transition-colors shadow"
                >
                  ✓ Confirmar Pagamento de 150 MT (Após Verificação)
                </button>
              )}
            </div>

            {/* FOTOGRAFIAS DO ANÚNCIO */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Fotografias Submetidas ({activeModalListing.photos.length}):
              </span>
              <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {activeModalListing.photos.map(p => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt=""
                    className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                ))}
              </div>
            </div>

            {/* DADOS E CONTACTOS */}
            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><strong>Localização:</strong> {activeModalListing.neighborhood}, {activeModalListing.district}, {activeModalListing.province}</p>
              <p><strong>Preço:</strong> {formatPrice(activeModalListing.price)} MT ({activeModalListing.paymentConditions.planType === 'installments' ? 'Prestações' : 'Integral'})</p>
              <p><strong>Anunciante:</strong> {activeModalListing.authorName} ({activeModalListing.authorPhone} / WhatsApp: {activeModalListing.authorWhatsapp})</p>
              <p className="line-clamp-2"><strong>Descrição:</strong> {activeModalListing.description}</p>
            </div>

            {/* FORMULÁRIO DE CORRECÇÃO / REJEIÇÃO */}
            {modalMode === 'correct' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900">
                  Escreva a mensagem de correcção para o anunciante:
                </label>
                <textarea
                  rows={3}
                  value={correctionMsg}
                  onChange={(e) => setCorrectionMsg(e.target.value)}
                  placeholder="Ex: Por favor envie fotografias mais nítidas da fachada e do interior..."
                  className="w-full p-2 bg-white border border-amber-200 rounded-xl text-xs font-medium"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setModalMode('view')}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-600 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRequestCorrections}
                    className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
                  >
                    Enviar Pedido de Correcção
                  </button>
                </div>
              </div>
            )}

            {modalMode === 'reject' && (
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                <label className="block text-xs font-bold text-red-900">
                  Indique o motivo formal da rejeição:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: Anúncio duplicado ou documentação em desacordo com as regras do Grupo BNG..."
                  className="w-full p-2 bg-white border border-red-200 rounded-xl text-xs font-medium"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setModalMode('view')}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-600 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRejectListing}
                    className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    Confirmar Rejeição
                  </button>
                </div>
              </div>
            )}

            {/* BOTÕES DE DECISÃO EDITORIAL */}
            {modalMode === 'view' && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setModalMode('reject')}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                >
                  Rejeitar Anúncio
                </button>
                <button
                  onClick={() => setModalMode('correct')}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                >
                  Solicitar Correcções
                </button>
                <button
                  onClick={() => handleApproveAndPublish(activeModalListing.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow transition-colors flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprovar e Publicar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
