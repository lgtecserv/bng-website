import React from 'react';
import { 
  Users, 
  Handshake, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Building2, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Phone,
  Briefcase,
  BadgeAlert,
  Percent
} from 'lucide-react';

interface PoliticaParceriasPageProps {
  onBackHome?: () => void;
}

export const PoliticaParceriasPage: React.FC<PoliticaParceriasPageProps> = ({ onBackHome }) => {
  const whatsappUrl = `https://wa.me/258880096995?text=${encodeURIComponent(
    'Olá Direcção do Grupo BNG! Gostaria de estabelecer uma parceria de co-corretagem imobiliária oficial com a vossa empresa.'
  )}`;

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen text-slate-800">
      {/* Hero da Página de Parcerias */}
      <section className="relative bg-gradient-to-br from-[#101417] via-[#182026] to-[#0D1012] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Handshake className="w-4 h-4 text-[#D4AF37]" />
            Rede Oficial de Co-Corretagem & Parcerias Imobiliárias
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Políticas de Parcerias e Co-Corretagem <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
              Grupo BNG & Imobiliárias Parceiras
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
            Regulamento oficial que define os termos de cooperação profissional, partilha de comissões, proteção mútua de clientes e a regra estrita de intermediação única entre o Grupo BNG e agências imobiliárias ou corretores independentes credenciados em Moçambique.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>Regulamento em vigor: 2026</span>
            <span>•</span>
            <span>Segurança Jurídica & Repartição 50/50</span>
            <span>•</span>
            <span>Máximo 1 Intermediário na Cadeia</span>
          </div>
        </div>
      </section>

      {/* Conteúdo Detalhado e Normativo */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* DESTAQUE PRINCIPAL: A REGRA DE OURO DO MÁXIMO 1 INTERMEDIÁRIO */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 border-2 border-[#C89B3C] p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
            <div className="flex items-center space-x-3 text-[#C89B3C]">
              <BadgeAlert className="w-8 h-8 text-[#9B7423] shrink-0" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                  Princípio Fundamental do Grupo BNG
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-slate-950">
                  Regra Estrita de Intermediação Única (Máximo 1 Intermediário)
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              No Grupo BNG, prezamos pela seriedade, segurança jurídica dos proprietários e transparência total com os clientes. Por esta razão, <strong>aceitamos estritamente no máximo 1 (um) intermediário parceiro</strong> por cada imóvel ou transação comercial.
            </p>

            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
              <strong className="text-slate-900 block font-black">
                Como funciona na prática se existirem outros terceiros na cadeia do parceiro?
              </strong>
              <ul className="space-y-2 list-disc pl-5 leading-relaxed font-light">
                <li>
                  <strong>Interlocutor Único Reconhecido:</strong> Se uma imobiliária ou corretor nos contactar com um cliente (ou se o Grupo BNG o contactar para angariar um imóvel da sua carteira), <strong>nós tratamos única e exclusivamente com essa pessoa ou entidade que nos contactou diretamente</strong>.
                </li>
                <li>
                  <strong>Responsabilidade Exclusiva de Sub-Divisão:</strong> Se o nosso parceiro direto tiver consigo outros corretores, informantes ou intermediários adicionais envolvidos do seu lado, <strong>ele próprio é o único e total responsável por acertar e partilhar a sua comissão com os seus respetivos terceiros</strong>.
                </li>
                <li>
                  <strong>Proteção Contra Correntes Infinitas:</strong> O Grupo BNG <strong>NÃO</strong> negocia, não faz reuniões, não reparte pagamentos fracionados nem responde perante correntes de múltiplos intermediários avulsos ("intermediário do intermediário do intermediário"). O nosso contrato e pagamento de comissão é efetuado a 100% apenas ao nosso parceiro direto cadastrado.
                </li>
              </ul>
            </div>
          </div>

          {/* 1. Modelos de Parceria em Co-Corretagem */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <span>Modelos de Parceria e Divisão de Comissão (50% / 50%)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              A co-corretagem entre o Grupo BNG e agências parceiras é baseada no princípio internacional de ganho mútuo e divisão equitativa:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs uppercase text-[#C89B3C]">Cenário A</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">50% / 50%</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Parceiro tem o Cliente • BNG tem o Imóvel</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  A imobiliária parceira tem um comprador ou arrendatário qualificado com orçamento pronto e solicita a visita a um imóvel da carteira oficial do Grupo BNG. A comissão líquida total da operação será dividida em 50% para a parceira e 50% para o Grupo BNG após a conclusão do negócio.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs uppercase text-[#C89B3C]">Cenário B</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">50% / 50%</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">BNG tem o Cliente • Parceiro tem o Imóvel</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  O Grupo BNG tem um investidor ou comprador à procura de um imóvel específico e acede à carteira da imobiliária parceira. A parceira garante a exclusividade/titularidade do imóvel perante o proprietário e a comissão da transação é igualmente partilhada em 50% para cada agência.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Protocolo de Visitas e Ficha de Registo do Cliente (Não-Circunvenção) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <span>Registo Prévio de Cliente & Cláusula de Não-Circunvenção (NCND)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Para proteger os direitos e o trabalho comercial de ambas as partes, as visitas e contactos obedecem a regras formais invioláveis:
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ficha de Visita & Registo de Cliente:</strong> Antes da realização da visita física ao imóvel, a imobiliária ou corretor parceiro deve enviar por escrito (WhatsApp oficial ou e-mail corporativo) o nome completo e contacto do cliente que irá acompanhar.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
                <div>
                  <strong>Prazo de Proteção de 180 Dias:</strong> Uma vez registado o cliente na ficha de visita conjunta, nenhuma das partes poderá negociar diretamente com esse cliente ou fechar o negócio pelas costas do parceiro pelo período de 180 (cento e oitenta) dias.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <Scale className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Penalidades por Quebra de Lealdade:</strong> A tentativa comprovada de circunvenção (contacto direto desleal com o proprietário ou cliente excluindo a outra agência) implicará a execução judicial imediata da comissão devida e o banimento perpétuo da rede de parceiros do Grupo BNG.
                </div>
              </div>
            </div>
          </div>

          {/* 3. Preço Real e Proibição de Sobretaxa Especulativa */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <span>Proibição de Especulação e Inflacionamento de Preços</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              O mercado imobiliário em Moçambique sofre com frequência com a prática desonesta de intermediários que inflam os preços acordados com o proprietário ("colocar margem por cima"), afastando compradores e descredibilizando o setor.
            </p>
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 leading-relaxed">
              <strong>Regra Inegociável:</strong> O parceiro obriga-se a apresentar ao seu cliente exatamente o preço oficial tabelado no catálogo do Grupo BNG. É expressamente proibido inflacionar o valor para gerar lucros clandestinos. A remuneração das imobiliárias decorre exclusivamente da comissão de corretagem formalmente acordada.
            </div>
          </div>

          {/* 4. Como Tornar-se um Parceiro Oficial do Grupo BNG */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <span>Requisitos para Acreditação de Parceiros</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <strong>1. Entidade Legal ou Corretor Idóneo:</strong>
                <p className="text-slate-500 font-light">Comprovativo de NUIT e registo comercial ou histórico profissional idóneo e comprovado.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <strong>2. Acordo de Parceria Assinado:</strong>
                <p className="text-slate-500 font-light">Subscrição do protocolo oficial de co-corretagem e não-circunvenção com a direção do Grupo BNG.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <strong>3. Comunicação Centralizada:</strong>
                <p className="text-slate-500 font-light">Designação de um interlocutor único responsável por todas as mensagens, visitas e acertos financeiros.</p>
              </div>
            </div>
          </div>

          {/* CTA Direto para o WhatsApp de Parcerias */}
          <div className="bg-gradient-to-br from-[#12161A] via-[#1A2228] to-[#12161A] text-white p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider block">
                  Canal Direto da Direção de Parcerias
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Tem um Cliente ou Imóvel para Co-Corretagem?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mt-1 leading-relaxed">
                  Entre em contacto direto com o nosso Diretor Comercial via WhatsApp. Respondemos em minutos para agendar visitas ou formalizar o protocolo de parceria.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#20ba59] hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-xl transition active:scale-95"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Contactar via WhatsApp</span>
              </a>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C89B3C]" />
                <span>Telefone Corporativo: +258 84 152 4822</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C89B3C]" />
                <span>E-mail Parcerias: parcerias@grupobngoficial.com</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
