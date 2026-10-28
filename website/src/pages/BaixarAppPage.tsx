import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Bell, 
  Zap, 
  CheckCircle2, 
  QrCode, 
  FileText, 
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const BaixarAppPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const downloadUrl = window.location.origin + '/BNG_Imovel.apk';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero da Página Dedicada */}
      <section className="relative bg-gradient-to-br from-[#101417] via-[#182026] to-[#0F1316] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Coluna de Texto e Download */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
              Aplicativo Oficial Android Nativo
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
              O Seu Portal Imobiliário <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] bg-clip-text text-transparent">
                Na Palma da Sua Mão
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Instale o aplicativo oficial <strong>BNG Imóvel</strong> no seu telemóvel Android. Receba alertas de novas casas, apartamentos e terrenos em tempo real na barra de notificações do seu celular antes de todo mundo!
            </p>

            {/* Aviso Transparente sobre Play Store & App Store */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
                <span>Brevemente no Google Play Store & Apple App Store</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                O aplicativo oficial <strong>BNG Imóvel</strong> estará muito em breve disponível para download direto na <strong>Google Play Store</strong> e na <strong>Apple App Store</strong>. Enquanto decorre a homologação das lojas, disponibilizamos o instalador <strong>APK Android oficial</strong> para download imediato abaixo:
              </p>

              {/* Botões Indicativos das Lojas (Brevemente) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 opacity-75">
                  <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.22-.924V2.738c0-.34.08-.658.219-.924zM15.207 13.414l2.42 2.42-12.784 7.375 10.364-9.795zm0-2.828L4.843.79 17.627 8.166l-2.42 2.42zM18.847 9.387l2.84 1.638a1.996 1.996 0 0 1 0 1.95l-2.84 1.638-2.128-2.128 2.128-2.098z"/>
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">Brevemente no</span>
                    <span className="text-xs font-bold text-white leading-none">Google Play</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 opacity-75">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.08 1.73-.95 2.76.99.08 2.05-.51 2.68-1.26z"/>
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">Brevemente na</span>
                    <span className="text-xs font-bold text-white leading-none">App Store (iOS)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caixa de Ação de Download Direto do APK */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="/BNG_Imovel.apk"
                download="BNG_Imovel.apk"
                className="bg-gradient-to-r from-[#D4AF37] via-[#C89B3C] to-[#AA7C1E] hover:opacity-95 text-slate-900 font-extrabold px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-3 shadow-2xl shadow-[#C89B3C]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <Download className="w-5 h-5 text-slate-900" />
                <span>Instalar APK Android Agora (2.48 MB)</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 border border-white/15 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>

            {/* Badges de Segurança */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                Assinado com Certificado Oficial
              </span>
              <span>•</span>
              <span>Versão 1.0.0 Estável</span>
              <span>•</span>
              <span>Compatível com Android 5.0+</span>
            </div>
          </div>

          {/* Coluna do QR Code e Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-amber-400/20 text-slate-900 text-center max-w-sm w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#C89B3C] text-[11px] font-bold uppercase mb-4">
                <QrCode className="w-3.5 h-3.5" />
                Aponte a câmara do celular
              </div>

              {/* QR Code dinâmico apontando para o APK */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(downloadUrl)}`}
                  alt="QR Code para Download do BNG Imóvel"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm">Download Imediato no Celular</h4>
              <p className="text-slate-500 text-xs mt-1">
                Abra a câmara do seu smartphone para descarregar o instalador diretamente no dispositivo.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Vantagens Exclusivas do App Nativo */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
            Por que Usar a Aplicação Nativa?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
            Recursos Criados Exclusivamente para o seu Telemóvel
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            A versão instalada no seu smartphone oferece uma experiência muito mais rápida e conectada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Notificações em Tempo Real</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              O aplicativo dispara alertas sonoros e na barra superior do celular sempre que o administrador publica um novo imóvel ou baixa de preço.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Carregamento Instantâneo</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Não precisa de abrir navegadores pesados. O app consome o mínimo de megas de dados móveis e abre instantaneamente.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">WhatsApp com 1 Toque</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Ao encontrar o imóvel ideal, abra diretamente a conversa com o corretor com o código do imóvel já pré-preenchido.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89B3C] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">100% Seguro & Sem Anúncios</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Aplicação limpa, sem vírus, sem publicidade irritante, focada 100% em negócios imobiliários de confiança.
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Passo a Passo de Como Instalar no Android */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
              Guia de Instalação
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Como Instalar o APK no seu Celular Android
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Siga os 4 passos simples abaixo para instalar a aplicação em menos de 1 minuto.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Descarregue o ficheiro BNG_Imovel.apk
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Carregue no botão dourado <strong>"Descarregar APK"</strong> nesta página. O download começará de imediato no navegador do seu smartphone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Se o Chrome avisar: "O ficheiro pode ser prejudicial"
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Este aviso padrão aparece para qualquer aplicativo baixado fora da Play Store. Carregue em <strong>"Transferir mesmo assim"</strong> ou <strong>"Continuar"</strong> com total segurança.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Permitir instalação de fontes desconhecidas
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Ao abrir o ficheiro, caso o Android solicite autorização, clique em <strong>Definições</strong> e ative a opção <strong>"Permitir a partir desta fonte"</strong> (Chrome ou Meus Ficheiros).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#12161A] text-[#D4AF37] font-bold text-sm flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Concluir Instalação e Ativar Alertas
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Toque em <strong>"Instalar"</strong>. Ao abrir pela primeira vez, aceite a permissão de notificações para receber todos os alertas do Grupo BNG na barra do telemóvel!
                </p>
              </div>
            </div>
          </div>

          {/* Dúvida ou Suporte */}
          <div className="mt-10 p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-[#C89B3C] shrink-0" />
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Precisa de Ajuda para Instalar?</h5>
                <p className="text-xs text-slate-600">Nossa equipa de suporte ajuda você passo a passo pelo WhatsApp.</p>
              </div>
            </div>
            <a
              href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20preciso%20de%20ajuda%20para%20instalar%20o%20aplicativo%20no%20meu%20Android."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Suporte WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
