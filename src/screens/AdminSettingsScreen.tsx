import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchPlatformConfig, savePlatformConfig, broadcastGlobalAnnouncement } from '../services/supabase';
import { PlatformConfig, PaymentChannelConfig, AppUpdateConfig } from '../types';
import { AdminNavHeader } from '../components/AdminNavHeader';
import { 
  Save, Plus, Trash2, CheckCircle2, ShieldAlert, CreditCard,
  Smartphone, Download, Bell, Send, ExternalLink, Sparkles, Link as LinkIcon
} from 'lucide-react';

export const AdminSettingsScreen: React.FC = () => {
  const { navigateTo, triggerRefresh } = useApp();
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    fetchPlatformConfig().then(cfg => {
      // Garante objeto de atualização com valores padrão caso não exista
      if (!cfg.appUpdate) {
        cfg.appUpdate = {
          isUpdateAvailable: false,
          versionName: '1.0.0',
          versionCode: 1,
          title: 'Nova Atualização do BNG Imóvel',
          message: 'Baixe a versão atualizada do BNG Imóvel para usufruir de novas funcionalidades e máxima performance.',
          downloadUrl: '',
          isMandatory: false,
          publishedAt: new Date().toISOString()
        };
      }
      setConfig(cfg);
    });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    try {
      await savePlatformConfig(config);
      setFeedback('✓ Configurações da plataforma guardadas com sucesso!');
      triggerRefresh();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback('Erro ao guardar configurações.');
    }
  };

  const handleChannelChange = (idx: number, field: keyof PaymentChannelConfig, value: any) => {
    if (!config) return;
    const channels = [...config.paymentChannels];
    channels[idx] = { ...channels[idx], [field]: value };
    setConfig({ ...config, paymentChannels: channels });
  };

  const handleAddChannel = () => {
    if (!config) return;
    const newCh: PaymentChannelConfig = {
      id: `ch-${Date.now()}`,
      name: 'Novo Canal (ex: M-Pesa / Banco)',
      accountNumber: 'Número / Conta [TESTE]',
      beneficiaryName: 'Grupo BNG Lda',
      instructions: 'Instruções para o utilizador no momento do pagamento.',
      isActive: true
    };
    setConfig({ ...config, paymentChannels: [...config.paymentChannels, newCh] });
  };

  const handleRemoveChannel = (idx: number) => {
    if (!config) return;
    const channels = config.paymentChannels.filter((_, i) => i !== idx);
    setConfig({ ...config, paymentChannels: channels });
  };

  const handleUpdateChange = (field: keyof AppUpdateConfig, value: any) => {
    if (!config) return;
    const currentUpdate = config.appUpdate || {
      isUpdateAvailable: false,
      versionName: '1.0.0',
      versionCode: 1,
      title: 'Nova Atualização do BNG Imóvel',
      message: '',
      downloadUrl: '',
      isMandatory: false
    };
    setConfig({
      ...config,
      appUpdate: {
        ...currentUpdate,
        [field]: value,
        publishedAt: new Date().toISOString()
      }
    });
  };

  const handleBroadcastUpdate = async () => {
    if (!config || !config.appUpdate) return;
    setBroadcasting(true);

    try {
      // 1. Ativa a atualização e salva configuração
      const updatedConfig: PlatformConfig = {
        ...config,
        appUpdate: {
          ...config.appUpdate,
          isUpdateAvailable: true,
          publishedAt: new Date().toISOString()
        }
      };
      setConfig(updatedConfig);
      await savePlatformConfig(updatedConfig);

      // 2. Dispara notificação com som e vibração para a central de alertas de todos os telemóveis
      await broadcastGlobalAnnouncement(
        `📲 ${updatedConfig.appUpdate?.title || 'Nova Versão do BNG Imóvel!'}`,
        updatedConfig.appUpdate?.message || 'Uma nova versão do aplicativo está pronta para download.',
        'system',
        undefined,
        undefined,
        true
      );

      triggerRefresh();
      setFeedback('✓ Aviso de nova atualização emitido com sucesso para todos os utilizadores!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      console.error(e);
      setFeedback('Erro ao emitir aviso de atualização.');
    } finally {
      setBroadcasting(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const appUpdate = config.appUpdate || {
    isUpdateAvailable: false,
    versionName: '1.0.0',
    versionCode: 1,
    title: 'Nova Atualização do BNG Imóvel',
    message: '',
    downloadUrl: '',
    isMandatory: false
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 sm:pb-12">
      {/* Top Admin Header Unificado e 100% Responsivo */}
      <AdminNavHeader currentTab="settings" />

      {/* Action Subheader */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-inner">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              Definições Gerais e Canais de Pagamento
            </h1>
            <p className="text-[11px] text-[#C89B3C]">
              Gestão de taxas, contas bancárias e avisos de novas versões do APK para os utilizadores
            </p>
          </div>

          <div className="flex items-center space-x-2">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        
        {/* ======================================================== */}
        {/* SEÇÃO NOVA: AVISO DE ATUALIZAÇÃO DO APK PARA UTILIZADORES */}
        {/* ======================================================== */}
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-300/80 shadow-md space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#C89B3C] flex items-center justify-center shadow">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight flex items-center space-x-1.5">
                  <span>Avisos de Nova Versão do APK (Atualização do App)</span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Emita um aviso oficial para todos os utilizadores baixarem a nova versão do BNG Imóvel
                </p>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={appUpdate.isUpdateAvailable}
                onChange={(e) => handleUpdateChange('isUpdateAvailable', e.target.checked)}
                className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
              />
              <span className="text-xs font-bold text-slate-800">
                {appUpdate.isUpdateAvailable ? 'Ativo no Aplicativo' : 'Desativado'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Versão do APK
              </label>
              <input
                type="text"
                placeholder="Ex: 1.1.0"
                value={appUpdate.versionName}
                onChange={(e) => handleUpdateChange('versionName', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
              />
              <span className="text-[10px] text-slate-400">Versão atual distribuída</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Título do Alerta aos Utilizadores
              </label>
              <input
                type="text"
                placeholder="Ex: Nova Versão do BNG Imóvel Disponível!"
                value={appUpdate.title}
                onChange={(e) => handleUpdateChange('title', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Link Próprio de Download do Novo APK (Obrigatório)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: https://meuservidor.com/BNG_Imovel.apk ou link do Google Drive / Mediafire / Play Store"
                value={appUpdate.downloadUrl}
                onChange={(e) => handleUpdateChange('downloadUrl', e.target.value)}
                className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
              />
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Ao clicar em "Baixar Nova Versão", o utilizador será direcionado imediatamente para este endereço para transferir o ficheiro.
            </p>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Mensagem de Atualização / O que há de novo
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Atualize agora para ter acesso a maior velocidade, novos filtros de imóveis e notificações sonoras instantâneas."
              value={appUpdate.message}
              onChange={(e) => handleUpdateChange('message', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#C89B3C]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={appUpdate.isMandatory}
                onChange={(e) => handleUpdateChange('isMandatory', e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span>Atualização Obrigatória (impede o uso do app até atualizar)</span>
            </label>

            <button
              onClick={handleBroadcastUpdate}
              disabled={broadcasting || !appUpdate.downloadUrl}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                !appUpdate.downloadUrl 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-[#C89B3C]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? 'A emitir aviso...' : 'Emitir Notificação & Publicar Atualização'}</span>
            </button>
          </div>
        </div>

        {/* Parâmetros Gerais */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            Parâmetros de Taxa e Publicação
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Taxa de Publicação (Meticais MT)
              </label>
              <input
                type="number"
                value={config.publicationFeeMt}
                onChange={(e) => setConfig({ ...config, publicationFeeMt: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Padrão oficial: 150 MT</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Mínimo de Fotos Obrigatórias
              </label>
              <input
                type="number"
                value={config.minPhotosRequired}
                onChange={(e) => setConfig({ ...config, minPhotosRequired: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Padrão do PRD: 5 fotos</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Limite Máximo de Fotos
              </label>
              <input
                type="number"
                value={config.maxPhotosAllowed}
                onChange={(e) => setConfig({ ...config, maxPhotosAllowed: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Padrão do PRD: 15 fotos</span>
            </div>
          </div>
        </div>

        {/* Canais de Pagamento (M-Pesa, e-Mola, Bancos) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#C89B3C]" />
                <span>Canais de Pagamento da Taxa de 150 MT</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Altere os números de M-Pesa, e-Mola ou contas bancárias para onde os clientes enviam o valor
              </p>
            </div>
            <button
              onClick={handleAddChannel}
              className="bg-[#14181B] text-[#C89B3C] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Canal</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.paymentChannels.map((ch, idx) => (
              <div key={ch.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={ch.name}
                    onChange={(e) => handleChannelChange(idx, 'name', e.target.value)}
                    className="font-bold text-xs bg-white px-2.5 py-1 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-[11px] flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ch.isActive}
                        onChange={(e) => handleChannelChange(idx, 'isActive', e.target.checked)}
                        className="rounded text-[#C89B3C]"
                      />
                      <span className="font-semibold text-slate-700">Ativo</span>
                    </label>
                    <button
                      onClick={() => handleRemoveChannel(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Número / Conta / NIB</label>
                    <input
                      type="text"
                      value={ch.accountNumber}
                      onChange={(e) => handleChannelChange(idx, 'accountNumber', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Nome do Titular / Beneficiário</label>
                    <input
                      type="text"
                      value={ch.beneficiaryName}
                      onChange={(e) => handleChannelChange(idx, 'beneficiaryName', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Instruções para o Anunciante</label>
                  <input
                    type="text"
                    value={ch.instructions}
                    onChange={(e) => handleChannelChange(idx, 'instructions', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Conforme o PRD, nenhum dado bancário ou de M-Pesa é fixado no código fonte. Todos os canais de recebimento são lidos desta configuração dinâmica administrável.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
