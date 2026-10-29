import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Download, ShieldCheck, Smartphone, Handshake, ExternalLink } from 'lucide-react';
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

          {/* Coluna 2: Navegação & Serviços */}
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

          {/* Coluna 3: Institucional & Parcerias */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">Institucional & Parcerias</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => handleNav('parcerias')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-300 font-semibold"
                >
                  <Handshake className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Políticas de Parcerias & Co-Corretagem</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacidade')} className="hover:text-white transition-colors">
                  Políticas de Privacidade & Dados
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('termos')} className="hover:text-white transition-colors">
                  Termos e Condições de Uso
                </button>
              </li>
            </ul>

            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Aplicativo Oficial:</span>
              <a
                href="/BNG_Imovel.apk"
                download="BNG_Imovel.apk"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] hover:opacity-95 text-[#14181B] font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-900" />
                <span>Instalar APK (2.48 MB)</span>
              </a>
            </div>
          </div>

          {/* Coluna 4: Contactos & Sede */}
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

        {/* Rodapé Inferior: Direitos e Selo Oficial de Desenvolvimento LG Tecserv */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Grupo BNG Imobiliária & Negócios Lda. Todos os direitos reservados.</p>

          {/* Links Legais no Rodapé */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button 
              onClick={() => handleNav('parcerias')} 
              className="text-slate-400 hover:text-[#C89B3C] transition-colors"
            >
              Parcerias Imobiliárias
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => handleNav('privacidade')} 
              className="text-slate-400 hover:text-[#C89B3C] transition-colors"
            >
              Privacidade
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => handleNav('termos')} 
              className="text-slate-400 hover:text-[#C89B3C] transition-colors"
            >
              Termos de Uso
            </button>
          </div>

          {/* SELO OFICIAL: Desenvolvido por LG Tecserv com Link */}
          <div className="flex items-center">
            <a
              href="https://www.lgtecserv.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C89B3C]/50 transition-all text-slate-400 hover:text-white"
              title="LG Tecserv • Soluções em Tecnologia e Engenharia de Software"
            >
              <span className="text-[11px] text-slate-400">Website desenvolvido por</span>
              <strong className="text-[11px] font-black text-white group-hover:text-[#C89B3C] transition-colors flex items-center gap-1">
                <span>LG Tecserv</span>
                <ExternalLink className="w-3 h-3 text-[#C89B3C] opacity-75 group-hover:opacity-100 transition-opacity" />
              </strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
