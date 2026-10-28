import React, { useState, useEffect, useCallback } from 'react';
import { Header, ActivePage } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ImobiliarioPage } from './pages/ImobiliarioPage';
import { BaixarAppPage } from './pages/BaixarAppPage';
import { LimpezaPage } from './pages/LimpezaPage';
import { ProcurementPage } from './pages/ProcurementPage';
import { ContatoPage } from './pages/ContatoPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PublicarImovelPage } from './pages/PublicarImovelPage';
import { ListingDetailModal } from './components/ListingDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { 
  fetchWebsiteListings, 
  fetchWebsiteCategories, 
  getSavedWebsiteUser, 
  saveWebsiteUser, 
  WebsiteUser 
} from './services/supabase';
import { Listing } from './types';

// Mapeamento bidirecional de Páginas e Rotas (URLs amigáveis para SEO e Vercel)
const PAGE_URL_MAP: Record<ActivePage, string> = {
  'home': '/',
  'imobiliario': '/imobiliario',
  'servicos-limpeza': '/servicos/limpeza',
  'servicos-procurement': '/servicos/procurement',
  'baixar-app': '/baixar-app',
  'contato': '/contato',
  'publicar': '/publicar',
  'admin': '/admin'
};

function getPageFromPath(path: string): ActivePage {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  if (cleanPath === '/' || cleanPath === '') return 'home';
  if (cleanPath.includes('limpeza')) return 'servicos-limpeza';
  if (cleanPath.includes('procurement')) return 'servicos-procurement';
  if (cleanPath.includes('imobiliario') || cleanPath.includes('imoveis')) return 'imobiliario';
  if (cleanPath.includes('baixar-app') || cleanPath.includes('app')) return 'baixar-app';
  if (cleanPath.includes('contato')) return 'contato';
  if (cleanPath.includes('publicar')) return 'publicar';
  if (cleanPath.includes('admin')) return 'admin';
  return 'home';
}

export default function App() {
  // Inicialização de Página a partir da URL do Navegador
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      return getPageFromPath(window.location.pathname);
    }
    return 'home';
  });

  // Supabase Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<WebsiteUser | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [pendingPublishAfterAuth, setPendingPublishAfterAuth] = useState(false);

  // Load initial data and user session
  useEffect(() => {
    const user = getSavedWebsiteUser();
    setCurrentUser(user);

    async function loadData() {
      setLoading(true);
      try {
        const [cats, items] = await Promise.all([
          fetchWebsiteCategories(),
          fetchWebsiteListings(),
        ]);
        setCategories(cats);
        setListings(items);
      } catch (err) {
        console.error('Erro ao carregar dados do Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Sincronização com o histórico do navegador (botão voltar / avançar)
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setActivePage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navegação entre Páginas com atualização real da barra de endereços (Clean URLs)
  const handleNavigate = useCallback((page: ActivePage) => {
    setActivePage(page);
    const targetUrl = PAGE_URL_MAP[page] || '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle User Logout
  const handleLogout = () => {
    saveWebsiteUser(null);
    setCurrentUser(null);
  };

  // Handle Click on "Publicar Imóvel"
  const handleOpenPublish = () => {
    if (!currentUser) {
      setPendingPublishAfterAuth(true);
      setAuthMode('login');
      setIsAuthOpen(true);
    } else {
      handleNavigate('publicar');
    }
  };

  // Handle Successful Auth
  const handleAuthSuccess = (user: WebsiteUser) => {
    setCurrentUser(user);
    if (pendingPublishAfterAuth) {
      setPendingPublishAfterAuth(false);
      handleNavigate('publicar');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Header Corporativo Limpo e Sem Poluição */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenLogin={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setIsAuthOpen(true);
        }}
        onOpenPublish={handleOpenPublish}
        onLogout={handleLogout}
      />

      {/* Renderização Condicional da Página Selecionada */}
      <main className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <HomePage
            featuredListings={listings}
            onNavigate={handleNavigate}
            onSelectListing={(item) => setSelectedListing(item)}
          />
        )}

        {activePage === 'imobiliario' && (
          <ImobiliarioPage
            listings={listings}
            categories={categories}
            loading={loading}
            currentUser={currentUser}
            onSelectListing={(item) => setSelectedListing(item)}
            onOpenPublish={handleOpenPublish}
            onOpenLogin={() => {
              setAuthMode('login');
              setIsAuthOpen(true);
            }}
          />
        )}

        {activePage === 'servicos-limpeza' && (
          <LimpezaPage />
        )}

        {activePage === 'servicos-procurement' && (
          <ProcurementPage />
        )}

        {activePage === 'baixar-app' && (
          <BaixarAppPage />
        )}

        {activePage === 'contato' && (
          <ContatoPage />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            currentUser={currentUser}
            onOpenPublish={handleOpenPublish}
            onSelectListing={(item) => setSelectedListing(item)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {activePage === 'publicar' && (
          <PublicarImovelPage
            currentUser={currentUser}
            onBack={() => handleNavigate(currentUser?.role === 'admin' ? 'admin' : 'imobiliario')}
            onSuccess={() => {
              fetchWebsiteListings().then(setListings);
              handleNavigate('imobiliario');
            }}
          />
        )}
      </main>

      {/* Rodapé Corporativo com Links Diretos para cada Serviço */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPublish={handleOpenPublish}
      />

      {/* Modal de Detalhes do Imóvel (Com Imagens 100% íntegras sem cortes) */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />

      {/* Modal de Login / Registro */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingPublishAfterAuth(false);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
