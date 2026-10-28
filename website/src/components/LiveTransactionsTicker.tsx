import React from 'react';
import { CheckCircle2, TrendingUp, Sparkles, Building2, ShoppingBag, Clock } from 'lucide-react';

export const LiveTransactionsTicker: React.FC = () => {
  const transactions = [
    {
      type: 'venda',
      badge: 'Venda Concluída',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      text: 'Vivenda T4 no Triunfo, Maputo',
      detail: 'DUAT & Registo Predial Auditado',
      time: 'Há 12 min'
    },
    {
      type: 'visita',
      badge: 'Visita Agendada',
      badgeColor: 'bg-amber-500/20 text-[#D4AF37] border-amber-500/30',
      text: 'Apartamento T3 na Polana Cimento',
      detail: 'Corretor BNG em Acompanhamento',
      time: 'Há 25 min'
    },
    {
      type: 'limpeza',
      badge: 'BNG Facility',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      text: 'Higienização Pós-Obra entregue na Matola',
      detail: 'Certificado de Higiene Emitido',
      time: 'Há 40 min'
    },
    {
      type: 'procurement',
      badge: 'Procurement',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      text: 'Fornecimento de EPIs e Papelaria entregue',
      detail: 'Faturação com NUIT Conforme',
      time: 'Há 1h'
    },
    {
      type: 'arrendamento',
      badge: 'Arrendamento',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      text: 'Escritório Executivo no Bairro Central',
      detail: 'Contrato Formal Assinado',
      time: 'Há 2h'
    },
    {
      type: 'novo',
      badge: 'Novo Imóvel',
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30',
      text: 'Terreno de 20x40m em Boane',
      detail: 'Titularidade Verificada',
      time: 'Hoje'
    }
  ];

  // Duplicamos a lista para criar um loop horizontal contínuo e infinito
  const fullList = [...transactions, ...transactions];

  return (
    <div className="bg-[#0C0F12] border-b border-white/10 text-white overflow-hidden py-2.5 relative select-none">
      {/* Indicador Flutuante Fixo à Esquerda */}
      <div className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-[#0C0F12] via-[#0C0F12] to-transparent pl-4 pr-6 flex items-center">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="hidden sm:inline">Transações em Tempo Real</span>
          <span className="sm:hidden">Ao Vivo</span>
        </div>
      </div>

      {/* Degradê de Saída à Direita */}
      <div className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-[#0C0F12] to-transparent pointer-events-none"></div>

      {/* Ticker Marquee Infinito */}
      <div className="flex items-center animate-marquee whitespace-nowrap pl-36 sm:pl-56">
        {fullList.map((tx, idx) => (
          <div 
            key={idx} 
            className="inline-flex items-center gap-2.5 mx-4 px-3 py-1 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 transition-colors"
          >
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${tx.badgeColor}`}>
              {tx.badge}
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {tx.text}
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              • {tx.detail}
            </span>
            <span className="text-[10px] text-[#D4AF37] font-medium flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {tx.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
