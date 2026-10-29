import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  Database, 
  UserCheck, 
  Mail, 
  Phone, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PoliticaPrivacidadePageProps {
  onBackHome?: () => void;
}

export const PoliticaPrivacidadePage: React.FC<PoliticaPrivacidadePageProps> = ({ onBackHome }) => {
  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Institucional */}
      <section className="relative bg-gradient-to-br from-[#101417] via-[#161D22] to-[#0D1012] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Conformidade & Proteção de Dados Pessoais
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Políticas de Privacidade <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
              & Tratamento de Dados do Grupo BNG
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
            O Grupo BNG Imobiliária & Negócios Lda assume o compromisso solene de proteger a privacidade, a confidencialidade e a segurança das informações dos seus utilizadores, anunciantes, compradores, parceiros e colaboradores em Moçambique e no estrangeiro.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span>Última atualização: Outubro de 2026</span>
            <span>•</span>
            <span>Válido para website, aplicativo móvel e serviços conexos</span>
          </div>
        </div>
      </section>

      {/* Conteúdo Detalhado e Completo */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Card Resumo com Destaques de Segurança */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-[#C89B3C] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Segurança de Nível Bancário</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Comunicação protegida por encriptação SSL/TLS e infraestrutura segura com isolamento de privilégios.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Privacidade de Pedidos</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Os pedidos e números de clientes recolhidos pelo Assistente IA são confidenciais e exclusivos da Direcção BNG.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Controlo Total do Titular</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Direito garantido de consulta, correção, retificação ou eliminação dos seus dados sob simples solicitação.
              </p>
            </div>
          </div>

          {/* 1. Responsável pelo Tratamento */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <span>Identificação da Entidade Responsável</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              O responsável legal pelo tratamento dos seus dados pessoais é a <strong>Grupo BNG Imobiliária & Negócios Lda</strong>, pessoa coletiva de direito moçambicano, devidamente registada na Conservatória do Registo das Entidades Legais e com NUIT atribuído pelas autoridades tributárias da República de Moçambique, com sede na Província e Cidade de Maputo.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div><strong>Denominação Oficial:</strong> Grupo BNG Imobiliária & Negócios Lda</div>
              <div><strong>Jurisdição:</strong> República de Moçambique</div>
              <div><strong>Canal Oficial de Privacidade:</strong> privacidade@grupobngoficial.com</div>
              <div><strong>Telefone Corporativo:</strong> +258 84 152 4822 / WhatsApp: +258 88 009 6995</div>
            </div>
          </div>

          {/* 2. Que Dados Pessoais Recolhemos */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <span>Categorias de Dados Recolhidos</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Dependendo da forma como interage connosco (como visitante, comprador, anunciante, parceiro imobiliário ou cliente de serviços), recolhemos apenas os dados estritamente necessários para a boa execução das nossas atividades:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Dados de Identificação & Contacto:</strong> Nome completo, endereço de correio eletrónico (e-mail), número de telemóvel e contacto de WhatsApp fornecidos no registo, formulários ou no chat com o Assistente de IA.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Dados dos Imóveis & Documentação Declarada:</strong> Título, descrição, tipologia, fotografias, coordenadas geográficas, comprovativos de titularidade legítima (ex: declaração de DUAT, certidão de registo predial ou contrato-promessa) para verificação editorial contra burlas.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Dados de Faturação & Taxas de Serviço:</strong> Comprovativos de transações de taxas de publicação editorial (M-Pesa, e-Mola ou transferência bancária BCI), referências e valores transacionados para fins de emissão de recibo e contabilidade.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Dados de Navegação e Dispositivo:</strong> Endereço IP (anonimizado), tipo de navegador, sistema operativo, contador de visualizações de anúncios para métricas de popularidade de mercado e cookies essenciais.
                </div>
              </li>
            </ul>
          </div>

          {/* 3. Finalidades do Tratamento */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <span>Finalidades e Base Jurídica do Tratamento</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Os seus dados são tratados de forma lícita, leal e transparente para finalidades explícitas e legítimas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">Mediação & Agendamento de Visitas</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Conectar interessados e proprietários com o apoio de agentes licenciados do Grupo BNG, garantindo visitas presenciais seguras.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">Prevenção de Fraudes e Vistoria</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Avaliar e moderar a autenticidade dos bens anunciados de modo a proteger os cidadãos contra esquemas fraudulentos e imóveis inexistentes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">Acompanhamento Consultivo por IA</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Processar com inteligência artificial as 8 perguntas de procura do cliente para que os nossos corretores localizem o imóvel certo de forma ágil.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">Cumprimento Legal e Fiscais</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Emissão de documentação fiscal, cumprimento de obrigações de reporte e conformidade com a legislação comercial de Moçambique.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Separação Estrita de Acessos & Confidencialidade */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <span>Política de Sigilo Estrito de Pedidos & Leads</span>
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
              <AlertTriangle className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong>Garantia de Não Exposição Pública:</strong>
                <p className="font-light leading-relaxed">
                  Todas as procuras, orçamentos e números de telefone submetidos através do Assistente de IA "Ajuda" ou formulários de procura prioritária têm estatuto restrito <code>admin_only</code>. Nenhum outro anunciante, corretor avulso ou utilizador comum tem acesso aos seus dados de contacto.
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              O Grupo BNG compromete-se a <strong>nunca comercializar, alugar, ceder ou partilhar</strong> listas de contactos de clientes para empresas de marketing não autorizadas ou spammers.
            </p>
          </div>

          {/* 5. Direitos do Titular */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 font-black text-xs flex items-center justify-center">5</span>
              <span>Os Seus Direitos enquanto Titular dos Dados</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Em qualquer momento, assistem-lhe os seguintes direitos fundamentais:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>Direito de Acesso:</strong> Obter a confirmação de que os seus dados são tratados e solicitar cópia dos mesmos.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>Direito de Retificação:</strong> Corrigir dados inexatos, desatualizados ou incompletos constantes da sua conta.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>Direito de Eliminação:</strong> Solicitar o apagamento definitivo dos seus dados e dos seus anúncios da plataforma.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <strong>Direito de Oposição:</strong> Interromper o envio de notificações promocionais ou contactos comerciais diretos.
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-2 font-light">
              Para exercer qualquer um destes direitos, basta enviar uma mensagem formal para <strong>privacidade@grupobngoficial.com</strong> ou contactar a nossa Linha Oficial de Apoio ao Cliente.
            </p>
          </div>

          {/* 6. Contactos Oficiais */}
          <div className="bg-gradient-to-br from-[#12161A] to-[#182026] text-white p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-black text-white">Dúvidas ou Pedidos sobre a sua Privacidade?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-2xl">
              A nossa equipa jurídica e de proteção de dados está à sua inteira disposição para esclarecer qualquer questão.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:privacidade@grupobngoficial.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/15"
              >
                <Mail className="w-4 h-4 text-[#C89B3C]" />
                <span>privacidade@grupobngoficial.com</span>
              </a>

              <a
                href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20esclarecer%20uma%20questao%20sobre%20as%20politicas%20de%20privacidade."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs transition shadow-md"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Atendimento WhatsApp BNG (+258 88 009 6995)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
