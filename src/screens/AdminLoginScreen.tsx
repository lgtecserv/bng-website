import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const AdminLoginScreen: React.FC = () => {
  const { loginUser, navigateTo } = useApp();
  const [email, setEmail] = useState('grupobngoficial@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha os campos obrigatórios.');
      return;
    }
    setError(null);
    setLoading(true);
    const res = await loginUser(email, password, true);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Credenciais administrativas inválidas.');
    }
  };

  const selectAdminAccount = (adminEmail: string) => {
    setEmail(adminEmail);
    setPassword('123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#111317] flex flex-col justify-center items-center p-4 text-white">
      <div className="w-full max-w-md bg-[#191C20] rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="text-center flex flex-col items-center">
          <img
            src={logoImg}
            onError={(e) => { e.currentTarget.src = './logo.png'; }}
            alt="Grupo BNG"
            className="h-20 w-auto object-contain mb-3 drop-shadow"
          />
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-[#C89B3C] text-xs font-bold border border-[#C89B3C]/30 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Acesso Administrativo Supabase</span>
          </div>
          <p className="text-xs text-slate-400">
            Painel restrito de controlo, moderação de comprovativos e gestão de imóveis.
          </p>
        </div>

        {/* Contas Administrativas Prontas */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Administradores Registados no Banco:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectAdminAccount('grupobngoficial@gmail.com')}
              className={`p-2 rounded-xl text-[11px] font-bold border text-left truncate transition-colors ${
                email === 'grupobngoficial@gmail.com'
                  ? 'bg-amber-400/20 border-[#C89B3C] text-[#C89B3C]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              grupobngoficial@...
            </button>
            <button
              type="button"
              onClick={() => selectAdminAccount('lgtecserv@gmail.com')}
              className={`p-2 rounded-xl text-[11px] font-bold border text-left truncate transition-colors ${
                email === 'lgtecserv@gmail.com'
                  ? 'bg-amber-400/20 border-[#C89B3C] text-[#C89B3C]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              lgtecserv@gmail.com
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              E-mail de Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C89B3C] to-[#E5B95C] text-[#14181B] font-extrabold text-xs shadow-lg hover:from-[#B6882C] hover:to-[#C89B3C] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando no Supabase...</span>
              </>
            ) : (
              <span>Entrar no Painel Administrativo</span>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal Público</span>
          </button>
        </div>
      </div>
    </div>
  );
};
