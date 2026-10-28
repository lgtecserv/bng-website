import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Download, ShieldCheck, Smartphone } from 'lucide-react';
import { ActivePage } from './Header';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenPublish: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPublish }) => {
  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0E10] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Coluna 1: Sobre o Grupo BNG */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNav('home')}
              className="cursor-pointer inline-block"
            >
              <img 
                src="/logo-transparent.png" 
                alt="Grupo BNG Logotipo" 
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.indexOf('logo.png') === -1) {
                    target.src = '/logo.png';
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Referência em Moçambique na mediação imobiliária segura, soluções corporativas de Limpeza & Facility e aprovisionamento de Procurement empresarial.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#C89B3C]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-semibold">Sociedade Comercial Moçambicana Registada</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida entre Páginas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">Páginas Oficiais</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Início (Home)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('imobiliario')} className="hover:text-white transition-colors">
                  Imobiliário (Catálogo & Vendas)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('servicos-limpeza')} className="hover:text-white transition-colors">
                  Limpeza & Facility Management
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('servicos-procurement')} className="hover:text-white transition-colors">
                  Procurement & Negócios Corporativos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('baixar-app')} className="hover:text-white transition-colors flex items-center gap-1.5 text-[#C89B3C]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Baixar Aplicativo Android (APK)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contato')} className="hover:text-white transition-colors">
                  Fale Conosco / Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Aplicativo Mobile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">App Nativo Android</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
              Instale a aplicação nativa no seu smartphone para receber novidades e alertas em tempo real.
            </p>
            <div className="space-y-2">
              <a
                href="/BNG_Imovel.apk"
                download="BNG_Imovel.apk"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] hover:opacity-95 text-[#14181B] font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-900" />
                <span>Descarregar APK (2.48 MB)</span>
              </a>

              <button
                onClick={() => handleNav('baixar-app')}
                className="block text-[11px] text-slate-400 hover:text-white underline"
              >
                Ver instruções de instalação no celular →
              </button>
            </div>
          </div>

          {/* Coluna 4: Contactos & Apoio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">Atendimento & Sede</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <a href="tel:+258841524822" className="hover:text-white transition-colors font-medium">
                  +258 84 152 4822
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/258880096995?text=Ola%20Grupo%20BNG%2C%20gostaria%20de%20informacoes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-emerald-400 font-medium"
                >
                  WhatsApp: +258 88 009 6995
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <span>Maputo • Moçambique</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C89B3C] shrink-0" />
                <a href="mailto:contacto@grupobngoficial.com" className="text-slate-400 hover:text-white transition-colors">
                  contacto@grupobngoficial.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Direitos Reservados */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Grupo BNG Imobiliária & Negócios Lda. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition-colors">Termos & Privacidade</span>
            <span className="hover:text-slate-400 transition-colors">Moçambique</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
