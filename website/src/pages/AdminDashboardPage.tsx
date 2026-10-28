import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Megaphone, 
  CreditCard, 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Tag, 
  Edit3, 
  Save, 
  ExternalLink, 
  Plus, 
  Check, 
  X,
  MapPin
} from 'lucide-react';
import { Listing } from '../types';
import { 
  WebsiteUser, 
  fetchAllAdminListings, 
  deleteWebsiteListing, 
  updateWebsiteListingStatus,
  fetchWebsiteBanners,
  saveWebsiteBanners,
  fetchWebsitePlatformConfig,
  saveWebsitePlatformConfig
} from '../services/supabase';

interface AdminDashboardPageProps {
  currentUser: WebsiteUser | null;
  onOpenPublish: () => void;
  onSelectListing: (listing: Listing) => void;
  onNavigateHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  onOpenPublish,
  onSelectListing,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'banners' | 'settings'>('dashboard');
  const [listings, setListings] = useState<Listing[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [platformConfig, setPlatformConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filtros de Imóveis
  const [listingsFilter, setListingsFilter] = useState<'all' | 'under_review' | 'published' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Novo Banner Form
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImg, setNewBannerImg] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('imobiliario');

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, bans, cfg] = await Promise.all([
        fetchAllAdminListings(),
        fetchWebsiteBanners(),
        fetchWebsitePlatformConfig()
      ]);
      setListings(items);
      setBanners(bans);
      setPlatformConfig(cfg);
    } catch (err) {
      console.error('Erro ao carregar dados admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedbackMsg = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Ações de Imóveis
  const handleDeleteListing = async (id: string, title: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar o imóvel "${title}" do banco de dados Supabase?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteWebsiteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
      showFeedbackMsg(`✓ Imóvel "${title}" eliminado com sucesso!`);
    } catch (err: any) {
      showFeedbackMsg(`Erro ao eliminar: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleListingStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'under_review' : 'published';
    try {
      await updateWebsiteListingStatus(id, nextStatus);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: nextStatus as any } : l));
      showFeedbackMsg(`✓ Status atualizado para: ${nextStatus === 'published' ? 'Publicado' : 'Em Revisão'}`);
    } catch (err: any) {
      showFeedbackMsg(`Erro ao atualizar status: ${err.message}`);
    }
  };

  // Ações de Banners
  const handleToggleBannerActive = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleRemoveBanner = (id: string) => {
    if (!window.confirm('Tem a certeza que deseja remover este banner publicitário?')) return;
    setBanners(banners.filter(b => b.id !== id));
  };

  const handleAddBanner = () => {
    if (!newBannerTitle.trim() || !newBannerImg.trim()) {
      alert('Por favor informe o título e a imagem do banner.');
      return;
    }
    const newB = {
      id: `b-${Date.now()}`,
      title: newBannerTitle.trim(),
      shortText: 'Publicidade Oficial Grupo BNG',
      ctaText: 'Ver Mais',
      linkUrl: newBannerLink.trim() || 'imobiliario',
      desktopImageUrl: newBannerImg.trim(),
      mobileImageUrl: newBannerImg.trim(),
      isActive: true,
      priority: banners.length + 1
    };
    setBanners([newB, ...banners]);
    setNewBannerTitle('');
    setNewBannerImg('');
    showFeedbackMsg('✓ Banner adicionado! Clique em "Guardar Banners" para persistir no Supabase.');
  };

  const handleSaveBanners = async () => {
    try {
      await saveWebsiteBanners(banners);
      showFeedbackMsg('✓ Banners e links guardados com sucesso no Supabase!');
    } catch {
      showFeedbackMsg('Erro ao salvar banners.');
    }
  };

  // Ações de Configurações
  const handleSaveConfig = async () => {
    try {
      await saveWebsitePlatformConfig(platformConfig);
      showFeedbackMsg('✓ Configurações da plataforma guardadas com sucesso!');
    } catch {
      showFeedbackMsg('Erro ao guardar configurações.');
    }
  };

  // Contadores Estatísticos (Screenshot 2)
  const totalCount = listings.length;
  const underReviewCount = listings.filter(l => l.status === 'under_review' || l.status === 'submitted').length;
  const pendingProofsCount = listings.filter(l => l.feePayment?.status === 'proof_submitted').length;
  const confirmedPaymentsCount = listings.filter(l => l.feePayment?.status === 'confirmed' || l.status === 'published').length;
  const totalRevenueMt = confirmedPaymentsCount * (platformConfig?.listingFeeMt || 150);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (listingsFilter !== 'all') {
        if (listingsFilter === 'under_review' && item.status !== 'under_review' && item.status !== 'submitted') return false;
        if (listingsFilter === 'published' && item.status !== 'published') return false;
        if (listingsFilter === 'completed' && !item.isSold && item.status !== 'completed') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDistrict = item.district?.toLowerCase().includes(q);
        const matchesAuthor = item.authorName?.toLowerCase().includes(q);
        const matchesCode = (item.code || item.id)?.toLowerCase().includes(q);
        return matchesTitle || matchesDistrict || matchesAuthor || matchesCode;
      }
      return true;
    });
  }, [listings, listingsFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 sm:pb-16 flex flex-col">
      {/* Barra de Abas do Admin (Identico ao Screenshot 2) */}
      <div className="bg-[#14181B] border-b border-white/10 sticky top-[69px] z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#C89B3C] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'bg-[#C89B3C] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Imóveis</span>
              {underReviewCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {underReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'banners'
                  ? 'bg-[#C89B3C] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#C89B3C] text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Contas</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Recarregar Dados"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onOpenPublish}
              className="bg-[#C89B3C] hover:bg-[#B6882C] text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publicar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-4 sm:mt-6 space-y-5 flex-1 w-full">
        {/* Notificação de Feedback */}
        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* ========================================================
            ABA 1: VISÃO GERAL (IDENTICA AO SCREENSHOT 2)
            ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Cartão de Boas-vindas e Ações Rápidas (Screenshot 2) */}
            <div className="bg-[#14181B] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#C89B3C] uppercase tracking-wider block">
                    CONTROLO CENTRAL DO GRUPO BNG
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                    Olá, {currentUser?.fullName || 'Administrador LG Tecserv'}
                  </h2>
                </div>
                <p className="text-xs text-slate-300 font-light max-w-sm leading-relaxed sm:text-right">
                  Gestão de aprovações, imóveis, canais de 150 MT e publicidades ativas.
                </p>
              </div>

              {/* Botões Rápidos */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={onOpenPublish}
                  className="bg-[#C89B3C] hover:bg-[#B6882C] text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Cadastrar Imóvel</span>
                </button>

                <button
                  onClick={() => setActiveTab('listings')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/10"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Gerir Imóveis</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/10"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pagamentos</span>
                </button>

                <button
                  onClick={() => setActiveTab('banners')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/10"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Banners Publicidade</span>
                </button>
              </div>
            </div>

            {/* 4 Cartões de Métricas (Screenshot 2) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    TOTAL ANÚNCIOS
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
                  <span className="text-[10px] text-slate-400 font-medium">Registados no sistema</span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-[#C89B3C] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    FILA REVISÃO
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{underReviewCount}</p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {underReviewCount === 0 ? 'Tudo analisado' : 'Aguardando ação'}
                  </span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    COMPROVATIVOS
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">{pendingProofsCount}</p>
                  <span className="text-[10px] text-slate-400 font-medium">Taxas 150 MT</span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    RECEITA TAXAS
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                    {totalRevenueMt.toLocaleString()} <span className="text-xs font-bold text-slate-400">MT</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">Confirmadas</span>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Fila Imediata de Moderação e Comprovativos (Screenshot 2) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    Fila Imediata de Moderação e Comprovativos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Anúncios aguardando conferência do pagamento de 150 MT e aprovação editorial
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="text-xs text-[#C89B3C] font-bold hover:underline"
                >
                  Ver todos →
                </button>
              </div>

              {underReviewCount === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Tudo em dia!</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Nenhuma submissão pendente de moderação no momento.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {listings.filter(l => l.status === 'under_review' || l.status === 'submitted').map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400">{item.authorName} • {item.price.toLocaleString()} MT</span>
                      </div>
                      <button
                        onClick={() => handleToggleListingStatus(item.id, item.status)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                      >
                        Aprovar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 2: GESTÃO DE IMÓVEIS & MODERAÇÃO
            ======================================================== */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                <button
                  onClick={() => setListingsFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    listingsFilter === 'all' ? 'bg-[#14181B] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Todos ({totalCount})
                </button>
                <button
                  onClick={() => setListingsFilter('published')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    listingsFilter === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Ativos ({listings.filter(l => l.status === 'published').length})
                </button>
                <button
                  onClick={() => setListingsFilter('under_review')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    listingsFilter === 'under_review' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Em Revisão ({underReviewCount})
                </button>
                <button
                  onClick={() => setListingsFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    listingsFilter === 'completed' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Vendidos ({listings.filter(l => l.isSold || l.status === 'completed').length})
                </button>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por título, código..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                />
              </div>
            </div>

            {/* Tabela de Imóveis */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <th className="py-3 px-4">Imóvel</th>
                      <th className="py-3 px-4">Negócio</th>
                      <th className="py-3 px-4">Preço (MT)</th>
                      <th className="py-3 px-4">Localização</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredListings.map(item => {
                      const cover = item.photos?.[0]?.url || (item as any).coverPhoto || '/logo.png';
                      const isRent = (item.transactionType || item.purpose) === 'rent';
                      const isPub = item.status === 'published';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={cover}
                                alt={item.title}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                              />
                              <div>
                                <p className="font-bold text-slate-900 max-w-xs truncate">{item.title}</p>
                                <span className="text-[10px] text-slate-400">{item.categoryName || 'Casas'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isRent ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isRent ? 'Renda' : 'Venda'}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                            {item.price.toLocaleString()} MT
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            {item.district || item.province}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleListingStatus(item.id, item.status)}
                              title="Clique para alternar status"
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPub 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {isPub ? '● Ativo' : '● Em Revisão'}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => onSelectListing(item)}
                                title="Ver Detalhes"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#C89B3C]/20 hover:text-[#C89B3C] text-slate-600 transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteListing(item.id, item.title)}
                                disabled={deletingId === item.id}
                                title="Eliminar do Supabase"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 3: BANNERS DE PUBLICIDADE
            ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-5">
            {/* Adicionar Novo Banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">Adicionar Novo Banner Publicitário</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="Título do Banner (Ex: Grande Oportunidade)"
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                />
                <input
                  type="text"
                  value={newBannerImg}
                  onChange={(e) => setNewBannerImg(e.target.value)}
                  placeholder="URL da Imagem (Ex: https://images.unsplash.com/...)"
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                />
                <input
                  type="text"
                  value={newBannerLink}
                  onChange={(e) => setNewBannerLink(e.target.value)}
                  placeholder="Link Destino (Ex: imobiliario, contato)"
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddBanner}
                  className="bg-[#C89B3C] hover:bg-[#B6882C] text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Banner</span>
                </button>
              </div>
            </div>

            {/* Lista de Banners Atuais */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Banners Cadastrados ({banners.length})</h3>
                <button
                  onClick={handleSaveBanners}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Alterações</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                    <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
                      <img src={b.desktopImageUrl || b.mobileImageUrl} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center p-3 text-white">
                        <span className="font-bold text-xs truncate">{b.title}</span>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBannerActive(b.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {b.isActive ? '● Ativo' : '● Pausado'}
                        </button>
                        <span className="text-[10px] text-slate-400">Destino: {b.linkUrl}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveBanner(b.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 4: CONTAS & PAGAMENTOS (CONFIGURAÇÃO 150 MT)
            ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Configurações de Pagamento e Taxas</h3>
                <p className="text-xs text-slate-400">Contas oficiais para recepção da moderação de 150 MT</p>
              </div>
              <button
                onClick={handleSaveConfig}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Configurações</span>
              </button>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Valor da Taxa de Moderação de Anúncios (MT)
              </label>
              <input
                type="number"
                value={platformConfig?.listingFeeMt || 150}
                onChange={(e) => setPlatformConfig({ ...platformConfig, listingFeeMt: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold outline-none focus:border-[#C89B3C]"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700">Canais de Pagamento Oficiais</h4>
              <div className="space-y-3">
                {platformConfig?.paymentChannels?.map((ch: any, idx: number) => (
                  <div key={ch.id || idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{ch.name}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Número / Conta: <strong className="font-mono text-slate-700">{ch.accountNumber}</strong> • Titular: <strong>{ch.accountHolder}</strong>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Canal Ativo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
