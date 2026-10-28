import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchBanners, saveBanners, uploadToStorage } from '../services/supabase';
import { Banner } from '../types';
import { AdminNavHeader } from '../components/AdminNavHeader';
import { openExternalUrl } from '../services/nativeBridge';
import { 
  Plus, Trash2, Save, Eye, MousePointerClick, 
  Upload, Link as LinkIcon, ExternalLink, Image as ImageIcon,
  CheckCircle2, Sparkles, AlertCircle
} from 'lucide-react';

export const AdminBannersScreen: React.FC = () => {
  const { navigateTo, triggerRefresh } = useApp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners().then(setBanners);
  }, []);

  const handleSave = async () => {
    try {
      // Normaliza URLs externas para garantir https:// se o utilizador digitou www.dominio.com ou apenas dominio.com
      const cleaned = banners.map(b => {
        let link = (b.linkUrl || '').trim();
        if (
          link && 
          !link.startsWith('http://') && 
          !link.startsWith('https://') && 
          !link.startsWith('tel:') && 
          !link.startsWith('mailto:') && 
          !link.startsWith('detail:')
        ) {
          if (link.startsWith('wa.me')) {
            link = `https://${link}`;
          } else if (link.includes('.') || link.startsWith('www.')) {
            link = `https://${link}`;
          }
        }
        return { ...b, linkUrl: link };
      });
      setBanners(cleaned);
      await saveBanners(cleaned);
      setFeedback('✓ Banners e links publicitários guardados com sucesso no Grupo BNG!');
      triggerRefresh();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      setFeedback('Erro ao guardar alterações. Tente novamente.');
    }
  };

  const handleToggleActive = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleRemove = (id: string) => {
    if (confirm('Tem a certeza que deseja remover este banner de publicidade?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleAdd = () => {
    const newB: Banner = {
      id: `ban-${Date.now()}`,
      title: 'Nova Campanha Grupo BNG',
      shortText: 'Compre, venda e arrenda com a segurança e garantia do Grupo BNG.',
      ctaText: 'Explorar Imóveis',
      linkUrl: 'https://wa.me/258880096995',
      mobileImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true,
      priority: banners.length + 1,
      impressionsCount: 0,
      clicksCount: 0
    };
    setBanners([newB, ...banners]);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, bannerId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBannerId(bannerId);
    try {
      const publicUrl = await uploadToStorage(file, 'banners');
      setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, mobileImageUrl: publicUrl } : b));
      setFeedback('✓ Foto do banner carregada com sucesso! Clique em "Guardar Alterações" para publicar.');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Erro no upload do banner:', err);
      alert('Erro ao carregar a imagem do banner. Tente novamente.');
    } finally {
      setUploadingBannerId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 sm:pb-12">
      {/* Top Admin Header Unificado e 100% Responsivo */}
      <AdminNavHeader currentTab="banners" />

      {/* Action Subheader */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-inner">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              Gestão de Publicidades e Banners
            </h1>
            <p className="text-[11px] text-[#C89B3C]">
              Upload direto de fotos e configuração de links de destino para direcionar clientes
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAdd}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-white/10 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Novo Banner</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] px-4 py-1.5 rounded-xl font-black text-xs shadow-md flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-600 text-white text-xs text-center py-2.5 px-4 font-bold shadow animate-in fade-in sticky top-14 z-30 flex items-center justify-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-5">
        {banners.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-sm">Nenhum banner cadastrado</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Clique no botão "Novo Banner" para carregar fotos promocionais e configurar links de redirecionamento.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Adicionar Primeiro Banner
            </button>
          </div>
        ) : (
          banners.map((b, idx) => (
            <div key={b.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-xl bg-[#14181B] text-[#C89B3C] font-black text-xs flex items-center justify-center shadow-sm">
                    #{idx + 1}
                  </span>
                  <span className="font-black text-sm text-slate-900">{b.title}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={b.isActive}
                      onChange={() => handleToggleActive(b.id)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span>Ativo na Página Inicial</span>
                  </label>
                  <button
                    onClick={() => handleRemove(b.id)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Remover Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Pré-visualização da Imagem com Upload Direto */}
                <div className="space-y-2">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 relative group border border-slate-200 shadow-inner">
                    <img src={b.mobileImageUrl} alt="" className="w-full h-full object-cover" />
                    
                    {/* Overlay do Banner na Pré-visualização */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white text-xs pointer-events-none">
                      <span className="font-bold line-clamp-1">{b.title}</span>
                      <span className="text-[10px] text-slate-300 line-clamp-1">{b.shortText}</span>
                      <span className="mt-1 inline-flex items-center space-x-1 text-[9px] font-bold text-[#C89B3C]">
                        <span>{b.ctaText || 'Explorar'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    {/* Botão Hover de Upload sobre a Imagem */}
                    <label
                      htmlFor={`banner-file-${b.id}`}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-3 text-center"
                    >
                      <Upload className="w-6 h-6 text-[#C89B3C] mb-1.5" />
                      <span className="text-xs font-black">Fazer Upload de Foto</span>
                      <span className="text-[10px] text-slate-300">Clique para escolher imagem</span>
                    </label>

                    {/* Indicador de carregamento */}
                    {uploadingBannerId === b.id && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-20">
                        <div className="w-6 h-6 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs font-bold text-amber-300">A enviar foto...</span>
                      </div>
                    )}
                  </div>

                  {/* Input File Oculto e Botão de Ação Claro */}
                  <input
                    type="file"
                    id={`banner-file-${b.id}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadImage(e, b.id)}
                  />

                  <button
                    type="button"
                    onClick={() => document.getElementById(`banner-file-${b.id}`)?.click()}
                    disabled={uploadingBannerId === b.id}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-[#C89B3C] font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingBannerId === b.id ? 'A enviar imagem...' : 'Carregar Nova Foto (Upload)'}</span>
                  </button>
                </div>

                {/* Campos de Edição e Configuração do CTA com Link */}
                <div className="md:col-span-2 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Título do Anúncio</label>
                    <input
                      type="text"
                      value={b.title}
                      placeholder="Ex: Soluções Imobiliárias de Excelência"
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].title = e.target.value;
                        setBanners(updated);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Texto Descritivo Curto</label>
                    <input
                      type="text"
                      value={b.shortText}
                      placeholder="Ex: Compre, venda e arrende com a segurança e garantia do Grupo BNG."
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].shortText = e.target.value;
                        setBanners(updated);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
                    />
                  </div>

                  {/* Configuração do CTA: Texto e Link de Destino */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Texto do Botão (CTA)
                      </label>
                      <input
                        type="text"
                        value={b.ctaText}
                        placeholder="Ex: Explorar Imóveis ou Falar no WhatsApp"
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[idx].ctaText = e.target.value;
                          setBanners(updated);
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Link de Destino do CTA (Onde Direcionar)
                        </label>
                        {b.linkUrl && b.linkUrl.trim() && (
                          <button
                            type="button"
                            onClick={() => openExternalUrl(b.linkUrl)}
                            className="text-[10px] font-bold text-[#C89B3C] hover:underline inline-flex items-center space-x-1"
                            title="Clique para testar a abertura do link"
                          >
                            <span>Testar Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={b.linkUrl || ''}
                          placeholder="Ex: www.mozvita.online ou https://wa.me/258..."
                          onChange={(e) => {
                            const updated = [...banners];
                            updated[idx].linkUrl = e.target.value;
                            setBanners(updated);
                          }}
                          className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
                        />
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* URL Manual da Imagem (opcional para links externos) */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      URL da Imagem (Preenchido automaticamente ao fazer upload ou colar link direto)
                    </label>
                    <input
                      type="text"
                      value={b.mobileImageUrl}
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].mobileImageUrl = e.target.value;
                        setBanners(updated);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px]"
                    />
                  </div>

                  {/* Métricas e Informativo do Link */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.impressionsCount} impressões</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.clicksCount} cliques</span>
                      </span>
                    </div>

                    {b.linkUrl && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono flex items-center space-x-1">
                        <span>Direciona para: {b.linkUrl.length > 25 ? b.linkUrl.substring(0, 25) + '...' : b.linkUrl}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
