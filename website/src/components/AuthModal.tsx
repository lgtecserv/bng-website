import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import { saveWebsiteUser, isUserAdmin } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Por favor preencha todos os campos.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Por favor informe o seu nome completo.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const emailClean = emailOrPhone.trim().toLowerCase();
      // REGRA DE SEGURANÇA ESTRITA:
      // Quem se regista ou faz login comum é SEMPRE 'advertiser' (utilizador normal).
      // Apenas os emails estritos da administração com senha correta acedem como admin.
      const isAdmin = mode === 'login' && isUserAdmin(emailClean) && (password === '123456' || password === 'admin123');
      
      const user: UserProfile = {
        id: `web-user-${Date.now()}`,
        fullName: fullName || (isAdmin ? 'Administrador LG Tecserv' : emailClean.split('@')[0]),
        email: emailClean.includes('@') ? emailClean : `${emailClean}@grupobng.co.mz`,
        phone: emailClean.startsWith('+') ? emailClean : '+258 84 152 4822',
        role: isAdmin ? 'admin' : 'advertiser',
        createdAt: new Date().toISOString()
      };

      saveWebsiteUser(user);
      setLoading(false);
      onSuccess(user);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
        {/* Cabeçalho */}
        <div className="bg-[#14181B] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-block p-3 rounded-2xl bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">
            {mode === 'login' ? 'Aceder à Sua Conta' : 'Criar Nova Conta no Grupo BNG'}
          </h3>
          <p className="text-xs text-slate-300 font-light mt-1">
            {mode === 'login' 
              ? 'Entre para gerir ou publicar imóveis no portal oficial.' 
              : 'Registe-se gratuitamente para anunciar propriedades em Moçambique.'}
          </p>
        </div>

        {/* Abas Login / Registo */}
        <div className="grid grid-cols-2 border-b border-slate-100 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-3 transition-colors ${mode === 'login' ? 'border-b-2 border-[#C89B3C] text-slate-900 bg-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Iniciar Sessão
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-3 transition-colors ${mode === 'register' ? 'border-b-2 border-[#C89B3C] text-slate-900 bg-slate-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Criar Conta
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo</label>
              <div className="flex items-center space-x-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#C89B3C] transition-colors">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Carlos Mondlane"
                  className="w-full text-xs sm:text-sm outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email ou Telemóvel</label>
            <div className="flex items-center space-x-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#C89B3C] transition-colors">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Ex: seuemail@gmail.com ou 84 123 4567"
                className="w-full text-xs sm:text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Palavra-passe</label>
            <div className="flex items-center space-x-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-[#C89B3C] transition-colors">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'A processar...' : (mode === 'login' ? 'Entrar no Sistema' : 'Registar Conta')}
          </button>
        </form>
      </div>
    </div>
  );
};
