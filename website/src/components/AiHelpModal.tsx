import React, { useState, useEffect, useRef } from 'react';
import { fetchWebsiteListings, fetchWebsiteCategories, broadcastGlobalAnnouncement } from '../services/supabase';
import { 
  askAiAssistant, 
  ChatMessage, 
  PropertySearchLead, 
  LeadChecklist,
  saveStoredLead, 
  generateWhatsAppLeadMessage,
  OFFICIAL_BNG_WHATSAPP
} from '../services/aiAssistant';
import { Listing, Category } from '../types';
import { 
  Bot, Send, X, Sparkles, MessageCircle, ArrowRight, 
  MapPin, Bed, Maximize, CheckCircle2, Phone, ClipboardList, 
  HelpCircle, Check, MessageSquare, ExternalLink, RefreshCw, ChevronRight, UserCheck
} from 'lucide-react';

interface AiHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectListing?: (listing: Listing) => void;
}

// Formatador elegante de texto sem asteriscos soltos e com suporte a negrito e listas
const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return <p className="whitespace-pre-line text-white font-medium">{text}</p>;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-slate-800 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const numberedMatch = trimmed.match(/^(\d+[\.\)])\s+(.+)$/);
        const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);

        const renderInlineFormatting = (rawText: string) => {
          const parts = rawText.split(/(\*\*[^*]+\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldContent = part.slice(2, -2).trim();
              return (
                <strong key={pIdx} className="font-extrabold text-slate-900">
                  {boldContent}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });
        };

        if (numberedMatch) {
          const num = numberedMatch[1];
          const content = numberedMatch[2];
          return (
            <div key={lineIdx} className="flex items-start gap-2 py-0.5 text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-[#9B7423] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {num}
              </span>
              <div className="flex-1 text-slate-800">{renderInlineFormatting(content)}</div>
            </div>
          );
        }

        if (bulletMatch) {
          const content = bulletMatch[1];
          return (
            <div key={lineIdx} className="flex items-start gap-2 py-0.5 text-xs sm:text-sm pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] shrink-0 mt-2" />
              <div className="flex-1 text-slate-800">{renderInlineFormatting(content)}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="text-xs sm:text-sm">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const AiHelpModal: React.FC<AiHelpModalProps> = ({ isOpen, onClose, onSelectListing }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const [activeChecklist, setActiveChecklist] = useState<LeadChecklist>({});

  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    clientWhatsapp: '',
    propertyType: 'Casas e Vivendas',
    transactionType: 'venda' as 'venda' | 'arrendamento' | 'qualquer',
    locationPreferred: '',
    typologyOrDimensions: '',
    essentialFeatures: '',
    budget: '',
    urgencyDeadline: 'Imediato (1 a 2 semanas)',
    additionalNotes: ''
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Olá! Sou o Assistente e Consultor Imobiliário Oficial do Grupo BNG. 🏠✨\n\nEstou aqui para acompanhar e encontrar o imóvel perfeito para si ou para o seu negócio em Moçambique. Para começarmos da melhor forma, diga-me:\n\n1. Que tipo de imóvel procura (Casa, Apartamento, Condomínio, Terreno ou Comercial)?\n2. Pretende Comprar ou Arrendar e em que localização/bairro?',
      timestamp: 'Agora'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWebsiteListings().then(setCatalog).catch(() => {});
      fetchWebsiteCategories().then(setCategories).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const response = await askAiAssistant(
        textToSend,
        [...messages, userMessage],
        catalog,
        categories,
        activeChecklist
      );

      if (response.checklist) {
        setActiveChecklist(prev => ({
          ...prev,
          ...response.checklist
        }));
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: response.text,
          suggestedListings: response.suggestedListings,
          leadCaptured: response.leadData,
          checklist: response.checklist || activeChecklist,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Pedimos desculpas, ocorreu uma oscilação momentânea na conexão. Por favor envie a sua mensagem novamente ou entre em contacto direto com os nossos corretores pelo WhatsApp: +258 880096995.',
          checklist: activeChecklist,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectListingItem = (item: Listing) => {
    onClose();
    if (onSelectListing) {
      onSelectListing(item);
    }
  };

  const handleSubmitLeadForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.clientPhone.trim()) {
      alert('Por favor, informe o seu número de Telefone ou WhatsApp para entrarmos em contacto.');
      return;
    }

    const updatedChecklist: LeadChecklist = {
      ...activeChecklist,
      propertyType: leadForm.propertyType,
      transactionType: leadForm.transactionType,
      locationPreferred: leadForm.locationPreferred,
      typologyOrDimensions: leadForm.typologyOrDimensions,
      essentialFeatures: leadForm.essentialFeatures,
      budget: leadForm.budget,
      urgencyDeadline: leadForm.urgencyDeadline,
      clientName: leadForm.clientName,
      clientPhone: leadForm.clientPhone,
      clientWhatsapp: leadForm.clientWhatsapp || leadForm.clientPhone,
      additionalNotes: leadForm.additionalNotes,
      isComplete: true
    };

    setActiveChecklist(updatedChecklist);

    const newLead: PropertySearchLead = {
      id: `lead-${Date.now()}`,
      clientName: leadForm.clientName || 'Cliente BNG',
      clientPhone: leadForm.clientPhone,
      clientWhatsapp: leadForm.clientWhatsapp || leadForm.clientPhone,
      propertyType: leadForm.propertyType,
      transactionType: leadForm.transactionType,
      locationPreferred: leadForm.locationPreferred || 'A definir',
      typologyOrDimensions: leadForm.typologyOrDimensions || 'Conforme disponível',
      essentialFeatures: leadForm.essentialFeatures || 'Padrão BNG',
      budget: leadForm.budget || 'A negociar',
      urgencyDeadline: leadForm.urgencyDeadline || 'Brevemente',
      additionalNotes: leadForm.additionalNotes,
      source: 'ai_assistant_ajuda',
      status: 'novo',
      createdAt: new Date().toISOString()
    };

    saveStoredLead(newLead);
    broadcastGlobalAnnouncement(
      `Nova Procura Registada: ${newLead.clientName} procura ${newLead.propertyType} (${newLead.transactionType.toUpperCase()}) em ${newLead.locationPreferred} • Orçamento: ${newLead.budget} • Tel: ${newLead.clientPhone}`,
      'prioritaria',
      'admin_only'
    );

    setShowLeadForm(false);

    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'assistant',
        text: `Excelente! A sua Ficha de Acompanhamento foi gravada com sucesso e a Direcção do Grupo BNG foi notificada. 📋✅\n\nRecomendamos também que clique no botão abaixo para nos enviar esta mesma ficha directamente no WhatsApp oficial (+258 880096995) para obter atendimento prioritário imediato:`,
        checklist: updatedChecklist,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ').format(price);
  };

  const whatsappInquiryUrl = (cl: LeadChecklist) => {
    const text = generateWhatsAppLeadMessage(cl);
    return `https://wa.me/${OFFICIAL_BNG_WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[92vh] max-h-[820px]">
        {/* Topo do Modal */}
        <div className="bg-[#12161A] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6B1F] flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#D4AF37]/20">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#12161A] rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Consultor IA • Grupo BNG</h3>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  OFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Acompanhamento personalizado em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={`https://wa.me/${OFFICIAL_BNG_WHATSAPP}?text=${encodeURIComponent('Olá Grupo BNG! Estou a falar através do website e gostaria de apoio para encontrar um imóvel.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              title="Falar no WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp BNG</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Caixa de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`rounded-2xl p-4 shadow-xs max-w-[92%] sm:max-w-[85%] text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#14181B] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-sm'
                }`}
              >
                {/* Cabeçalho da Mensagem */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center space-x-1.5 mb-2 pb-1.5 border-b border-slate-100 text-[#C89B3C]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Consultor Imobiliário Oficial
                    </span>
                  </div>
                )}

                <FormattedMessageText text={msg.text} isUser={msg.sender === 'user'} />

                {/* Checklist Dinâmico de 8 Critérios */}
                {msg.sender === 'assistant' && msg.checklist && Object.keys(msg.checklist).length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-amber-200/60 bg-amber-50/60 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#9B7423] flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                        <ClipboardList className="w-4 h-4 text-[#C89B3C]" />
                        Ficha de Procura • Critérios Identificados:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                      {msg.checklist.propertyType && (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Tipo:</strong> {msg.checklist.propertyType}</span>
                        </div>
                      )}
                      {msg.checklist.transactionType && (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Finalidade:</strong> {msg.checklist.transactionType === 'venda' ? 'Compra' : 'Arrendamento'}</span>
                        </div>
                      )}
                      {msg.checklist.locationPreferred && (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Localização:</strong> {msg.checklist.locationPreferred}</span>
                        </div>
                      )}
                      {msg.checklist.typologyOrDimensions && (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Tipologia:</strong> {msg.checklist.typologyOrDimensions}</span>
                        </div>
                      )}
                      {msg.checklist.budget && (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Orçamento:</strong> {msg.checklist.budget}</span>
                        </div>
                      )}
                      {msg.checklist.clientPhone && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span><strong>Contacto:</strong> {msg.checklist.clientPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Botões Rápidos de Ação */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <a
                        href={whatsappInquiryUrl(msg.checklist)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[200px] bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-black py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>Enviar Pedido Directo à Empresa (WhatsApp)</span>
                      </a>

                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors"
                      >
                        Editar / Completar
                      </button>
                    </div>
                  </div>
                )}

                {/* Cartões Interativos de Imóveis Sugeridos */}
                {msg.suggestedListings && msg.suggestedListings.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Imóveis Disponíveis no Catálogo:
                    </p>
                    <div className="space-y-2">
                      {msg.suggestedListings.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectListingItem(item)}
                          className="bg-slate-50 hover:bg-amber-50/50 p-2.5 rounded-xl border border-slate-200 hover:border-[#C89B3C] transition-all cursor-pointer flex items-center space-x-2.5 group"
                        >
                          <img
                            src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                            alt={item.title}
                            className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#C89B3C] text-slate-950 inline-block mb-0.5">
                              {item.transactionType === 'sale' ? 'Venda' : 'Renda'} • {item.categoryName}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#C89B3C]">
                              {item.title}
                            </h4>
                            <div className="flex items-center text-[10px] text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#C89B3C] mr-0.5 shrink-0" />
                              <span className="truncate">{item.district}, {item.province}</span>
                            </div>
                            <div className="text-xs font-black text-slate-900 mt-1">
                              {formatPrice(item.price)} <span className="text-[10px] text-[#C89B3C]">MT</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#C89B3C] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-[70%]">
              <div className="w-4 h-4 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
              <span>O Consultor do Grupo BNG está a analisar...</span>
            </div>
          )}

          {/* FORMULÁRIO COMPLETO DAS 8 PERGUNTAS */}
          {showLeadForm && (
            <div className="bg-white p-4 rounded-3xl border-2 border-[#C89B3C] shadow-lg space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 text-[#C89B3C]">
                  <ClipboardList className="w-5 h-5" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Ficha de Acompanhamento • 8 Critérios
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                Os nossos corretores recebem o alerta em tempo real e entram em contacto consigo com opções precisas:
              </p>

              <form onSubmit={handleSubmitLeadForm} className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">1. Que tipo de imóvel procura?</label>
                  <select
                    value={leadForm.propertyType}
                    onChange={(e) => setLeadForm({ ...leadForm, propertyType: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-[#C89B3C] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">2. Pretende arrendar ou comprar?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLeadForm({ ...leadForm, transactionType: 'venda' })}
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        leadForm.transactionType === 'venda' ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      Comprar (Venda)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadForm({ ...leadForm, transactionType: 'arrendamento' })}
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        leadForm.transactionType === 'arrendamento' ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      Arrendar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">3. Em que localização preferes?</label>
                  <input
                    type="text"
                    placeholder="Ex: Matola, Maputo Sommerschield, Boane, Triunfo..."
                    value={leadForm.locationPreferred}
                    onChange={(e) => setLeadForm({ ...leadForm, locationPreferred: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">4. Qual é a tipologia ou dimensão pretendida?</label>
                  <input
                    type="text"
                    placeholder="Ex: T3, T4, ou Terreno 20x40m, Armazém 500m²..."
                    value={leadForm.typologyOrDimensions}
                    onChange={(e) => setLeadForm({ ...leadForm, typologyOrDimensions: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">5. Quais características essenciais procura?</label>
                  <input
                    type="text"
                    placeholder="Ex: Piscina, garagem para 2 carros, segurança 24h, suíte..."
                    value={leadForm.essentialFeatures}
                    onChange={(e) => setLeadForm({ ...leadForm, essentialFeatures: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">6. Qual é o seu orçamento?</label>
                    <input
                      type="text"
                      placeholder="Ex: Até 5.000.000 MT"
                      value={leadForm.budget}
                      onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">7. Quando precisa?</label>
                    <input
                      type="text"
                      placeholder="Ex: Imediato, 1 mês..."
                      value={leadForm.urgencyDeadline}
                      onChange={(e) => setLeadForm({ ...leadForm, urgencyDeadline: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">8. Seus Contactos para a Equipa Ligar:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={leadForm.clientName}
                      onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#C89B3C] outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Telemóvel / WhatsApp *"
                      value={leadForm.clientPhone}
                      onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#C89B3C] focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C1E] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition"
                >
                  Gravar Ficha e Notificar Administradores
                </button>
              </form>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões Rápidas de Pergunta */}
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 font-bold shrink-0">Sugestões:</span>
          <button
            onClick={() => handleSend('Quero comprar uma casa na Matola até 4.000.000 MT')}
            className="shrink-0 bg-white hover:bg-amber-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium transition"
          >
            🏠 Casa na Matola
          </button>
          <button
            onClick={() => handleSend('Têm condomínios residenciais disponíveis?')}
            className="shrink-0 bg-white hover:bg-amber-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium transition"
          >
            🏘️ Condomínios
          </button>
          <button
            onClick={() => handleSend('Quero arrendar um apartamento T2 ou T3 em Maputo')}
            className="shrink-0 bg-white hover:bg-amber-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium transition"
          >
            🏢 Apartamento em Maputo
          </button>
          <button
            onClick={() => handleSend('Quais são os terrenos com DUAT disponíveis?')}
            className="shrink-0 bg-white hover:bg-amber-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium transition"
          >
            📐 Terrenos com DUAT
          </button>
        </div>

        {/* Input Inferior */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva o imóvel que procura (tipo, zona, orçamento)..."
              className="flex-1 bg-slate-100 border border-slate-200 focus:border-[#C89B3C] rounded-2xl px-4 py-2.5 text-xs sm:text-sm outline-none transition"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C1E] text-slate-950 flex items-center justify-center font-bold hover:opacity-90 active:scale-95 disabled:opacity-50 transition shadow-md shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
