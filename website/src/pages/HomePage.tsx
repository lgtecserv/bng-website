import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShoppingBag, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  Award, 
  PhoneCall, 
  MessageSquare,
  CheckCircle2,
  Star,
  ChevronDown,
  Scale,
  Handshake,
  TrendingUp,
  FileCheck,
  Quote,
  MapPin,
  Check
} from 'lucide-react';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { ActivePage } from '../components/Header';
import { LiveTransactionsTicker } from '../components/LiveTransactionsTicker';
import { InvestmentSimulator } from '../components/InvestmentSimulator';

interface HomePageProps {
  featuredListings: Listing[];
  onNavigate: (page: ActivePage) => void;
  onSelectListing: (listing: Listing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredListings,
  onNavigate,
  onSelectListing
}) => {
  // Estado para acordeão do FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'Como é feita a verificação jurídica dos imóveis antes da publicação?',
      a: 'Todos os imóveis mediados pelo Grupo BNG passam por uma rigorosa auditoria documental prévia, onde verificamos a legitimidade do DUAT, a certidão da Conservatória do Registo Predial e a inexistência de penhoras ou litígios judiciais. Garantimos que você negocia com total segurança.'
    },
    {
      q: 'Como posso agendar uma visita presencial aos imóveis?',
      a: 'Pode agendar diretamente no botão "Agendar Visita WhatsApp" disponível em cada anúncio ou ligar para o número +258 84 152 4822. Um consultor oficial do Grupo BNG acompanhará toda a visita no horário mais conveniente para si.'
    },
    {
      q: 'Como funciona a contratação dos serviços corporativos de Limpeza & Facility?',
      a: 'Realizamos um levantamento técnico gratuito das suas instalações para dimensionar a equipa, produtos e máquinas industriais necessárias. Em seguida, emitimos uma proposta formal com cronograma, condições e garantia de cumprimento contratual.'
    },
    {
      q: 'O Grupo BNG emite faturas com NUIT para compras de Procurement?',
      a: 'Sim, somos uma sociedade comercial devidamente registada em Moçambique. Todas as cotações, faturas e recibos são emitidos em estrita conformidade com a legislação fiscal moçambicana, permitindo às empresas a dedução legal de custos.'
    },
    {
      q: 'O aplicativo móvel BNG Imóvel é gratuito e seguro?',
      a: 'Sim, o aplicativo é 100% gratuito e assinado com chaves criptográficas oficiais. Permite receber alertas na barra de notificações do telemóvel sempre que um novo imóvel é adicionado e aceder ao catálogo de forma instantânea sem consumir dados excessivos.'
    }
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50 antialiased font-sans">
      
      {/* 1. HERO INSTITUCIONAL (Texto à Esquerda, Imagem à Direita) */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center bg-gradient-to-br from-[#0F1316] via-[#161C20] to-[#1F272D] text-white overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Fundo Arquitetónico Sutil */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
            alt="Grupo BNG - Imóveis e Negócios"
            className="w-full h-full object-cover opacity-15 filter brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1316] via-[#0F1316]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna da Esquerda */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
              Grupo BNG • Moçambique
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.15] text-white">
              Soluções Integradas de Alto Padrão em{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
                Imóveis, Facilidades & Negócios
              </span>
            </h1>

            <p className="max-w-2xl text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Seja bem-vindo ao portal corporativo oficial do <strong>Grupo BNG</strong>. Conectamos investidores, famílias e empresas às melhores oportunidades imobiliárias em Moçambique, com serviços de excelência em higienização e procurement.
            </p>

            {/* Botões de Ação */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('imobiliario')}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C89B3C] to-[#AA7C1E] hover:opacity-95 text-[#14181B] font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-[#C89B3C]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Building2 className="w-5 h-5" />
                <span>Explorar Imobiliário</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('baixar-app')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 border border-white/20 backdrop-blur-md transition-all"
              >
                <Smartphone className="w-5 h-5 text-[#C89B3C]" />
                <span>Baixar Aplicativo Android</span>
              </button>
            </div>

            {/* Micro Indicadores de Confiança */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#D4AF37]">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">Verificação Legal</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">+5 Anos</div>
                <div className="text-[11px] text-slate-400 font-medium">No Mercado</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">24/7</div>
                <div className="text-[11px] text-slate-400 font-medium">Suporte WhatsApp</div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Imagem com Efeito Dourado */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37]/30 to-[#C89B3C]/20 rounded-3xl blur-xl opacity-75"></div>

              <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 bg-[#14181B] shadow-2xl shadow-black/60 group">
                <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
                    alt="Imóveis de Luxo Grupo BNG em Moçambique"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                </div>

                <div className="absolute top-4 right-4 bg-[#14181B]/85 backdrop-blur-md border border-[#D4AF37]/40 px-3 py-1.5 rounded-full text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span>Portfólio Selecionado</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#12161A]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C89B3C] flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-md">
                        <Building2 className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">Imóveis em Moçambique</h4>
                        <p className="text-[11px] text-slate-300">Maputo, Matola, Boane & Províncias</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('imobiliario')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-slate-900 text-xs font-bold text-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                      Ver Imóveis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Dinâmico de Transações em Tempo Real */}
      <LiveTransactionsTicker />

      {/* 2. FAIXA DE PARCEIROS & PROVA SOCIAL (Clientes Institucionais) */}
      <section className="bg-[#14191E] border-y border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-6">
            Empresas, Condomínios e Instituições que Confiam no Grupo BNG
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center text-slate-400 text-xs font-bold">
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <Building2 className="w-4 h-4 text-[#C89B3C]" />
              <span>Bancos & Finanças</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
              <span>Embaixadas & ONGs</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <Handshake className="w-4 h-4 text-[#C89B3C]" />
              <span>Empresas Mineiras</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <span>Condomínios Fechados</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <ShoppingBag className="w-4 h-4 text-[#C89B3C]" />
              <span>PMEs & Escritórios</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
              <Award className="w-4 h-4 text-[#C89B3C]" />
              <span>Construtoras Civis</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AS 4 GRANDES VERTICAIS DO GRUPO BNG */}
      <section className="py-16 md:py-24 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#C89B3C] text-xs font-bold uppercase tracking-wider mb-3">
            Nossas Divisões de Atuação
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Excelência Operacional em Cada Segmento
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Escolha uma das nossas áreas de especialidade para aceder a serviços com suporte corporativo direto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Imobiliário */}
          <div className="group bg-slate-50 hover:bg-[#12161A] border border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-[#C89B3C] text-[#C89B3C] group-hover:text-slate-900 flex items-center justify-center mb-5 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                Divisão Imobiliária
              </h3>
              <p className="text-slate-600 group-hover:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 transition-colors">
                Catálogo selecionado de vivendas, apartamentos e terrenos em Maputo, Matola, Boane e todo o país com verificação jurídica.
              </p>
            </div>
            <button
              onClick={() => onNavigate('imobiliario')}
              className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#C89B3C] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 group-hover:border-transparent transition-all shadow-sm"
            >
              <span>Aceder aos Imóveis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Limpeza & Facility */}
          <div className="group bg-slate-50 hover:bg-[#12161A] border border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-[#C89B3C] text-[#C89B3C] group-hover:text-slate-900 flex items-center justify-center mb-5 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                Limpeza & Facility
              </h3>
              <p className="text-slate-600 group-hover:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 transition-colors">
                Higienização corporativa, limpeza pós-obra especializada, tratamento de estofos e manutenção periódica de instalações.
              </p>
            </div>
            <button
              onClick={() => onNavigate('servicos', 'limpeza')}
              className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#C89B3C] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 group-hover:border-transparent transition-all shadow-sm"
            >
              <span>Ver Serviços de Limpeza</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Procurement & Negócios */}
          <div className="group bg-slate-50 hover:bg-[#12161A] border border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-slate-900 flex items-center justify-center mb-5 transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                Procurement & Negócios
              </h3>
              <p className="text-slate-600 group-hover:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 transition-colors">
                Aprovisionamento de bens empresariais, compras institucionais, fornecimento de materiais e suprimentos de suporte comercial.
              </p>
            </div>
            <button
              onClick={() => onNavigate('servicos', 'procurement')}
              className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-emerald-500 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 group-hover:border-transparent transition-all shadow-sm"
            >
              <span>Conhecer Procurement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Aplicativo Nativo */}
          <div className="group bg-slate-50 hover:bg-[#12161A] border border-slate-200 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-[#C89B3C] text-[#C89B3C] group-hover:text-slate-900 flex items-center justify-center mb-5 transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                App Mobile BNG Imóvel
              </h3>
              <p className="text-slate-600 group-hover:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 transition-colors">
                Receba alertas instantâneos no telemóvel quando novos imóveis entrarem no catálogo. 100% gratuito e offline.
              </p>
            </div>
            <button
              onClick={() => onNavigate('baixar-app')}
              className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#C89B3C] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 group-hover:border-transparent transition-all shadow-sm"
            >
              <span>Baixar Aplicativo (APK)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. PAINEL DE MÉTRICAS E NÚMEROS DE IMPACTO */}
      <section className="bg-gradient-to-r from-[#111518] via-[#171E24] to-[#111518] text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-[#D4AF37] font-display">+500</div>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">Imóveis Mediados & Avaliados</p>
            <p className="text-[11px] text-slate-500">Maputo, Matola, Boane e Províncias</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-white font-display">+120</div>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">Empresas Atendidas</p>
            <p className="text-[11px] text-slate-500">Em Facility, Limpeza e Procurement</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-[#D4AF37] font-display">100%</div>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">Segurança Jurídica & DUAT</p>
            <p className="text-[11px] text-slate-500">Auditoria documental prévia rigorosa</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black text-white font-display">24/7</div>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">Plantão Direto no WhatsApp</p>
            <p className="text-[11px] text-slate-500">Resposta e agendamento imediato</p>
          </div>
        </div>
      </section>

      {/* 5. DESTAQUES DO CATÁLOGO DE IMÓVEIS */}
      {featuredListings.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
                  Oportunidades em Destaque
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                  Imóveis Recém-Cadastrados
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Explore as melhores opções selecionadas pela nossa equipa de consultores.
                </p>
              </div>
              <button
                onClick={() => onNavigate('imobiliario')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#C89B3C] hover:text-[#AA7C1E] transition-colors"
              >
                <span>Ver todos os imóveis no Imobiliário</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.slice(0, 3).map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={onSelectListing}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Simulador Interativo de Financiamento e Rendimento */}
      <InvestmentSimulator />

      {/* 6. SEGURANÇA JURÍDICA: GARANTIA DE DUAT & AUDITORIA PREDIAL */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Proteção Contra Burlas e Litígios
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
                Segurança Jurídica Total: <br />
                <span className="text-[#C89B3C]">Garantia de DUAT & Auditoria Predial</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sabemos que adquirir um imóvel ou terreno em Moçambique exige cautela máxima. No <strong>Grupo BNG</strong>, nenhum imóvel é anunciado sem validação legal prévia nas instituições oficiais competentes.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#C89B3C] shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Verificação de DUAT & Cadastro Municipal</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Confirmamos a regularidade da titularidade junto do Conselho Municipal e Direção de Terras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#C89B3C] shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Certidão da Conservatória do Registo Predial</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Auditoria de ónus, encargos, hipotecas bancárias ou penhoras ativas sobre a propriedade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#C89B3C] shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Assessoria Contratual & Notarial</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Acompanhamento jurídico completo do Contrato-Promessa até a outorga da Escritura Pública.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 group">
                <img
                  src="/duat_legal_audit.jpg"
                  alt="Auditoria de DUAT e Escritura Notarial Grupo BNG"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
              </div>

              {/* Card Flutuante de Certificação com Animação */}
              <div className="absolute -bottom-6 sm:-bottom-8 -left-4 sm:left-6 bg-[#12161A]/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-[#D4AF37]/30 max-w-xs animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C89B3C] text-slate-900 flex items-center justify-center shrink-0 shadow-lg">
                    <Scale className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <h5 className="font-bold text-sm text-white">Garantia BNG</h5>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">DUAT 100% Auditado • Registo Predial Válido em Moçambique</p>
                  </div>
                </div>
              </div>

              {/* Selo Dourado Superior */}
              <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Auditoria Notarial Oficial</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BLOCO INSTITUCIONAL: QUEM SOMOS & VISÃO CORPORATIVA */}
      <section className="py-20 bg-slate-900 text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"
                  alt="Sede Corporativa Grupo BNG"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider block mb-1">
                    Sociedade Moçambicana Registada
                  </span>
                  <h4 className="text-lg font-bold text-white">Grupo BNG Imobiliária & Negócios Lda</h4>
                  <p className="text-xs text-slate-300">Maputo • Matola • Moçambique</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Compromisso Institucional
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
                Construímos Relações de Longo Prazo Baseadas em Rigor e Transparência
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                O <strong>Grupo BNG</strong> nasceu com o objetivo de elevar o padrão do mercado de mediação imobiliária e prestação de serviços corporativos em Moçambique. Atuamos com base em três pilares fundamentais:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#D4AF37] font-bold text-sm mb-1">Integridade</div>
                  <p className="text-xs text-slate-400">Negócios transparentes com informações exatas e documentação auditada.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#D4AF37] font-bold text-sm mb-1">Rigor Técnico</div>
                  <p className="text-xs text-slate-400">Equipas especializadas e maquinário industrial certificado.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[#D4AF37] font-bold text-sm mb-1">Conformidade</div>
                  <p className="text-xs text-slate-400">Faturação oficial com NUIT e cumprimento dos prazos estabelecidos.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('contato')}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-900 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm hover:opacity-95 transition"
                >
                  Falar com a Direção do Grupo BNG
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FLUXO DE TRABALHO: COMO FUNCIONA O NOSSO PROCESSO (4 PASSOS) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
              Processo Transparente
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Como Trabalhamos do Início ao Fim
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Um método estruturado que garante eficiência e pontualidade na entrega dos seus resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Consulta Inicial</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Entendimento claro dos seus objetivos: compra, venda, higienização pós-obra ou cotação de procurement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Vistoria & Auditoria</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Visita presencial no local pelo corretor ou técnico para levantamento minucioso das características.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Proposta & Contrato</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Apresentação formal da proposta com cláusulas transparentes, valores definidos e emissão de fatura/cotação.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C89B3C] text-slate-900 font-bold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Conclusão com Sucesso</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Entrega da chave, escritura final ou conclusão dos serviços corporativos com garantia de satisfação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTEMUNHOS & CASOS DE SUCESSO DE CLIENTES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
              Prova Social & Credibilidade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              O Que Dizem os Nossos Clientes e Parceiros
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Depoimentos reais de quem confiou nos serviços do Grupo BNG em Moçambique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testemunho 1: Imobiliário */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "Comprar a nossa vivenda na Matola através do Grupo BNG foi a melhor decisão. Verificaram todo o DUAT na Conservatória e cuidaram de todo o processo notarial com extrema competência."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-[#D4AF37] font-bold flex items-center justify-center text-sm">
                  EM
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Eng. Eugénio Mabunda</h5>
                  <p className="text-[11px] text-slate-500">Comprador Residencial • Matola</p>
                </div>
              </div>
            </div>

            {/* Testemunho 2: Limpeza & Facility */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "Contratámos o serviço de limpeza pós-obra para a inauguração dos nossos escritórios corporativos em Maputo. Equipa fardada, pontual e acabamento de alto padrão. Recomendo vivamente."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                  SC
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Dra. Sónia Cossa</h5>
                  <p className="text-[11px] text-slate-500">Diretora de Operações • Empresa de Consultoria</p>
                </div>
              </div>
            </div>

            {/* Testemunho 3: Procurement & Suprimentos */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "Fornecimento impecável de equipamentos de segurança (EPIs) e consumíveis para as nossas obras. Cotação rápida e faturas em perfeita conformidade fiscal."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-[#14181B] text-[#D4AF37] font-bold flex items-center justify-center text-sm">
                  AM
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Arqt. Armindo Macuácua</h5>
                  <p className="text-[11px] text-slate-500">Gestor de Obras • Maputo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PERGUNTAS FREQUENTES (FAQ ACORDEÃO INTERATIVO) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
              Tire as Suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Respostas claras sobre os nossos serviços imobiliários, corporativos e garantias.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-4 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#C89B3C]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 py-4 bg-white text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. BANNER DE CONTACTO RÁPIDO & FECHO COMERCIAL */}
      <section className="py-16 bg-gradient-to-r from-[#14181B] via-[#1B2228] to-[#14181B] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Atendimento Corporativo Imediato
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Pronto para Realizar o Seu Negócio com Segurança?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Fale agora com um dos nossos consultores especializados em Maputo e Matola pelo WhatsApp ou chamada direta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20falar%20com%20um%20consultor%20agora."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp: 88 009 6995</span>
            </a>

            <a
              href="tel:+258841524822"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#C89B3C]" />
              <span>Ligar: 84 152 4822</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
