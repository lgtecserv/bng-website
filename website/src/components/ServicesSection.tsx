import React from 'react';
import { Building, Sparkles, Briefcase, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section id="servicos" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-[#C89B3C]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F3C35B] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>Ecossistema Corporativo de Excelência</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Serviços Estratégicos do <span className="gold-gradient-text">Grupo BNG</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Mais do que imóveis, oferecemos uma estrutura completa de soluções corporativas, facilities e procurement para impulsionar negócios e valorizar investimentos em Moçambique.
          </p>
        </div>

        {/* Grade dos 3 Serviços Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Serviço 1: Mediação & Gestão Imobiliária */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#C89B3C]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 flex items-center justify-center text-[#C89B3C] mb-6 group-hover:scale-110 transition-transform">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Mediação & Consultoria Imobiliária
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                Intermediação segura para compra, venda e arrendamento de propriedades residenciais, comerciais e industriais com verificação de DUAT e registo predial.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Avaliação precisa de valor de mercado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Segurança jurídica documental completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Gestão de contratos e património</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20consultoria%20sobre%20Mediacao%20Imobiliaria."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#C89B3C] text-white hover:text-[#14181B] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md group-hover:bg-[#C89B3C] group-hover:text-[#14181B]"
            >
              <span>Falar com Consultor</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Serviço 2: Limpeza & Facility Management */}
          <div className="bg-gradient-to-b from-white/10 to-white/5 border border-[#C89B3C]/40 rounded-3xl p-8 hover:border-[#C89B3C] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl relative">
            <div className="absolute -top-3.5 right-6 bg-[#C89B3C] text-[#14181B] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Mais Solicitado
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#C89B3C]/20 border border-[#C89B3C] flex items-center justify-center text-[#F3C35B] mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Limpeza & Facility Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                Higienização técnica especializada para edifícios corporativos, condomínios, pós-obra e residências de alto padrão em Maputo e Matola.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Limpeza industrial, escritórios e condomínios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Equipas uniformizadas, formadas e seguradas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Produtos ecológicos e equipamentos modernos</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20um%20orcamento%20para%20Limpeza%20e%20Facility."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
            >
              <span>Solicitar Orçamento</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Serviço 3: Procurement & Negócios Corporativos */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#C89B3C]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/30 flex items-center justify-center text-[#C89B3C] mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Procurement & Negócios Corporativos
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                Gestão de compras estratégicas, fornecimento de materiais e equipamentos para empresas privadas e instituições em todo o país.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Fornecimento B2B com pontualidade estrita</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Cadeia de suprimentos eficiente e confiável</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                  <span>Faturação e conformidade fiscal em Moçambique</span>
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20informacoes%20sobre%20Procurement%20e%20Negocios%20Corporativos."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#C89B3C] text-white hover:text-[#14181B] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md group-hover:bg-[#C89B3C] group-hover:text-[#14181B]"
            >
              <span>Falar com Consultor</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
