import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { fetchListings, fetchCategories, broadcastGlobalAnnouncement } from '../services/supabase';
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
import logoImg from '../assets/logo.png';

interface AiHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Formatador elegante de texto sem asteriscos soltos e com suporte a negrito e listas
const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return <p className="whitespace-pre-line text-white font-medium">{text}</p>;
  }

  // Divide por linhas para formatar listas e parágrafos
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-slate-800 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Verifica se é item de lista numerada (ex: "1. ", "2. ")
        const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
        // Verifica se é item com traço ou bala (ex: "- ", "* ")
        const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);

        // Processa negrito dentro de uma linha
        const renderInlineFormatting = (content: string) => {
          // Separa por **bold**
          const parts = content.split(/(\*\*[^*]+?\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const cleanBold = part.slice(2, -2).trim();
              return (
                <strong key={pIdx} className="font-extrabold text-slate-950">
                  {cleanBold}
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

        // Parágrafo regular
        return (
          <p key={lineIdx} className="text-xs sm:text-sm">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const AiHelpModal: React.FC<AiHelpModalProps> = ({ isOpen, onClose }) => {
  const { navigateTo } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Estado da Ficha de Acompanhamento / Checklist acumulativo do cliente
  const [activeChecklist, setActiveChecklist] = useState<LeadChecklist>({});

  // Formulário das 8 Perguntas quando o cliente prefere preencher/ajustar
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
    urgencyDeadline: 'Nas próximas 2 semanas',
    additionalNotes: ''
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Olá! Sou o Consultor Oficial de Ajuda do Grupo BNG. 🏠✨\n\nEstou aqui para fazer o seu acompanhamento completo: diga-me o que procura (para compra ou arrendamento) ou diga se deseja que encontremos um imóvel sob medida para si!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      Promise.all([fetchListings(), fetchCategories()]).then(([items, cats]) => {
        setCatalog(items);
        setCategories(cats);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, showLeadForm]);

  if (!isOpen) return null;

  const countFilledChecklistItems = (ch: LeadChecklist) => {
    let count = 0;
    if (ch.propertyType) count++;
    if (ch.transactionType) count++;
    if (ch.locationPreferred) count++;
    if (ch.typologyOrDimensions) count++;
    if (ch.essentialFeatures) count++;
    if (ch.budget) count++;
    if (ch.urgencyDeadline) count++;
    if (ch.clientPhone || ch.clientName) count++;
    return count;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await askAiAssistant(query, newHistory, catalog, categories, activeChecklist);

      if (res.checklist) {
        setActiveChecklist(res.checklist);
        // Sincroniza também com o form para caso abra a ficha manual
        setLeadForm(prev => ({
          ...prev,
          propertyType: res.checklist?.propertyType || prev.propertyType,
          transactionType: res.checklist?.transactionType || prev.transactionType,
          locationPreferred: res.checklist?.locationPreferred || prev.locationPreferred,
          typologyOrDimensions: res.checklist?.typologyOrDimensions || prev.typologyOrDimensions,
          essentialFeatures: res.checklist?.essentialFeatures || prev.essentialFeatures,
          budget: res.checklist?.budget || prev.budget,
          urgencyDeadline: res.checklist?.urgencyDeadline || prev.urgencyDeadline,
          clientName: res.checklist?.clientName || prev.clientName,
          clientPhone: res.checklist?.clientPhone || prev.clientPhone,
          additionalNotes: res.checklist?.additionalNotes || prev.additionalNotes
        }));
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        suggestedListings: res.suggestedListings,
        leadCaptured: res.leadData,
        checklist: res.checklist || activeChecklist,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Erro na IA:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Compreendo perfeitamente o seu pedido! Posso registar a sua solicitação diretamente para a equipa do Grupo BNG encontrar o imóvel ideal.',
          checklist: activeChecklist,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectListing = (listingId: string) => {
    onClose();
    navigateTo('detail', { listingId });
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
      additionalNotes: leadForm.additionalNotes,
      isComplete: true
    };

    setActiveChecklist(updatedChecklist);

    const lead: PropertySearchLead = {
      id: `LEAD-${Date.now()}`,
      clientName: leadForm.clientName || 'Cliente Interessado (IA)',
      clientPhone: leadForm.clientPhone,
      clientWhatsapp: leadForm.clientWhatsapp || leadForm.clientPhone,
      propertyType: leadForm.propertyType,
      transactionType: leadForm.transactionType,
      locationPreferred: leadForm.locationPreferred || 'Não especificada',
      typologyOrDimensions: leadForm.typologyOrDimensions || 'Sob consulta',
      essentialFeatures: leadForm.essentialFeatures || 'Essenciais indicadas',
      budget: leadForm.budget || 'A negociar',
      urgencyDeadline: leadForm.urgencyDeadline,
      additionalNotes: leadForm.additionalNotes,
      source: 'ai_assistant_ajuda',
      status: 'novo',
      createdAt: new Date().toISOString()
    };

    saveStoredLead(lead);

    // Alerta oficial confidencial exclusivo para os Administradores
    await broadcastGlobalAnnouncement(
      `🔔 Novo Pedido de Imóvel • Ficha Completa`,
      `Cliente ${lead.clientName} procura ${lead.propertyType} em ${lead.locationPreferred} (${lead.budget}). Tel: ${lead.clientPhone}`,
      'system',
      'admin-dashboard',
      undefined,
      false,
      'admin_only'
    );

    setShowLeadForm(false);

    // Adiciona confirmação e botão de WhatsApp na conversa incentivando o envio
    setMessages(prev => [
      ...prev,
      {
        id: `ai-lead-confirm-${Date.now()}`,
        sender: 'assistant',
        text: `Excelente ${lead.clientName}! A sua Ficha de Pedido está pronta e os nossos corretores receberam o alerta. 🎯\n\nPor favor, **toque no botão verde abaixo "Enviar Ficha ao WhatsApp BNG"** para enviar a sua ficha com 1 clique diretamente ao nosso WhatsApp oficial para agilizarmos o atendimento!`,
        leadCaptured: lead,
        checklist: updatedChecklist,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-MZ').format(val);
  };

  // Abre WhatsApp oficial do Grupo BNG com a ficha formatada
  const handleOpenOfficialWhatsApp = (checklistToUse?: LeadChecklist) => {
    const ch = checklistToUse || activeChecklist;
    const msg = generateWhatsAppLeadMessage(ch);
    const waUrl = `https://wa.me/${OFFICIAL_BNG_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const filledCount = countFilledChecklistItems(activeChecklist);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[92vh] sm:h-[86vh] flex flex-col shadow-2xl overflow-hidden border border-slate-700/40">
        
        {/* Cabeçalho Oficial do Chat */}
        <div className="bg-[#14181B] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9B7423] via-[#C89B3C] to-[#F3D785] text-[#14181B] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#14181B] rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>Ajuda BNG • IA</span>
                  <span className="text-[10px] bg-[#C89B3C] text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                    CONSULTOR
                  </span>
                </h3>
              </div>
              <p className="text-[10px] text-slate-300">Acompanhamento e Procura Personalizada de Imóveis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenOfficialWhatsApp()}
              className="hidden xs:flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs"
              title="Abrir WhatsApp Oficial do Grupo BNG"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Progresso da Ficha de Acompanhamento (quando houver critérios coletados) */}
        {filledCount > 0 && (
          <div className="bg-amber-50/90 border-b border-amber-200/70 px-3.5 py-2 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#9B7423]" />
              <span className="font-bold text-amber-950 text-[11px]">
                Ficha de Procura: <span className="text-[#9B7423]">{filledCount} de 8</span> especificações definidas
              </span>
            </div>
            <button
              onClick={() => setShowLeadForm(true)}
              className="text-[11px] font-extrabold text-[#9B7423] hover:underline flex items-center gap-1"
            >
              <span>Ver Ficha</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Histórico de Mensagens */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#F8F9FA]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#14181B] text-white rounded-br-xs border border-slate-700'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                }`}
              >
                {/* Renderização limpa de texto */}
                <FormattedMessageText text={msg.text} isUser={msg.sender === 'user'} />

                {/* FICHA CHECKLIST DINÂMICA DE ACOMPANHAMENTO NO CHAT */}
                {msg.checklist && Object.keys(msg.checklist).length > 0 && (
                  <div className="mt-3 bg-slate-50 border border-amber-200/80 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-[#C89B3C]" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                          Ficha de Especificações do Cliente
                        </span>
                      </div>
                      <span className="text-[9px] font-bold bg-[#C89B3C]/15 text-[#9B7423] px-2 py-0.5 rounded-full">
                        {countFilledChecklistItems(msg.checklist)}/8 preenchidos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">1.</span>
                        <span className="text-slate-500 font-medium">Imóvel:</span>
                        <strong className="text-slate-900 truncate">{msg.checklist.propertyType || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">2.</span>
                        <span className="text-slate-500 font-medium">Finalidade:</span>
                        <strong className="text-slate-900 capitalize">{msg.checklist.transactionType || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">3.</span>
                        <span className="text-slate-500 font-medium">Zona:</span>
                        <strong className="text-slate-900 truncate">{msg.checklist.locationPreferred || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">4.</span>
                        <span className="text-slate-500 font-medium">Tipologia:</span>
                        <strong className="text-slate-900 truncate">{msg.checklist.typologyOrDimensions || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <span className="text-slate-400 font-mono">5.</span>
                        <span className="text-slate-500 font-medium">Essenciais:</span>
                        <strong className="text-slate-900 truncate">{msg.checklist.essentialFeatures || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">6.</span>
                        <span className="text-slate-500 font-medium">Orçamento:</span>
                        <strong className="text-[#9B7423] font-bold">{msg.checklist.budget || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono">7.</span>
                        <span className="text-slate-500 font-medium">Prazo:</span>
                        <strong className="text-slate-900 truncate">{msg.checklist.urgencyDeadline || 'A definir'}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <span className="text-slate-400 font-mono">8.</span>
                        <span className="text-slate-500 font-medium">Contacto:</span>
                        <strong className="text-slate-900 truncate">
                          {msg.checklist.clientPhone ? `${msg.checklist.clientName || 'Cliente'} (${msg.checklist.clientPhone})` : 'A definir'}
                        </strong>
                      </div>
                    </div>

                    {/* BOTÃO OFICIAL WHATSAPP DIRETO NO CHAT COM TODOS OS DADOS */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleOpenOfficialWhatsApp(msg.checklist)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white py-2 px-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                        <span>Enviar Ficha ao WhatsApp BNG</span>
                      </button>

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
                          onClick={() => handleSelectListing(item.id)}
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

          {/* FORMULÁRIO COMPLETO DAS 8 PERGUNTAS (QUANDO O CLIENTE CLICA PARA EDITAR/PREENCHER TUDO) */}
          {showLeadForm && (
            <div className="bg-white p-4 rounded-3xl border-2 border-[#C89B3C] shadow-lg space-y-3.5 animate-fadeIn">
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
                {/* 1. Tipo de Imóvel */}
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

                {/* 2. Arrendar ou Comprar */}
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
                      Arrendar (Renda)
                    </button>
                  </div>
                </div>

                {/* 3. Localização */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">3. Em que localização preferes?</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sommerschield, Matola, Boane, Zimpeto..."
                    value={leadForm.locationPreferred}
                    onChange={(e) => setLeadForm({ ...leadForm, locationPreferred: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* 4. Tipologia ou Dimensão */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">4. Qual é a tipologia ou dimensão pretendida?</label>
                  <input
                    type="text"
                    placeholder="Ex: T3, T4, ou terreno de 30x50m, 200m²..."
                    value={leadForm.typologyOrDimensions}
                    onChange={(e) => setLeadForm({ ...leadForm, typologyOrDimensions: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* 5. Características Essenciais */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">5. Quais características essenciais procura?</label>
                  <input
                    type="text"
                    placeholder="Ex: Piscina, garagem para 2 carros, segurança 24h, quintal..."
                    value={leadForm.essentialFeatures}
                    onChange={(e) => setLeadForm({ ...leadForm, essentialFeatures: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* 6. Orçamento */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">6. Qual é o seu orçamento máximo?</label>
                  <input
                    type="text"
                    placeholder="Ex: Até 5.000.000 MT ou até 40.000 MT/mês"
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* 7. Quando precisa */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">7. Quando precisa do imóvel?</label>
                  <select
                    value={leadForm.urgencyDeadline}
                    onChange={(e) => setLeadForm({ ...leadForm, urgencyDeadline: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  >
                    <option value="Urgente (Imediato)">Urgente (Imediato)</option>
                    <option value="Nas próximas 2 semanas">Nas próximas 2 semanas</option>
                    <option value="Este mês">Este mês</option>
                    <option value="Próximos 2 a 3 meses">Próximos 2 a 3 meses</option>
                    <option value="Apenas pesquisando opções">Apenas pesquisando opções</option>
                  </select>
                </div>

                {/* Contacto do Cliente */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Seu Nome:</label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos M."
                      value={leadForm.clientName}
                      onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Seu Contacto (WhatsApp / Tel):</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 84 123 4567"
                      value={leadForm.clientPhone}
                      onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                {/* 8. Observações Adicionais */}
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">8. Outra informação adicional?</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Preferência perto de escolas, rua pavimentada, etc."
                    value={leadForm.additionalNotes}
                    onChange={(e) => setLeadForm({ ...leadForm, additionalNotes: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#14181B] hover:bg-slate-800 text-[#C89B3C] py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar e Notificar Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSubmitLeadForm({ preventDefault: () => {} } as any);
                      handleOpenOfficialWhatsApp({
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
                        additionalNotes: leadForm.additionalNotes
                      });
                    }}
                    className="bg-[#25D366] hover:bg-[#1ebd59] text-white p-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                    title="Enviar e Abrir no WhatsApp Oficial"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões Rápidas de Início de Conversa */}
        {messages.length <= 2 && (
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <button
              onClick={() => handleSendMessage('Procuro vivenda para comprar na Matola')}
              className="bg-slate-100 hover:bg-amber-100/70 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              🏡 Vivenda na Matola
            </button>
            <button
              onClick={() => handleSendMessage('Procuro apartamento para arrendar na Polana')}
              className="bg-slate-100 hover:bg-amber-100/70 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              🏢 Apartamento Polana
            </button>
            <button
              onClick={() => handleSendMessage('Quero que procurem um imóvel sob medida para mim')}
              className="bg-[#C89B3C]/15 hover:bg-[#C89B3C]/30 text-[#9B7423] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              ✨ Procura Sob Medida
            </button>
            <button
              onClick={() => handleSendMessage('Quais são os imóveis disponíveis?')}
              className="bg-slate-100 hover:bg-amber-100/70 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              📋 Ver Catálogo
            </button>
          </div>
        )}

        {/* Input e Envio de Mensagem */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva o que procura ou responda ao consultor..."
              className="flex-1 bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-transparent focus:border-[#C89B3C] focus:bg-white outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-2xl bg-[#C89B3C] hover:bg-[#B6882C] disabled:opacity-40 disabled:hover:bg-[#C89B3C] text-[#14181B] flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
