import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, User, Phone, Mail, ShieldCheck, 
  FolderKanban, Heart, Settings, HelpCircle, LogOut, FileText,
  KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { triggerAppNotification } from '../services/notifications';

export const AccountScreen: React.FC = () => {
  const { currentUser, logout, navigateTo, changePassword, openAuthModal } = useApp();

  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isVisitor = currentUser.role === 'visitor';

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordFeedback({
        type: 'error',
        message: 'A palavra-passe deve ter no mínimo 6 caracteres.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        message: 'As palavras-passe não coincidem. Por favor, verifique a confirmação.'
      });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword(newPassword);
      if (res.success) {
        setPasswordFeedback({
          type: 'success',
          message: 'Palavra-passe alterada com sucesso!'
        });
        setNewPassword('');
        setConfirmPassword('');
        triggerAppNotification(
          'Segurança da Conta',
          'A sua palavra-passe foi atualizada com sucesso no Grupo BNG.',
          'system'
        );
        setTimeout(() => {
          setPasswordFeedback(null);
          setIsPasswordExpanded(false);
        }, 3000);
      } else {
        setPasswordFeedback({
          type: 'error',
          message: res.error || 'Erro ao alterar a palavra-passe. Tente novamente.'
        });
      }
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        message: err?.message || 'Ocorreu um erro ao atualizar a palavra-passe.'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 sm:pb-12">
      {/* Top Header */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
              Minha Conta
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Caso seja visitante não autenticado */}
        {isVisitor ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C89B3C] font-extrabold flex items-center justify-center mx-auto shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Acesso à Conta</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Inicie sessão para gerir os seus imóveis publicados, acompanhar revisões da taxa de 150 MT, favoritos e segurança da conta.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#14181B] text-white hover:bg-[#252B30] font-bold text-xs shadow transition-all"
              >
                Entrar na Conta
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C89B3C] text-[#14181B] hover:bg-[#B6882C] font-bold text-xs shadow transition-all"
              >
                Criar Nova Conta
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Card do Perfil */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[#14181B] text-[#C89B3C] font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
                {currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : 'BN'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-extrabold text-slate-900 text-base truncate">
                    {currentUser.fullName}
                  </h2>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-900'
                      : currentUser.role === 'advertiser'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-xs text-slate-400 mt-0.5">{currentUser.phone}</p>
                )}
              </div>
            </div>

            {/* Atalho Admin Se For Administrador */}
            {currentUser.role === 'admin' && (
              <div className="bg-gradient-to-r from-[#14181B] to-[#252B30] text-white p-5 rounded-3xl border border-[#C89B3C]/40 shadow-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#C89B3C]" />
                  <h3 className="font-extrabold text-sm text-white">Privilégio de Administrador</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Tem acesso à fila de revisão de comprovativos (150 MT), aprovação de anúncios, rotação de banners e configurações.
                </p>
                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className="w-full bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] py-2.5 rounded-xl font-bold text-xs transition-all shadow"
                >
                  Abrir Painel Administrativo Completo
                </button>
              </div>
            )}

            {/* Menu de Opções */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
              <button
                onClick={() => navigateTo('my-listings')}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FolderKanban className="w-4 h-4 text-[#C89B3C]" />
                  <span className="font-bold">Meus Anúncios Submetidos</span>
                </div>
                <span className="text-slate-400 font-semibold">&rarr;</span>
              </button>

              <button
                onClick={() => navigateTo('favorites')}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-[#C89B3C]" />
                  <span className="font-bold">Imóveis Guardados (Favoritos)</span>
                </div>
                <span className="text-slate-400 font-semibold">&rarr;</span>
              </button>

              <button
                onClick={() => navigateTo('create')}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-[18px] text-[#C89B3C]">add_circle</span>
                  <span className="font-bold">Publicar Novo Imóvel (150 MT)</span>
                </div>
                <span className="text-slate-400 font-semibold">&rarr;</span>
              </button>

              {/* Botão de Alterar Palavra-passe no Menu */}
              <button
                onClick={() => {
                  setIsPasswordExpanded(!isPasswordExpanded);
                  setPasswordFeedback(null);
                }}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <KeyRound className="w-4 h-4 text-[#C89B3C]" />
                  <span className="font-bold">Alterar Palavra-passe</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-[10px] text-slate-400 font-medium">Segurança</span>
                  {isPasswordExpanded ? <ChevronUp className="w-4 h-4 text-[#C89B3C]" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
            </div>

            {/* Painel Expansível de Alteração de Palavra-passe */}
            {isPasswordExpanded && (
              <div className="bg-white p-5 rounded-3xl border border-[#C89B3C]/30 shadow-sm space-y-4 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs">Alterar Palavra-passe</h3>
                      <p className="text-[11px] text-slate-400">Insira a sua nova palavra-passe de acesso</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    Mínimo 6 dígitos
                  </span>
                </div>

                {passwordFeedback && (
                  <div className={`p-3 rounded-2xl flex items-start space-x-2.5 text-xs ${
                    passwordFeedback.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {passwordFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium">{passwordFeedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nova Palavra-passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Pelo menos 6 caracteres"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Confirmar Nova Palavra-passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova palavra-passe"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {newPassword && confirmPassword && (
                      <div className="mt-1 flex items-center space-x-1.5 text-[10px]">
                        {newPassword === confirmPassword ? (
                          <span className="text-emerald-600 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 inline" />
                            <span>As palavras-passe coincidem</span>
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3 inline" />
                            <span>As palavras-passe não coincidem</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#14181B] text-white hover:bg-[#252B30] disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow"
                    >
                      {savingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C89B3C]" />
                          <span>A guardar...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                          <span>Guardar Nova Palavra-passe</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordExpanded(false);
                        setPasswordFeedback(null);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ações de Conta */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <button
                onClick={() => {
                  logout();
                  navigateTo('home');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Terminar Sessão</span>
              </button>
            </div>
          </>
        )}

        {/* Informações Institucionais Grupo BNG */}
        <div className="p-4 text-center text-slate-400 text-[11px] space-y-2">
          <p className="font-semibold text-slate-600">Grupo BNG — Imobiliária &amp; Negócios</p>
          <p>Maputo, Moçambique • Taxa padrão: 150 MT</p>
          <p className="text-[10px]">Versão 1.0.0 Oficial</p>
          
          <div className="pt-2">
            <button
              onClick={() => navigateTo('admin-login')}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline font-medium"
            >
              Portal Administrativo Interno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
