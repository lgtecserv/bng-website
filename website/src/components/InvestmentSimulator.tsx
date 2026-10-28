import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Percent,
  Calendar,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

export const InvestmentSimulator: React.FC = () => {
  // Estado dos Inputs (Clicáveis e Editáveis por Digitação)
  const [propertyPrice, setPropertyPrice] = useState<number>(1500000); // Mínimo 100 mil, default 1.5M MT
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(300000); // 20% default
  const [termMonths, setTermMonths] = useState<number>(60); // Mínimo 3 meses, default 5 anos (60 meses)
  const [interestRate, setInterestRate] = useState<number>(18.5); // Taxa prime indicativa em MZ
  const [activeTab, setActiveTab] = useState<'prestacao' | 'retorno'>('prestacao');

  // Sincronização inteligente: quando o preço muda, ajusta a entrada se necessário
  const handlePriceChange = (val: number) => {
    const cleanVal = Math.max(0, val);
    setPropertyPrice(cleanVal);
    // Mantém a entrada proporcional se já existir
    if (downPaymentAmount > cleanVal) {
      setDownPaymentAmount(Math.round(cleanVal * 0.2));
    }
  };

  const handleDownPaymentChange = (val: number) => {
    const cleanVal = Math.max(0, val);
    setDownPaymentAmount(cleanVal);
  };

  const handleMonthsChange = (val: number) => {
    // Prazo mínimo: 3 meses
    const cleanVal = Math.max(3, val);
    setTermMonths(cleanVal);
  };

  // Cálculo Detalhado e Transparente
  const calculation = useMemo(() => {
    const validPrice = Math.max(100000, propertyPrice || 0);
    const validDownPayment = Math.min(validPrice, Math.max(0, downPaymentAmount || 0));
    const downPaymentPercent = validPrice > 0 ? ((validDownPayment / validPrice) * 100) : 0;
    const loanAmount = Math.max(0, validPrice - validDownPayment);
    const validMonths = Math.max(3, termMonths || 3);
    const yearsEquivalent = (validMonths / 12).toFixed(1);

    // Cálculo da Prestação Mensal
    let monthlyPayment = 0;
    let totalPaid = validDownPayment;
    let totalInterest = 0;

    if (loanAmount > 0) {
      const monthlyRate = (interestRate / 100) / 12;
      monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, validMonths))) /
        (Math.pow(1 + monthlyRate, validMonths) - 1);

      totalPaid = validDownPayment + (monthlyPayment * validMonths);
      totalInterest = (monthlyPayment * validMonths) - loanAmount;
    }

    // Modo Rendimento de Arrendamento (Yield)
    const estimatedMonthlyRent = Math.round(validPrice * 0.0075); // ~9% anuais média em Maputo/Matola
    const annualRentalIncome = estimatedMonthlyRent * 12;
    const yieldPercentage = ((annualRentalIncome / validPrice) * 100).toFixed(1);
    const paybackYears = (validPrice / annualRentalIncome).toFixed(1);

    return {
      price: validPrice,
      downPayment: validDownPayment,
      downPaymentPercent: downPaymentPercent.toFixed(1),
      loanAmount,
      termMonths: validMonths,
      yearsEquivalent,
      monthlyPayment: Math.round(monthlyPayment),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
      estimatedMonthlyRent,
      annualRentalIncome,
      yieldPercentage,
      paybackYears
    };
  }, [propertyPrice, downPaymentAmount, termMonths, interestRate]);

  const formatMT = (val: number) => {
    return (val || 0).toLocaleString('pt-MZ') + ' MT';
  };

  const whatsappMessage = activeTab === 'prestacao'
    ? `Olá Grupo BNG, fiz uma simulação de financiamento no vosso website:\n- Valor do Imóvel: ${formatMT(calculation.price)}\n- Entrada: ${formatMT(calculation.downPayment)} (${calculation.downPaymentPercent}%)\n- Montante Financiado: ${formatMT(calculation.loanAmount)}\n- Prazo: ${calculation.termMonths} meses (${calculation.yearsEquivalent} anos)\n- Prestação Mensal Estimada: ${formatMT(calculation.monthlyPayment)}/mês.\nGostaria de aconselhamento especializado.`
    : `Olá Grupo BNG, fiz uma simulação de rentabilidade de investimento no website:\n- Valor do Imóvel: ${formatMT(calculation.price)}\n- Renda Mensal Estimada: ${formatMT(calculation.estimatedMonthlyRent)}/mês\n- Retorno Anual (Yield): ~${calculation.yieldPercentage}%\nGostaria de conhecer opções de investimento.`;

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho do Simulador */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#C89B3C] text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Simulador Editável em Tempo Real
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Simulador de Financiamento & Investimento
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Digite ou ajuste os valores nos campos editáveis abaixo para ver um cálculo detalhado e transparente.
          </p>
        </div>

        {/* Caixa Interativa de Dois Lados */}
        <div className="bg-[#12161A] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Lado Esquerdo: Campos Editáveis e Controles */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Seletor de Modo (Abas) */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 max-w-md">
              <button
                onClick={() => setActiveTab('prestacao')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'prestacao'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Comprar / Financiamento
              </button>
              <button
                onClick={() => setActiveTab('retorno')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'retorno'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Investimento / Renda de Arrendamento
              </button>
            </div>

            {/* Campo 1: Valor do Imóvel (Editável por digitação + Slider com mínimo de 100 mil MT) */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Valor do Imóvel (Mínimo: 100.000 MT)</span>
                </label>
                
                {/* Caixa de Texto Editável para Digitar */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-[#D4AF37]/50 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#D4AF37]">
                  <input
                    type="number"
                    min={100000}
                    step={50000}
                    value={propertyPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="bg-transparent text-right font-black text-[#D4AF37] text-base w-32 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">MT</span>
                </div>
              </div>

              {/* Slider de Apoio */}
              <input
                type="range"
                min={100000}
                max={30000000}
                step={100000}
                value={Math.min(30000000, Math.max(100000, propertyPrice))}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
                <span>100 Mil MT</span>
                <span>5M MT</span>
                <span>15M MT</span>
                <span>30M+ MT</span>
              </div>
            </div>

            {/* Campo 2: Valor de Entrada (Editável por digitação em MT) */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Valor de Entrada Própria
                  </label>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">
                    Equivale a {calculation.downPaymentPercent}% do imóvel
                  </span>
                </div>

                {/* Caixa Editável para Digitar Entrada */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-[#D4AF37]/50 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#D4AF37]">
                  <input
                    type="number"
                    min={0}
                    max={propertyPrice}
                    step={25000}
                    value={downPaymentAmount}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="bg-transparent text-right font-black text-white text-sm sm:text-base w-32 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">MT</span>
                </div>
              </div>

              {/* Slider Percentual de Entrada */}
              <input
                type="range"
                min={0}
                max={propertyPrice}
                step={25000}
                value={Math.min(propertyPrice, downPaymentAmount)}
                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />

              {/* Botões Rápidos de % de Entrada */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">Atalhos:</span>
                {[10, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPaymentAmount(Math.round((propertyPrice * pct) / 100))}
                    className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-slate-900 text-[11px] font-bold text-slate-300 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Campo 3: Prazo de Pagamento (Mínimo: 3 meses, editável por digitação) */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Prazo de Pagamento (Mínimo: 3 Meses)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Equivalente a <strong>{calculation.yearsEquivalent} anos</strong>
                  </span>
                </div>

                {/* Caixa Editável para Digitar os Meses */}
                <div className="flex items-center gap-1.5 bg-black/40 border border-[#D4AF37]/50 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#D4AF37]">
                  <input
                    type="number"
                    min={3}
                    max={360}
                    step={1}
                    value={termMonths}
                    onChange={(e) => handleMonthsChange(Number(e.target.value))}
                    className="bg-transparent text-right font-black text-white text-sm sm:text-base w-20 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">Meses</span>
                </div>
              </div>

              {/* Slider de Meses */}
              <input
                type="range"
                min={3}
                max={240}
                step={3}
                value={Math.min(240, Math.max(3, termMonths))}
                onChange={(e) => handleMonthsChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />

              {/* Atalhos Rápidos de Prazo */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">Prazos comuns:</span>
                {[
                  { label: '3 Meses', months: 3 },
                  { label: '6 Meses', months: 6 },
                  { label: '1 Ano (12m)', months: 12 },
                  { label: '3 Anos (36m)', months: 36 },
                  { label: '5 Anos (60m)', months: 60 },
                  { label: '10 Anos (120m)', months: 120 },
                  { label: '15 Anos (180m)', months: 180 },
                ].map((item) => (
                  <button
                    key={item.months}
                    type="button"
                    onClick={() => setTermMonths(item.months)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                      termMonths === item.months 
                        ? 'bg-[#D4AF37] text-slate-900 font-extrabold' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Lado Direito: Detalhamento Transparente & Claro dos Resultados */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#161C20] to-[#0D1012] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  {activeTab === 'prestacao' ? 'Quadro Detalhado do Financiamento' : 'Projeção de Retorno do Investimento'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold">
                  Simulação Ativa
                </span>
              </div>

              {activeTab === 'prestacao' ? (
                /* Modo 1: Financiamento Detalhado */
                <div className="space-y-5">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Prestação Mensal Estimada:
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#D4AF37] font-display">
                      {formatMT(calculation.monthlyPayment)}
                      <span className="text-xs font-bold text-slate-400 ml-1.5">/mês</span>
                    </div>
                  </div>

                  {/* Tabela de Discriminação Clara */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Valor Total do Imóvel:</span>
                      <strong className="text-white font-bold">{formatMT(calculation.price)}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Entrada Própria ({calculation.downPaymentPercent}%):</span>
                      <strong className="text-emerald-400 font-bold">{formatMT(calculation.downPayment)}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">Montante Financiado:</span>
                      <strong className="text-white font-bold">{formatMT(calculation.loanAmount)}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Prazo Acordado:</span>
                      <strong className="text-white font-bold">{calculation.termMonths} meses ({calculation.yearsEquivalent} anos)</strong>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">Custo Total Estimado:</span>
                      <strong className="text-[#D4AF37] font-bold">{formatMT(calculation.totalPaid)}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    * Taxa indicativa padrão do mercado bancário nacional. Condições personalizadas sob consulta.
                  </p>
                </div>
              ) : (
                /* Modo 2: Rendimento de Arrendamento Detalhado */
                <div className="space-y-5">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Renda Mensal Bruta Estimada:
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">
                      {formatMT(calculation.estimatedMonthlyRent)}
                      <span className="text-xs font-bold text-slate-400 ml-1.5">/mês</span>
                    </div>
                  </div>

                  {/* Tabela de Discriminação do Rendimento */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Património Investido:</span>
                      <strong className="text-white font-bold">{formatMT(calculation.price)}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Rendimento Bruto Anual:</span>
                      <strong className="text-emerald-400 font-bold">{formatMT(calculation.annualRentalIncome)}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">Taxa de Rentabilidade (Yield):</span>
                      <strong className="text-[#D4AF37] font-bold">~{calculation.yieldPercentage}% ao ano</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tempo Estimado de Payback:</span>
                      <strong className="text-white font-bold">~{calculation.paybackYears} anos</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    * Baseado nas médias de arrendamento residencial e comercial nas zonas nobres de Maputo e Matola.
                  </p>
                </div>
              )}

              {/* Botão de Encaminhamento Direto para o Consultor BNG */}
              <a
                href={`https://wa.me/258880096995?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C89B3C] to-[#AA7C1E] text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#C89B3C]/20 hover:opacity-95 transition-all text-center block"
              >
                <MessageSquare className="w-4 h-4 text-slate-900" />
                <span>Consultar Especialista BNG com Estes Dados</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
