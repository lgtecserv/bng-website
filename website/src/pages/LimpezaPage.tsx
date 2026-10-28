import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Building2, 
  FileCheck2, 
  FileSpreadsheet, 
  BadgeCheck, 
  Send,
  Home,
  Check
} from 'lucide-react';

export const LimpezaPage: React.FC = () => {
  const [calcService, setCalcService] = useState('pos_obra');
  const [calcCity, setCalcCity] = useState('Maputo Cidade');
  const [calcArea, setCalcArea] = useState('150');
  const [calcUrgency, setCalcUrgency] = useState('normal');

  const whatsappBaseUrl = "https://wa.me/258880096995?text=";

  const handleSimularCotacao = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLabels: Record<string, string> = {
      pos_obra: 'Limpeza Pós-Obra & Reabilitação',
      corporativa: 'Higienização Corporativa de Escritórios',
      estofos: 'Lavagem de Estofos, Cadeiras & Carpetes',
      vidros: 'Limpeza de Vidros em Altura & Fachadas',
      condominios: 'Gestão de Espaços Comuns & Condomínios',
      desinfecao: 'Desinfeção Industrial & Sanitização'
    };

    const msg = `Olá Grupo BNG! Solicito uma cotação formal para os serviços de Limpeza & Facility:
• Serviço: ${serviceLabels[calcService] || calcService}
• Cidade / Província: ${calcCity}
• Área / Quantidade: ${calcArea}
• Urgência: ${calcUrgency === 'urgente' ? 'Urgente (próximas 24-48h)' : 'Normal (nesta semana)'}
Gostaria de proposta comercial com faturação com NUIT.`;

    window.open(`${whatsappBaseUrl}${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      {/* Hero da Página de Limpeza & Facility */}
      <section className="relative bg-[#12161A] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C89B3C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C89B3C]/15 border border-[#C89B3C]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Divisão de Higienização e Conservação Profissional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            BNG Limpeza & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
              Facility Management
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Higienização técnica de escritórios, limpeza pós-obra especializada, tratamento de pisos, vidros em altura e gestão de condomínios em Maputo, Matola e em todo Moçambique.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, gostaria de agendar uma visita técnica ou orçamento para Limpeza e Facility Management.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Orçamento Imediato no WhatsApp</span>
            </a>

            <a
              href="#servicos-lista"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-white/15 transition-colors"
            >
              Ver Detalhes dos Serviços
            </a>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com os 6 Serviços Específicos */}
      <div id="servicos-lista" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Limpeza Pós-Obra */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80" 
                  alt="Técnico de Limpeza Pós-Obra com Equipamento Industrial" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                  Alta Demanda
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Limpeza Pós-Obra & Reabilitação
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Remoção técnica de tintas acrílicas, cimento, restos de argamassa, silicones e poeiras finas pós-construção ou reforma. Deixamos o seu imóvel impecável para mudança ou entrega das chaves.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Polimento e raspagem técnica de cerâmicas e porcelanatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Limpeza profunda de caixilharias, calhas e portas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Desinfeção de louças sanitárias, copas e armários embutidos</span>
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
                <span>Pedir Orçamento Pós-Obra</span>
              </a>
            </div>
          </div>

          {/* Card 2: Higienização Corporativa */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80" 
                  alt="Escritório Corporativo Higienizado" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 uppercase">
                  Planos Mensais
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Higienização Corporativa & Sedes
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Conservação diária ou programada para empresas, bancos, embaixadas e agências em Maputo e Matola, com cronograma rigoroso e supervisão regular.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Equipas uniformizadas, identificadas e com antecedentes verificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Fornecimento e reposição contínua de papel toalha e sabão</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Sanitização diária de mesas, teclados e salas de reunião</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, temos interesse num plano mensal de higienização de escritórios.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Orçamento Corporativo Mensal</span>
              </a>
            </div>
          </div>

          {/* Card 3: Estofos e Carpetes */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80" 
                  alt="Limpeza Profissional de Estofos com Extratora a Vácuo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                  Extração a Vácuo
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Lavagem de Sofás, Cadeiras & Carpetes
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Higienização profunda por extração a vácuo com produtos biodegradáveis e bactericidas, eliminando manchas difíceis, fungos e odores em sofás, cadeiras e tapetes.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Higienização profunda no local sem desbotar o tecido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Eliminação de 99.9% de ácaros e bactérias causadoras de alergias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Secagem rápida e aroma agradável no ambiente</span>
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

          {/* Card 4: Vidros em Altura e Fachadas */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80" 
                  alt="Técnicos Certificados em Limpeza de Vidros em Altura" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-cyan-400 uppercase">
                  Trabalho em Altura
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Limpeza de Vidros em Altura & Fachadas
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Equipas qualificadas para limpeza exterior e interior de vidraças, revestimentos de alumínio (ACM) e montras comerciais com arneses, andaimes e água pura desmineralizada.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Conformidade estrita com normas de segurança do trabalho</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Remoção de marcas de água da chuva, poeiras e incrustações</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Acabamento cristalino e duradouro sem riscos no vidro</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de cotação para Limpeza de Vidros e Fachadas em Altura.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Pedir Cotação de Fachadas</span>
              </a>
            </div>
          </div>

          {/* Card 5: Gestão de Condomínios */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" 
                  alt="Condomínio Residencial com Manutenção de Espaços Comuns" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                  Condomínios Fechados
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Gestão de Condomínios & Facilidades
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Conservação contínua de escadas, garagens, piscinas, áreas verdes e portarias em condomínios residenciais e complexos comerciais no Triunfo, Sommerschield, Matola e Boane.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Zeladoria diária, controle de resíduos e substituição de iluminação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Manutenção preventiva de bombas d'água e portões elétricos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Relatórios mensais transparentes para a comissão de moradores</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, temos interesse na gestão e conservação de condomínio.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Proposta para Condomínios</span>
              </a>
            </div>
          </div>

          {/* Card 6: Desinfeção Industrial */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=1000&q=80" 
                  alt="Desinfeção e Sanitização Industrial com Certificado" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase">
                  Controle Sanitário
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Desinfeção Industrial & Sanitização
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Nebulização e pulverização térmica para armazéns logísticos, cozinhas industriais, restaurantes e clínicas, com emissão de certificado oficial de conformidade sanitária.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Eliminação de 99.9% de microrganismos patogénicos e vírus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Controle de pragas urbanas e desbaratização profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>Produtos regulamentados com laudo técnico e segurança</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de sanitização industrial ou controle de pragas.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#C89B3C] hover:text-slate-950 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Pedir Sanitização Industrial</span>
              </a>
            </div>
          </div>

        </div>

        {/* Simulador Interativo de Cotação de Limpeza */}
        <section className="bg-gradient-to-br from-[#12161A] via-[#1B2227] to-[#12161A] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                Cotação Rápida de Limpeza
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                Calcule o Orçamento para o seu Espaço
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                Indique a área ou número de divisões para receber uma proposta formal com faturação com NUIT.
              </p>
            </div>

            <form onSubmit={handleSimularCotacao} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Serviço de Higienização
                  </label>
                  <select
                    value={calcService}
                    onChange={(e) => setCalcService(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <option value="pos_obra">Limpeza Pós-Obra & Reabilitação</option>
                    <option value="corporativa">Higienização Corporativa Contínua</option>
                    <option value="estofos">Lavagem de Estofos, Cadeiras & Carpetes</option>
                    <option value="vidros">Limpeza de Vidros & Fachadas em Altura</option>
                    <option value="condominios">Gestão de Espaços Comuns & Condomínios</option>
                    <option value="desinfecao">Desinfeção Industrial & Sanitização</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Província / Cidade
                  </label>
                  <select
                    value={calcCity}
                    onChange={(e) => setCalcCity(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Matola">Matola</option>
                    <option value="Boane / Marracuene">Boane / Marracuene</option>
                    <option value="Gaza / Xai-Xai">Gaza / Xai-Xai</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala / Beira">Sofala / Beira</option>
                    <option value="Nampula / Tete">Nampula / Tete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Dimensão Estimada
                  </label>
                  <input
                    type="text"
                    value={calcArea}
                    onChange={(e) => setCalcArea(e.target.value)}
                    placeholder="Ex: 180 m², T3, ou 8 sofás"
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Urgência de Execução
                  </label>
                  <select
                    value={calcUrgency}
                    onChange={(e) => setCalcUrgency(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-[#C89B3C] transition"
                  >
                    <option value="normal">Normal (Dentro desta semana)</option>
                    <option value="urgente">Urgente (Próximas 24h a 48h)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <span>Proposta comercial sem compromisso com faturação oficial.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] hover:opacity-95 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Gerar Cotação no WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};
