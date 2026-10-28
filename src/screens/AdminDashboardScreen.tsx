import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListings, fetchBanners, fetchPlatformConfig } from '../services/supabase';
import { Listing, Banner, PlatformConfig } from '../types';
import { AdminNavHeader } from '../components/AdminNavHeader';
import { 
  Building2, Clock, CheckCircle2, DollarSign, AlertTriangle, 
  ArrowRight, Settings, Image as ImageIcon, CreditCard, Megaphone,
  Check, ExternalLink, ShieldCheck, PlusCircle
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega todos os anúncios sem filtro de status para o admin
    fetchListings({}).then(res => {
      const raw = localStorage.getItem('bng_listings_v1');
      if (raw) {
        setAllListings(JSON.parse(raw));
      } else {
        setAllListings(res);
      }
      setLoading(false);
    });

    fetchBanners().then(setBanners);
    fetchPlatformConfig().then(setConfig);
  }, []);

  const totalListings = allListings.length;
  const underReviewListings = allListings.filter(l => l.status === 'under_review' || l.status === 'submitted');
  const pendingPayments = allListings.filter(l => l.feePayment?.status === 'proof_submitted' || l.feePayment?.status === 'under_verification');
  const publishedListings = allListings.filter(l => l.status === 'published');
  const soldListings = allListings.filter(l => l.isSold || l.status === 'completed');
  const totalRevenueMt = allListings.filter(l => l.feePayment?.status === 'confirmed').length * 150;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 sm:pb-12">
      {/* Top Admin Header Unificado e 100% Responsivo */}
      <AdminNavHeader currentTab="dashboard" pendingCount={underReviewListings.length} />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-4 space-y-4 sm:space-y-6">
        {/* Painel de Boas-vindas e Ações Rápidas Ultra-Responsivo */}
        <div className="bg-[#14181B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg border border-slate-800 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-black text-[#C89B3C] uppercase tracking-wider block">
                Controlo Central do Grupo BNG
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Olá, {currentUser.fullName || 'Administrador'}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-light max-w-lg leading-relaxed">
              Gestão de aprovações, imóveis, canais de 150 MT e publicidades ativas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => navigateTo('create')}
              className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-3 py-2 rounded-xl text-[11px] sm:text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5 col-span-2 sm:col-span-1"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span>+ Cadastrar Imóvel</span>
            </button>
            <button
              onClick={() => navigateTo('admin-listings')}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all border border-white/10 flex items-center justify-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
              <span>Gerir Imóveis</span>
            </button>
            <button
              onClick={() => navigateTo('admin-settings')}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all border border-white/10 flex items-center justify-center space-x-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
              <span>Pagamentos</span>
            </button>
            <button
              onClick={() => navigateTo('admin-banners')}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all border border-white/10 flex items-center justify-center space-x-1.5 col-span-2 sm:col-span-1"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
              <span>Banners Publicidade</span>
            </button>
          </div>
        </div>

        {/* KPIs Grid com layout vertical para caber 100% em telas pequenas (320px) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Total */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Anúncios
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{totalListings}</strong>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-1">Registados no sistema</span>
            </div>
          </div>

          {/* Card 2: Pendentes de Moderação */}
          <div 
            onClick={() => navigateTo('admin-listings')}
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#C89B3C] transition-colors"
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Fila Revisão
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xl sm:text-2xl font-black text-blue-700 leading-none">{underReviewListings.length}</strong>
              <span className="text-[9px] sm:text-[10px] text-blue-500 font-semibold block mt-1">
                {underReviewListings.length > 0 ? 'Exigem análise' : 'Tudo analisado'}
              </span>
            </div>
          </div>

          {/* Card 3: Aguardam Confirmação de 150 MT */}
          <div 
            onClick={() => navigateTo('admin-listings')}
            className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#C89B3C] transition-colors"
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Comprovativos
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xl sm:text-2xl font-black text-amber-600 leading-none">{pendingPayments.length}</strong>
              <span className="text-[9px] sm:text-[10px] text-amber-600 font-semibold block mt-1">Taxas 150 MT</span>
            </div>
          </div>

          {/* Card 4: Receita */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Receita Taxas
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2">
              <strong className="text-xl sm:text-2xl font-black text-emerald-700 leading-none">
                {new Intl.NumberFormat('pt-MZ').format(totalRevenueMt)} <span className="text-[11px] font-bold">MT</span>
              </strong>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block mt-1">Confirmadas</span>
            </div>
          </div>
        </div>

        {/* Fila de Submissões Recentes que Requerem Ação */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Fila Imediata de Moderação e Comprovativos
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Anúncios aguardando conferência do pagamento de 150 MT e aprovação editorial
              </p>
            </div>
            <button
              onClick={() => navigateTo('admin-listings')}
              className="text-[11px] sm:text-xs font-bold text-[#C89B3C] hover:underline flex items-center space-x-1 shrink-0"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {underReviewListings.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
              <p className="font-bold text-slate-700">Tudo em dia!</p>
              <p className="text-[11px]">Nenhuma submissão pendente de moderação no momento.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {underReviewListings.slice(0, 5).map(item => (
                <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <img
                      src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-mono text-slate-400">Ref: {item.id}</span>
                        <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                          {item.status}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {item.feePayment?.paymentMethod ? `Via ${item.feePayment.paymentMethod.toUpperCase()}` : '150 MT'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-0.5 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                        {item.district}, {item.province} • {item.authorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => navigateTo('admin-listings')}
                      className="bg-[#14181B] text-[#C89B3C] px-3 py-1.5 rounded-xl text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      Analisar &amp; Moderar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Módulos de Gestão Rápida: Publicidades & Contas de Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Card Publicidades & Banners */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-black text-[#C89B3C] uppercase tracking-wider flex items-center space-x-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Publicidades no Portal</span>
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {banners.filter(b => b.isActive).length} Activos
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Banners e Destaques Comerciais
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Adicione, pause ou substitua os anúncios gráficos institucionais e publicidades de parceiros que aparecem no topo do portal.
              </p>

              {banners.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {banners.slice(0, 2).map((b) => (
                    <div key={b.id} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={b.mobileImageUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-800 truncate block">{b.title}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{b.shortText}</span>
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full ${b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {b.isActive ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('admin-banners')}
              className="mt-3 w-full bg-[#14181B] hover:bg-slate-800 text-[#C89B3C] font-extrabold text-xs py-2.5 rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Gerir Publicidades &amp; Banners</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Card Contas de Pagamento 150 MT */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-black text-[#C89B3C] uppercase tracking-wider flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Taxa de Publicação (150 MT)</span>
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {config?.paymentChannels?.filter(c => c.isActive).length || 0} Canais Ativos
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Canais de Recebimento de Pagamento
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Altere os números de M-Pesa, e-Mola, contas bancárias e titular que os clientes visualizam ao pagar os 150 MT.
              </p>

              {config?.paymentChannels && (
                <div className="mt-3 space-y-1.5">
                  {config.paymentChannels.slice(0, 2).map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{ch.name}</span>
                        <span className="font-mono text-[11px] text-slate-600">{ch.accountNumber} ({ch.beneficiaryName})</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ch.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {ch.isActive ? 'Ativo' : 'Desativado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('admin-settings')}
              className="mt-3 w-full bg-[#14181B] hover:bg-slate-800 text-[#C89B3C] font-extrabold text-xs py-2.5 rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Configurar Contas &amp; Pagamentos</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
