import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Building2, 
  Sparkles, 
  ShoppingBag,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const ContatoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Imobiliário (Comprar, Arrendar ou Vender)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const text = `*Nova Mensagem pelo Website Grupo BNG*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *Telefone:* ${formData.phone}\n` +
      `📌 *Assunto:* ${formData.subject}\n` +
      `💬 *Mensagem:* ${formData.message}`;

    const url = `https://wa.me/258880096995?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero da Página de Contato */}
      <section className="bg-gradient-to-br from-[#12161A] via-[#1B2227] to-[#12161A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            Canais de Atendimento Oficial
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Fale Conosco • <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">Grupo BNG</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Estamos prontos para atender as suas solicitações imobiliárias, agendar visitas ou fornecer cotações corporativas imediatas.
          </p>
        </div>
      </section>

      {/* Seção Principal de Contactos e Formulário */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Coluna 1: Informações e Cartões de Acesso Rápido */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Informações Oficiais
            </h3>

            {/* Cartão WhatsApp */}
            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20informacoes."
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#25D366] shadow-sm hover:shadow-md transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atendimento WhatsApp</span>
                <h4 className="font-bold text-slate-900 text-base">+258 88 009 6995</h4>
                <p className="text-xs text-slate-500 mt-0.5">Resposta em tempo real • Agendamento de visitas</p>
              </div>
            </a>

            {/* Cartão Telefone */}
            <a
              href="tel:+258841524822"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C] shadow-sm hover:shadow-md transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] group-hover:bg-[#C89B3C] group-hover:text-slate-900 flex items-center justify-center shrink-0 transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chamada Telefónica</span>
                <h4 className="font-bold text-slate-900 text-base">+258 84 152 4822</h4>
                <p className="text-xs text-slate-500 mt-0.5">Linha direta de atendimento e consultoria</p>
              </div>
            </a>

            {/* Cartão Email Oficial */}
            <a
              href="mailto:contacto@grupobngoficial.com"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#C89B3C] shadow-sm hover:shadow-md transition-all flex items-start gap-4 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] group-hover:bg-[#C89B3C] group-hover:text-slate-900 flex items-center justify-center shrink-0 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Corporativo</span>
                <h4 className="font-bold text-slate-900 text-base">contacto@grupobngoficial.com</h4>
                <p className="text-xs text-slate-500 mt-0.5">Propostas comerciais, parcerias e faturas</p>
              </div>
            </a>

            {/* Cartão Localização */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escritório & Sede</span>
                <h4 className="font-bold text-slate-900 text-base">Maputo, Moçambique</h4>
                <p className="text-xs text-slate-500 mt-0.5">Atendimento presencial em Maputo, Matola e Boane</p>
              </div>
            </div>

            {/* Cartão Horários */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Horário de Funcionamento</span>
                <h4 className="font-bold text-slate-900 text-sm">Segunda a Sexta: 08:00 - 18:00</h4>
                <h4 className="font-medium text-slate-700 text-xs mt-0.5">Sábados: 08:00 - 14:00</h4>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Plantão WhatsApp disponível 24h</p>
              </div>
            </div>
          </div>

          {/* Coluna 2: Formulário Direto para WhatsApp */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
              <div className="mb-8">
                <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
                  Envie a sua Mensagem
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
                  Como Podemos Ajudar Você?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Preencha os campos abaixo. Ao carregar em "Enviar via WhatsApp", a mensagem será encaminhada diretamente para os nossos corretores e gestores.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Mensagem preparada com sucesso! Verifique a conversa aberta no WhatsApp.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Carlos Machel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seu Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +258 84 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Assunto de Interesse *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C] transition cursor-pointer"
                  >
                    <option value="Imobiliário (Comprar, Arrendar ou Vender)">🏢 Imobiliário (Comprar, Arrendar ou Anunciar)</option>
                    <option value="BNG Limpeza & Facility Management">🧹 BNG Limpeza & Facility (Pós-Obra, Corporativa)</option>
                    <option value="BNG Procurement & Negócios">📦 BNG Procurement (Suprimentos, Compras e Cotações)</option>
                    <option value="Dúvidas sobre o Aplicativo Móvel">📱 Dúvidas sobre o Aplicativo Móvel (APK)</option>
                    <option value="Parcerias e Outros Assuntos">🤝 Parcerias Comerciais e Outros Assuntos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Descreva o que procura ou necessita *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ex: Gostaria de saber mais sobre a vivenda no Triunfo / Preciso de orçamento de limpeza pós-obra..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C89B3C] transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C89B3C] to-[#AA7C1E] text-slate-900 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#C89B3C]/20 hover:opacity-95 transition-all active:scale-[0.99]"
                >
                  <MessageSquare className="w-5 h-5 text-slate-900" />
                  <span>Enviar Mensagem via WhatsApp (+258 88 009 6995)</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
