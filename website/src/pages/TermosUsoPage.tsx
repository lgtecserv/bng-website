import React from 'react';
import { 
  FileCheck, 
  ShieldAlert, 
  Scale, 
  HelpCircle, 
  Building2, 
  AlertOctagon, 
  CheckCircle2, 
  Phone,
  Mail
} from 'lucide-react';

interface TermosUsoPageProps {
  onBackHome?: () => void;
}

export const TermosUsoPage: React.FC<TermosUsoPageProps> = ({ onBackHome }) => {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen text-slate-800">
      {/* Hero dos Termos de Uso */}
      <section className="relative bg-gradient-to-br from-[#101417] via-[#161D22] to-[#0D1012] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            Termos & Condições de Utilização Oficial
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Termos de Uso e Contrato de Serviços <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
              Grupo BNG Moçambique
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
            Regulamento oficial que rege a utilização do portal web, aplicativo móvel Android, catálogo de imóveis e prestação de serviços de mediação, limpeza corporativa e procurement pelo Grupo BNG Imobiliária & Negócios Lda.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span>Em vigor a partir de: Outubro de 2026</span>
            <span>•</span>
            <span>Jurisdição: República de Moçambique</span>
          </div>
        </div>
      </section>

      {/* Artigos e Cláusulas Detalhadas */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Advertência de Segurança e Vistoria Prévia */}
          <div className="bg-amber-500/10 border-2 border-[#C89B3C] p-6 rounded-3xl flex items-start gap-4 text-slate-900">
            <AlertOctagon className="w-8 h-8 text-[#C89B3C] shrink-0 mt-1" />
            <div className="space-y-1.5 text-xs sm:text-sm">
              <strong className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide block">
                Regra de Ouro da Mediação BNG • Vistoria Física Obrigatória
              </strong>
              <p className="text-slate-700 leading-relaxed font-normal">
                <strong>NUNCA entregue sinais financeiros, cauções ou adiantamentos</strong> a qualquer proprietário, anunciante ou terceiro sem a realização de uma vistoria presencial no imóvel acompanhado formalmente por um agente credenciado do Grupo BNG e sem a verificação da legitimidade dos documentos de DUAT e registo predial na respectiva Conservatória ou Conselho Municipal.
              </p>
            </div>
          </div>

          {/* Cláusula 1: Aceitação e Capacidade Legal */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <span>Aceitação dos Termos e Capacidade Jurídica</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Ao aceder, navegar, descarregar o aplicativo Android ou utilizar qualquer funcionalidade do portal do Grupo BNG, o utilizador declara ter capacidade jurídica plena (idade igual ou superior a 18 anos ou representação societária válida com poderes bastantes) e aceita integralmente estes Termos de Uso sem reservas. Caso não concorde com qualquer disposição aqui estabelecida, deverá cessar imediatamente a utilização da plataforma.
            </p>
          </div>

          {/* Cláusula 2: Natureza da Mediação Imobiliária */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <span>Natureza dos Serviços e Enquadramento Legal em Moçambique</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              O Grupo BNG atua como mediador e facilitador imobiliário autorizado, promovendo a aproximação idónea entre partes compradoras, vendedoras, senhorios e inquilinos em estrita consonância com a legislação da República de Moçambique:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Regime de Terras em Moçambique (Lei nº 19/97):</strong> A terra é propriedade exclusiva do Estado Moçambicano, não podendo ser vendida, alienada ou hipotecada como bem privado. As transações de terrenos dizem respeito à transmissão legal de benfeitorias, infraestruturas ou cessão do Direito de Uso e Aproveitamento da Terra (DUAT) mediante autorização das entidades competentes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Construções, Casas e Apartamentos:</strong> Os edifícios, moradias, frações autónomas de condomínios e construções são propriedade privada e podem ser livremente transacionados ou arrendados nos termos do Código Civil e da legislação de propriedade horizontal.
                </span>
              </li>
            </ul>
          </div>

          {/* Cláusula 3: Obrigações dos Anunciantes e Veracidade Documental */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <span>Regras para Anunciantes e Combate a Anúncios Falsos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Todo o utilizador que submeter um imóvel para publicação assume civil e criminalmente a responsabilidade pela veracidade das informações:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <strong className="text-slate-900 block mb-1">Titularidade ou Mandato Exclusivo:</strong>
                O anunciante deve ser o legítimo titular do bem ou mandatário com procuração bastante outorgada pelo proprietário.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <strong className="text-slate-900 block mb-1">Fotografias Reais e Autênticas:</strong>
                É expressamente proibido usar fotografias ilustrativas de outros imóveis ou que mascarem a condição física real do bem.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <strong className="text-slate-900 block mb-1">Preço Justo e Transparente:</strong>
                O valor divulgado deve ser o preço oficial em Meticais (MT), sendo proibida a sobretaxação especulativa não acordada.
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <strong className="text-slate-900 block mb-1">Tolerância Zero a Burlas:</strong>
                Tentativas de publicações de terrenos com litígio, duplicidade ou sem registo serão encaminhadas às autoridades policiais (SERNIC).
              </div>
            </div>
          </div>

          {/* Cláusula 4: Taxa de Moderação e Análise Editorial */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <span>Taxa de Moderação Editorial (150 MT)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              A submissão de anúncios no catálogo do Grupo BNG está sujeita ao pagamento de uma taxa fixa e simbólica de moderação de <strong>150 MT</strong>. Esta taxa destina-se a cobrir os custos operacionais de triagem humana, validação da documentação, auditoria contra duplicidade e manutenção dos servidores seguros. O pagamento da taxa não garante a aprovação automática de anúncios que violem estes termos ou cuja documentação não passe no crivo da equipa de auditoria.
            </p>
          </div>

          {/* Cláusula 5: Serviços Corporativos de Limpeza e Procurement */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">5</span>
              <span>Serviços de Limpeza & Procurement Corporativo</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Os pedidos de cotação para <strong>BNG Limpeza & Facility</strong> e <strong>BNG Procurement Corporativo</strong> regem-se por propostas comerciais autónomas e contratos específicos com NUIT e fatura oficial emitida pela sociedade Grupo BNG, incluindo garantias de qualidade de fornecimento e cumprimento das normas de higiene e segurança no trabalho (HST).
            </p>
          </div>

          {/* Cláusula 6: Propriedade Intelectual e Foro */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">6</span>
              <span>Propriedade Intelectual & Lei Aplicável</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Todos os elementos do website, aplicativo Android, design gráfico, marcas registadas, códigos de software e conteúdos editoriais são de propriedade exclusiva do Grupo BNG Imobiliária & Negócios Lda. Para resolução de qualquer litígio emergente da interpretação destes termos, é competente com expressa renúncia a qualquer outro o foro da <strong>Comarca de Maputo Cidade, República de Moçambique</strong>.
            </p>
          </div>

          {/* Contato de Esclarecimento */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Dúvidas sobre os Termos de Uso?</h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Fale com a Direção Jurídica do Grupo BNG através dos nossos canais oficiais.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:juridico@grupobngoficial.com"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition border border-white/10"
              >
                juridico@grupobngoficial.com
              </a>
              <a
                href="tel:+258841524822"
                className="px-4 py-2 rounded-xl bg-[#C89B3C] hover:bg-[#b6882c] text-xs font-black text-slate-950 transition shadow"
              >
                +258 84 152 4822
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
