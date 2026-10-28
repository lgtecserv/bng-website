import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  FileSpreadsheet, 
  BadgeCheck, 
  Send,
  Truck,
  HardHat,
  Monitor,
  Printer
} from 'lucide-react';

export const ProcurementPage: React.FC = () => {
  const [calcService, setCalcService] = useState('papelaria');
  const [calcCity, setCalcCity] = useState('Maputo Cidade');
  const [calcQuantity, setCalcQuantity] = useState('50 caixas');
  const [calcUrgency, setCalcUrgency] = useState('normal');

  const whatsappBaseUrl = "https://wa.me/258880096995?text=";

  const handleSimularCotacao = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLabels: Record<string, string> = {
      papelaria: 'Suprimentos & Papelaria Empresarial (Toners/Papel A4)',
      epis: 'Equipamentos de Proteção Individual (EPIs Normatizados)',
      ti: 'Equipamentos Informáticos & Periféricos para Empresas',
      mobiliario: 'Mobiliário Corporativo & Postos Ergonómicos',
      sourcing: 'Sourcing & Compras Especiais sob Demanda',
      logistica: 'Logística de Cargas & Distribuição para Filiais'
    };

    const msg = `Olá Grupo BNG! Solicito uma cotação formal de Procurement Corporativo B2B:
• Categoria: ${serviceLabels[calcService] || calcService}
• Província / Destino: ${calcCity}
• Volume / Quantidade: ${calcQuantity}
• Urgência: ${calcUrgency === 'urgente' ? 'Urgente (entrega prioritária)' : 'Normal (planeamento semanal)'}
Solicitamos envio de fatura proforma com NUIT da nossa empresa.`;

    window.open(`${whatsappBaseUrl}${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      {/* Hero da Página de Procurement Corporativo */}
      <section className="relative bg-[#12161A] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Divisão de Aprovisionamento B2B e Suprimentos Corporativos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            BNG Procurement & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-[#D4AF37] bg-clip-text text-transparent">
              Negócios Corporativos
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Fornecimento contínuo de materiais de escritório, toners originais, equipamentos de segurança (EPIs), hardware informático e compras industriais com faturação fiscal com NUIT em Moçambique.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de uma cotação formal de Procurement Corporativo para a nossa empresa.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Solicitar Cotação B2B Formal</span>
            </a>

            <a
              href="#procurement-lista"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-white/15 transition-colors"
            >
              Ver Linhas de Suprimentos
            </a>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com os 6 Serviços Específicos de Procurement */}
      <div id="procurement-lista" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Suprimentos e Material de Escritório */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80" 
                  alt="Suprimentos de Escritório e Papelaria Corporativa Moderna" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 uppercase">
                  Consumíveis Originais
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Suprimentos & Papelaria Empresarial
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Fornecimento contínuo de papel A4/A3 de alta gramagem, toners originais HP, Canon, Brother e Kyocera, dossiers, pastas de arquivo e consumíveis essenciais com entrega direta nas suas instalações.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Toners 100% originais com garantia de rendimento por página</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contratos de reabastecimento quinzenal ou mensal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tabelas de preços especiais para compras por grosso</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de cotação para suprimentos de escritório e toners originais.")}`}
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
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80" 
                  alt="Equipamentos de Proteção Individual EPIs para Construção e Mineração" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase">
                  Normas Internacionais
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Equipamentos de Segurança (EPIs)
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Fornecimento normatizado de botas de segurança com biqueira de aço, capacetes de proteção industrial, coletes refletores EN471, óculos anti-impacto e fardamentos personalizados para a indústria e construção.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conformidade com a legislação de Higiene e Segurança no Trabalho</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bordado do logótipo da sua empresa em fardamentos de alta resistência</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Stock disponível para atendimento imediato de equipas em obra</span>
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

          {/* Card 3: Informática, Redes e Equipamentos de TI */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80" 
                  alt="Equipamentos Informáticos e Tecnologia Corporativa" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-400 uppercase">
                  Hardware & Redes
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Informática & Hardware Corporativo
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Fornecimento de computadores de secretária, portáteis profissionais (Dell, HP, Lenovo), impressoras multifunções em rede, no-breaks industriais e switches para infraestruturas empresariais.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Equipamentos novos com garantia de assistência técnica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No-breaks (UPS) para proteção contra oscilações na rede elétrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Apoio na montagem e configuração dos postos de trabalho</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de proposta para equipamentos de TI e informática.")}`}
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
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80" 
                  alt="Mobiliário Corporativo e Cadeiras de Escritório Ergonómicas" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] uppercase">
                  Design & Ergonomia
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Mobiliário Corporativo & Cadeiras
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Secretárias executivas e operacionais, mesas de reuniões, cadeiras giratórias ergonómicas com certificação de conforto lombar, armários arquivadores metálicos e biombos acústicos.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mobiliário robusto com acabamento resistente a riscos e uso diário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cadeiras ergonómicas ajustáveis para prevenir lesões posturais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Montagem técnica incluída no local sem custo adicional</span>
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
                <span>Pedir Catálogo de Mobiliário</span>
              </a>
            </div>
          </div>

          {/* Card 5: Sourcing Internacional & Compras Especiais */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80" 
                  alt="Armazém Logístico e Sourcing Internacional de Materiais" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-purple-400 uppercase">
                  Sourcing B2B
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Sourcing & Compras Sob Demanda
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Localização rápida de itens técnicos de difícil acesso no mercado nacional através de parceiros na África do Sul, Europa, Emirados e Ásia, com desembaraço fiscal completo.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pesquisa de mercado e negociação de preços de fábrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gestão completa do processo de importação e desembaraço</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Garantia de conformidade contratual e procedência dos itens</span>
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

          {/* Card 6: Logística Integrada & Armazenagem */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-52 overflow-hidden bg-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80" 
                  alt="Distribuição e Logística de Cargas em Moçambique" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-teal-400 uppercase">
                  Distribuição Provincial
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  Logística Integrada & Distribuição
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Consolidação e envio pontual de suprimentos para estaleiros, escritórios provinciais e minas em Moçambique (Maputo, Beira, Tete, Nampula e Pemba) com rastreio de entrega.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Guias de remessa organizadas e controle rigoroso de entrega</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Embalamento e proteção industrial para transporte em longa distância</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Faturação mensal unificada com NUIT para gestão orçamental</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`${whatsappBaseUrl}${encodeURIComponent("Olá Grupo BNG, necessito de apoio em logística de suprimentos corporativos.")}`}
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

        {/* Simulador Interativo de Cotação de Procurement */}
        <section className="bg-gradient-to-br from-[#12161A] via-[#1B2227] to-[#12161A] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                Cotação Corporativa B2B
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                Solicite uma Cotação com Preços de Fornecedor
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                Preencha a categoria pretendida para receber uma proposta formal com fatura com NUIT no seu e-mail ou WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSimularCotacao} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Linha de Fornecimento
                  </label>
                  <select
                    value={calcService}
                    onChange={(e) => setCalcService(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 transition"
                  >
                    <option value="papelaria">Suprimentos & Papelaria Empresarial (Toners/Papel A4)</option>
                    <option value="epis">Equipamentos de Proteção Individual (EPIs Normatizados)</option>
                    <option value="ti">Equipamentos Informáticos & Hardware Corporativo</option>
                    <option value="mobiliario">Mobiliário Corporativo & Postos Ergonómicos</option>
                    <option value="sourcing">Sourcing & Compras Especiais sob Demanda</option>
                    <option value="logistica">Logística de Cargas & Distribuição para Filiais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Província / Cidade de Entrega
                  </label>
                  <select
                    value={calcCity}
                    onChange={(e) => setCalcCity(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Maputo Cidade">Maputo Cidade (Polana, Sommerschield, Baixa, etc.)</option>
                    <option value="Matola">Matola (Centro, Fomento, Malhampsene)</option>
                    <option value="Boane / Marracuene">Boane / Marracuene</option>
                    <option value="Sofala / Beira">Sofala / Beira</option>
                    <option value="Tete">Tete (Moatize / Cidade)</option>
                    <option value="Nampula / Nacala">Nampula / Nacala</option>
                    <option value="Cabo Delgado / Pemba">Cabo Delgado / Pemba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Volume ou Quantidade Estimada
                  </label>
                  <input
                    type="text"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(e.target.value)}
                    placeholder="Ex: 50 caixas de papel, 30 pares de botas, 5 laptops"
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Prioridade da Encomenda
                  </label>
                  <select
                    value={calcUrgency}
                    onChange={(e) => setCalcUrgency(e.target.value)}
                    className="w-full bg-[#1A2026] border border-white/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-500 transition"
                  >
                    <option value="normal">Normal (Dentro desta semana)</option>
                    <option value="urgente">Urgente (Entrega prioritária)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cotação formal sem compromisso com faturação com NUIT.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Solicitar Cotação B2B</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};
