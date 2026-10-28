import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  MessageSquare,
  ShieldCheck,
  Clock,
  Briefcase,
  Layers,
  FileCheck2,
  Wrench,
  Truck,
  HardHat,
  Monitor,
  Printer,
  FileSpreadsheet,
  BadgeCheck,
  Send
} from 'lucide-react';
import { ServiceSubcategory } from '../components/Header';

interface ServicosPageProps {
  initialSubcategory?: ServiceSubcategory;
}

export const ServicosPage: React.FC<ServicosPageProps> = ({
  initialSubcategory = 'todos',
}) => {
  const [activeTab, setActiveTab] = useState<ServiceSubcategory>(initialSubcategory);

  // Estados do Simulador de Cotação Rápida
  const [calcService, setCalcService] = useState('pos_obra');
  const [calcCity, setCalcCity] = useState('Maputo Cidade');
  const [calcArea, setCalcArea] = useState('150');
  const [calcUrgency, setCalcUrgency] = useState('normal');

  useEffect(() => {
    if (initialSubcategory) {
      setActiveTab(initialSubcategory);
    }
  }, [initialSubcategory]);

  const whatsappBaseUrl = "https://wa.me/258880096995?text=";

  const handleSimularCotacao = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceNames: Record<string, string> = {
      pos_obra: 'Limpeza Pós-Obra & Reabilitação',
      corporativa: 'Higienização Corporativa Contínua',
      estofos: 'Lavagem de Estofos & Carpetes',
      vidros: 'Limpeza de Vidros e Fachadas',
      condominios: 'Gestão de Facilidades em Condomínios',
      epis: 'Cotação de EPIs Industriais',
      papelaria: 'Suprimentos & Papelaria Empresarial',
      ti: 'Equipamentos de TI & Consumíveis',
      procurement: 'Aprovisionamento & Negócios Corporativos'
    };

    const selectedName = serviceNames[calcService] || calcService;
    const msg = `Olá Grupo BNG! Solicito uma cotação formal para os serviços corporativos:
• Serviço: ${selectedName}
• Localização: ${calcCity}
• Dimensão / Quantidade estimada: ${calcArea}
• Nível de Urgência: ${calcUrgency === 'urgente' ? 'Urgente (48 horas)' : 'Planeado (esta semana)'}
Gostaria de receber proposta comercial com faturação com NUIT.`;

    window.open(`${whatsappBaseUrl}${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      {/* Hero da Página de Serviços - Visual Premium e Corporativo */}
      <section className="relative bg-[#12161A] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C89B3C]/15 border border-[#C89B3C]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Soluções Corporativas Integradas • Moçambique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Serviços Especializados <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
              Limpeza & Facility • Procurement Corporativo
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Apoio operacional completo para residências, condomínios fechados, escritórios, embaixadas e grandes empresas em Maputo, Matola e em todo o território nacional com garantia contratual e faturação com NUIT.
          </p>

          {/* Abas de Navegação de Serviços */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'todos'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-950 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Todos os Serviços</span>
            </button>

            <button
              onClick={() => setActiveTab('limpeza')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'limpeza'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-950 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Limpeza & Facility Management</span>
            </button>

            <button
              onClick={() => setActiveTab('procurement')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'procurement'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-950 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Procurement & Negócios</span>
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ============================================================== */}
        {/* SEÇÃO 1: BNG LIMPEZA & FACILITY MANAGEMENT */}
        {/* ============================================================== */}
        {(activeTab === 'todos' || activeTab === 'limpeza') && (
          <section id="limpeza" className="space-y-10 animate-in fade-in duration-300">
            {/* Cabeçalho da Seção */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Divisão de Higienização e Conservação de Espaços
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1 tracking-tight">
                  BNG Limpeza & Facility Management
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Equipas técnicas qualificadas com equipamentos industriais (Kärcher), produtos desinfetantes de grau hospitalar e protocolos de higiene e segurança no trabalho (HST).
                </p>
              </div>

              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, gostaria de agendar uma visita técnica ou orçamento para Limpeza e Facility Management.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20ba59] transition flex items-center gap-2 shadow-md whitespace-nowrap self-start sm:self-auto active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Pedir Orçamento Limpeza</span>
              </a>
            </div>

            {/* Grelha de 6 Serviços Particulares de Limpeza */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1: Limpeza Pós-Obra & Reabilitação */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80" 
                      alt="Técnico de Limpeza Pós-Obra com Equipamento Industrial" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                      Alta Demanda
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Limpeza Pós-Obra & Reabilitação
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Remoção profunda de resíduos de cimento, tintas acrílicas, silicones, rejuntes e poeira fina pós-construção civil. Deixamos a residência ou sede empresarial pronta para uso imediato.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Polimento técnico de azulejos, cerâmica e porcelanato</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Limpeza detalhada de caixilharias, portas e rodapés</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Higienização e desinfeção completa de sanitários e copas</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de orçamento para Limpeza Pós-Obra.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Solicitar Orçamento Pós-Obra</span>
                  </a>
                </div>
              </div>

              {/* Card 2: Higienização Corporativa & Sedes de Empresas */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80" 
                      alt="Escritório Corporativo Moderno Impecável" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 uppercase">
                      Contratos Corporativos
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Higienização Corporativa de Escritórios
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Planos de conservação diária, bissemanal ou mensal para instituições bancárias, sedes corporativas, consultórios médicos e embaixadas em Maputo e Matola.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Equipas uniformizadas, com identificação e supervisão contínua</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Gestão e reposição programada de consumíveis de higiene</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Protocolos de desinfeção de superfícies de alto contacto</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, temos interesse num contrato corporativo de higienização de escritórios.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Orçamento Corporativo Mensal</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Higienização de Sofás, Estofos & Carpetes */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80" 
                      alt="Higienização de Estofos e Sofás com Extratora a Vácuo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                      Domiciliar & Empresa
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Higienização de Estofos, Cadeiras & Carpetes
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Lavagem técnica por injeção e extração a vácuo para sofás de couro e tecido, cadeiras operacionais giratórias, colchões ortopédicos e alcatifas.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Remoção de ácaros, fungos, maus odores e nódoas difíceis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Produtos biodegradáveis sem corrosão das fibras têxteis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Secagem semi-rápida no próprio local</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, quero agendar a lavagem profunda de estofos/cadeiras.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Agendar Limpeza de Estofos</span>
                  </a>
                </div>
              </div>

              {/* Card 4: Limpeza de Vidros em Altura & Fachadas */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80" 
                      alt="Limpeza Profissional de Fachadas e Vidros em Altura" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-cyan-400 uppercase">
                      Equipa Especializada
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Limpeza de Vidros em Altura & Fachadas
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Técnicos certificados para trabalho em altura com arneses, linhas de vida e plataformas. Limpeza impecável de painéis de vidro, revestimentos em ACM e montras comerciais.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Água desmineralizada para secagem sem manchas residuais</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Cumprimento rigoroso de normas de segurança e EPIs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Atendimento a edifícios corporativos, galerias e centros comerciais</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de orçamento para Limpeza de Vidros e Fachadas em Altura.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Cotação de Fachadas & Vidros</span>
                  </a>
                </div>
              </div>

              {/* Card 5: Gestão de Condomínios & Facility Management */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" 
                      alt="Gestão de Espaços Comuns e Condomínios Residenciais" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                      Gestão Integrada
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Gestão de Condomínios & Espaços Comuns
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Solução 360° para condomínios residenciais fechados e edifícios comerciais no Triunfo, Sommerschield, Costa do Sol, Matola e Boane.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Manutenção contínua de escadarias, corredores, garagens e piscinas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Zeladoria diária, controle de portaria e apoio a moradores</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Relatórios periódicos de conformidade e contas para a comissão</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, temos interesse na gestão e conservação de condomínio residencial/comercial.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Proposta para Condomínios</span>
                  </a>
                </div>
              </div>

              {/* Card 6: Desinfeção Industrial & Controle de Pragas */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=1000&q=80" 
                      alt="Sanitização e Desinfeção Industrial de Espaços" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase">
                      Certificação Sanitária
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Desinfeção Industrial & Sanitização
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Sanitização por nebulização a frio e termonebulização para armazéns, cozinhas industriais, restaurantes e centros de distribuição, com emissão de certificado sanitário.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Eliminação de 99.9% de bactérias, vírus e fungos ambientais</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Produtos autorizados pelo Ministério da Saúde (MISAU)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                        <span>Controle de pragas e desbaratização profissional</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de desinfeção industrial / desinfestação para empresa.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Solicitar Sanitização Industrial</span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 2: BNG PROCUREMENT & NEGÓCIOS CORPORATIVOS */}
        {/* ============================================================== */}
        {(activeTab === 'todos' || activeTab === 'procurement') && (
          <section id="procurement" className="space-y-10 animate-in fade-in duration-300 pt-6">
            {/* Cabeçalho da Seção */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" />
                  Divisão de Suprimentos Corporativos & B2B
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1 tracking-tight">
                  BNG Procurement & Negócios Corporativos
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Aprovisionamento ágil, compras corporativas com faturação fiscal com NUIT, negociação direta com fabricantes internacionais e entrega pontual em qualquer província de Moçambique.
                </p>
              </div>

              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de uma cotação formal de Procurement Corporativo para a nossa empresa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-500 transition flex items-center gap-2 shadow-md whitespace-nowrap self-start sm:self-auto active:scale-95"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Solicitar Cotação B2B</span>
              </a>
            </div>

            {/* Grelha de 6 Serviços Particulares de Procurement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1: Papelaria & Consumíveis de Escritório (Imagem moderna e contextual) */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80" 
                      alt="Suprimentos de Escritório Modernos e Papelaria Corporativa" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 uppercase">
                      Fornecimento Contínuo
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Suprimentos & Papelaria Empresarial
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Fornecimento contínuo de resmas de papel A4/A3, consumíveis de impressão (toners originais HP, Canon, Kyocera), pastas suspensas, carimbos e materiais essenciais para escritórios.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Toners e tinteiros com garantia de autenticidade e rendimento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Descontos progressivos em encomendas de alto volume</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Entrega direta nas instalações da empresa em Maputo e Matola</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de cotação para suprimentos de escritório e toners.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pedir Cotação de Papelaria</span>
                  </a>
                </div>
              </div>

              {/* Card 2: Equipamentos de Proteção Individual (EPIs) */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80" 
                      alt="Equipamentos de Proteção Individual EPIs para Construção e Indústria" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase">
                      Segurança do Trabalho
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Equipamentos de Segurança (EPIs)
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Equipamentos de proteção certificados para construção civil, indústria, mineração e logística: botas com biqueira de aço, capacetes normatizados, luvas técnicas, coletes refletores e óculos de proteção.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Certificação em normas internacionais de segurança ocupacional</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Fardamentos personalizados com bordado do logótipo da empresa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Capacidade de fornecimento para grandes obras e contingentes</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de cotação para EPIs industriais e fardamentos.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pedir Cotação de EPIs</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Equipamentos de TI & Infraestrutura */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80" 
                      alt="Equipamentos Informáticos e Tecnologia Empresarial" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-400 uppercase">
                      Tecnologia & TI
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Equipamentos de Informática & Redes
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Computadores de secretária, portáteis profissionais (Dell, HP, Lenovo), no-breaks para proteção contra cortes de energia, impressoras multifuncionais de rede e cablagem estruturada.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Equipamentos novos com garantia formal do fabricante</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sistemas de energia ininterrupta (UPS/No-breaks) de alto rendimento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Apoio na configuração inicial e instalação nos postos</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de proposta para equipamentos informáticos e hardware.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cotação de TI & Informática</span>
                  </a>
                </div>
              </div>

              {/* Card 4: Mobiliário de Escritório & Postos Ergonómicos */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80" 
                      alt="Mobiliário Corporativo e Cadeiras Ergonómicas" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                      Ergonomia Corporativa
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Mobiliário Corporativo & Cadeiras
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Mesas de reunião executivas, secretárias em L para postos operacionais, cadeiras ergonómicas com apoio lombar certificado, armários arquivadores metálicos e biombos divisórios.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mobiliário resistente preparado para uso intensivo diário</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Design corporativo moderno que valoriza a imagem da sua empresa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Montagem especializada incluída na entrega</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de catálogo e cotação de mobiliário para escritórios.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Catálogo de Mobiliário</span>
                  </a>
                </div>
              </div>

              {/* Card 5: Intermediação Comercial & Sourcing Internacional */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80" 
                      alt="Gestão de Logística de Armazém e Compras Estratégicas" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-purple-400 uppercase">
                      Sourcing Especial
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Sourcing & Compras Sob Demanda
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Localização de peças técnicas, máquinas, componentes elétricos e produtos difíceis de encontrar no mercado nacional, através de fornecedores certificados na África do Sul, Europa e Ásia.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Negociação direta com fabricantes com melhores margens</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Gestão de despacho aduaneiro e desembaraço fiscal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Contratos formais com garantia de entrega no prazo</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, preciso de apoio para localização e compra de itens especiais (sourcing).")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Falar com Gestor de Sourcing</span>
                  </a>
                </div>
              </div>

              {/* Card 6: Logística de Distribuição e Aprovisionamento */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80" 
                      alt="Logística de Cargas e Distribuição Pontual" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#12161A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 uppercase">
                      Logística Integrada
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                      Logística Integrada & Armazenagem
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Consolidação de compras empresariais, estocagem transitória segura e entrega programada por lotes nas suas filiais em Maputo, Beira, Nampula e Tete.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Controle informatizado de inventário e guias de remessa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Frota dedicada com rastreio de entregas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Faturação mensal unificada para facilitar o seu departamento financeiro</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de apoio em logística corporativa e aprovisionamento de filiais.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultoria de Logística B2B</span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SIMULADOR INTERATIVO DE COTAÇÃO RÁPIDA (CONVERSÃO DE LEADS) */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-br from-[#12161A] via-[#1B2227] to-[#12161A] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                Simulador Rápido de Orçamento
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                Calcule e Solicite a sua Proposta em Segundos
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                Indique os dados operacionais da sua necessidade para receber uma estimativa estruturada via WhatsApp ou E-mail com fatura fiscal com NUIT.
              </p>
            </div>

            <form onSubmit={handleSimularCotacao} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Tipo de Serviço Pretendido
                  </label>
                  <select
                    value={calcService}
                    onChange={(e) => setCalcService(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <optgroup label="Higienização e Conservação">
                      <option value="pos_obra">Limpeza Pós-Obra & Reabilitação</option>
                      <option value="corporativa">Higienização Corporativa Contínua</option>
                      <option value="estofos">Lavagem de Estofos & Cadeiras</option>
                      <option value="vidros">Limpeza de Vidros & Fachadas</option>
                      <option value="condominios">Gestão de Facilidades em Condomínios</option>
                    </optgroup>
                    <optgroup label="Procurement e Negócios">
                      <option value="epis">Equipamentos de Proteção Individual (EPIs)</option>
                      <option value="papelaria">Suprimentos de Escritório & Papelaria</option>
                      <option value="ti">Equipamentos de Informática & TI</option>
                      <option value="procurement">Sourcing & Aprovisionamento Estratégico</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Província / Cidade de Execução
                  </label>
                  <select
                    value={calcCity}
                    onChange={(e) => setCalcCity(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <option value="Maputo Cidade">Maputo Cidade (Polana, Sommerschield, Baixa, etc.)</option>
                    <option value="Matola">Matola (Centro, Fomento, Malhampsene)</option>
                    <option value="Boane / Marracuene">Boane / Marracuene</option>
                    <option value="Gaza / Xai-Xai">Gaza / Xai-Xai</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala / Beira">Sofala / Beira</option>
                    <option value="Tete">Tete</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado / Pemba">Cabo Delgado / Pemba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Dimensão Estimada ou Quantidade
                  </label>
                  <input
                    type="text"
                    value={calcArea}
                    onChange={(e) => setCalcArea(e.target.value)}
                    placeholder="Ex: 250 m², 15 postos, ou 50 kits de EPIs"
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Prazo Desejado
                  </label>
                  <select
                    value={calcUrgency}
                    onChange={(e) => setCalcUrgency(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <option value="normal">Normal (Dentro desta semana)</option>
                    <option value="urgente">Urgência Imediata (Próximas 24h a 48h)</option>
                    <option value="planeado">Planeamento para próximo mês</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <span>Cotação formal sem compromisso com fatura com NUIT oficial.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] hover:opacity-95 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C89B3C]/20 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Gerar Cotação no WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ============================================================== */}
        {/* POR QUE ESCOLHER O GRUPO BNG EM MOÇAMBIQUE */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
              Diferenciais de Confiança
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Garantias Corporativas do Grupo BNG
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Elevado rigor operacional para que a sua empresa tenha total tranquilidade jurídica e operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C89B3C] flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Faturação Legal com NUIT</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Todas as operações são suportadas por faturas legais com NUIT emitidas nos termos da legislação moçambicana, permitindo plena dedução de custos e crédito de IVA.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Supervisão & Profissionais Checados</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Nossos colaboradores passam por verificação de antecedentes, treinamento técnico contínuo e atuam uniformizados, equipados com EPIs e crachás de identificação.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Pontualidade & Compromisso com Prazos</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Contratos estruturados com acordos de nível de serviço (SLA), assegurando início imediato e entrega rigorosa no cronograma acordado com o cliente.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
