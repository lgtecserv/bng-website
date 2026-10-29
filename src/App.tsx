import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { AppHeader } from './components/AppHeader';
import { BottomNavigation } from './components/BottomNavigation';
import { AuthModal } from './components/AuthModal';
import { NotificationOnboardingModal } from './components/NotificationOnboardingModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AppUpdateModal } from './components/AppUpdateModal';
import { AiHelpModal } from './components/AiHelpModal';
import { Sparkles } from 'lucide-react';
import {
  supabase,
  getGlobalBroadcastChannel,
  fetchLatestGlobalAnnouncement,
  getOrCreateDeviceId,
  GlobalBroadcastMessage
} from './services/supabase';
import { isNotificationActive, triggerAppNotification } from './services/notifications';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { CreateListingScreen } from './screens/CreateListingScreen';
import { MyListingsScreen } from './screens/MyListingsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { AccountScreen } from './screens/AccountScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminListingsScreen } from './screens/AdminListingsScreen';
import { AdminBannersScreen } from './screens/AdminBannersScreen';
import { AdminSettingsScreen } from './screens/AdminSettingsScreen';

export const App: React.FC = () => {
  const { 
    currentScreen, 
    currentUser,
    navigateTo,
    isNotificationCenterOpen, 
    closeNotificationCenter, 
    triggerRefresh,
    isAiHelpOpen,
    openAiHelp,
    closeAiHelp
  } = useApp();
  const [showNotificationOnboarding, setShowNotificationOnboarding] = useState(false);

  useEffect(() => {
    // 0. Suporte a partilha direta por link (ex: https://www.grupobngoficial.com/?imovel=bng-101)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedImovelId = urlParams.get('imovel') || urlParams.get('listing') || urlParams.get('id');
      if (sharedImovelId) {
        navigateTo('detail', { listingId: sharedImovelId });
      }
    } catch {}

    // 1. Verifica se já concluiu a configuração de notificações obrigatória
    const completed = localStorage.getItem('bng_notification_onboarding_completed') === 'true';
    if (!completed && !isNotificationActive()) {
      setShowNotificationOnboarding(true);
    }

    // 2. Processador de anúncios em tempo real vindos de outros utilizadores / admin com estrita segurança
    const processIncomingAnnouncement = (ann: GlobalBroadcastMessage) => {
      if (!ann || !ann.id) return;

      // Filtro de Segurança 1: Alertas exclusivos de Administrador (Leads de clientes, moderações, etc.)
      const ADMIN_EMAILS = ['lgtecserv@gmail.com', 'grupobngoficial@gmail.com', 'admin@grupobng.co.mz'];
      if (ann.targetAudience === 'admin_only') {
        const isAdmin = currentUser.role === 'admin' && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim());
        if (!isAdmin) {
          // Ignora silenciosamente para utilizadores comuns e visitantes
          return;
        }
      }

      // Filtro de Segurança 2: Notificações direcionadas a um utilizador específico (ex: aprovação do seu anúncio)
      if (ann.targetAudience === 'user_only' && ann.targetUserId) {
        if (currentUser.id !== ann.targetUserId) {
          return;
        }
      }

      const seenKey = `bng_seen_ann_${ann.id}`;
      if (localStorage.getItem(seenKey)) return;

      // Se já foi disparado no background pelo serviço nativo Android, apenas marca localmente
      const androidBridge = (window as any).AndroidBridge;
      if (androidBridge?.isAnnouncementSeen && androidBridge.isAnnouncementSeen(ann.id)) {
        localStorage.setItem(seenKey, 'true');
        return;
      }

      localStorage.setItem(seenKey, 'true');
      if (androidBridge?.markAnnouncementSeen) {
        androidBridge.markAnnouncementSeen(ann.id);
      }

      // Se foi emitido pelo próprio aparelho local, já tocou antes
      const myDeviceId = getOrCreateDeviceId();
      if (ann.senderDeviceId && ann.senderDeviceId === myDeviceId) return;

      // Dispara som, vibração, notificação na barra nativa do Android e sininho
      triggerAppNotification(
        ann.title,
        ann.body,
        ann.type || 'system',
        ann.actionScreen,
        ann.actionId
      );

      // Atualiza o modal de nova versão se for atualização geral
      if (ann.isUpdate || ann.type === 'system') {
        window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
      }
    };

    // 3. Conexão WebSockets Supabase Realtime para entrega instantânea
    let channel: any = null;
    if (supabase) {
      try {
        channel = getGlobalBroadcastChannel();
        if (channel) {
          channel.on('broadcast', { event: 'new_announcement' }, (msg: any) => {
            if (msg?.payload) {
              processIncomingAnnouncement(msg.payload);
            }
          });
          // Atualização de imóveis em tempo real entre todos os dispositivos
          channel.on('broadcast', { event: 'listings_changed' }, () => {
            triggerRefresh();
          });
        }
      } catch (err) {
        console.warn('Erro ao conectar ao canal de broadcast:', err);
      }
    }

    // 4. Polling resiliente na nuvem (a cada 10s e ao focar no app)
    const checkCloudAnnouncements = async () => {
      try {
        const latest = await fetchLatestGlobalAnnouncement();
        if (latest) {
          processIncomingAnnouncement(latest);
        }
      } catch (err) {
        // Silencioso em caso de instabilidade transitória de rede
      }
    };

    // Executa verificação inicial imediata
    checkCloudAnnouncements();

    const intervalId = setInterval(checkCloudAnnouncements, 10000);

    const handleFocus = () => {
      checkCloudAnnouncements();
      triggerRefresh();
    };

    const handleLocalListingsUpdate = () => {
      triggerRefresh();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);
    window.addEventListener('bng_listings_updated', handleLocalListingsUpdate);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkCloudAnnouncements();
        triggerRefresh();
      }
    });

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
      window.removeEventListener('bng_listings_updated', handleLocalListingsUpdate);
    };
  }, [triggerRefresh]);

  const handleCompleteNotificationOnboarding = () => {
    localStorage.setItem('bng_notification_onboarding_completed', 'true');
    setShowNotificationOnboarding(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'search-results':
        return <SearchResultsScreen />;
      case 'detail':
        return <ListingDetailScreen />;
      case 'create':
        return <CreateListingScreen />;
      case 'my-listings':
        return <MyListingsScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'account':
        return <AccountScreen />;
      case 'admin-login':
        return <AdminLoginScreen />;
      case 'admin-dashboard':
        return <AdminDashboardScreen />;
      case 'admin-listings':
        return <AdminListingsScreen />;
      case 'admin-banners':
        return <AdminBannersScreen />;
      case 'admin-settings':
        return <AdminSettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isWelcomeScreen = currentScreen === 'welcome';
  const isAdminScreen = currentScreen.startsWith('admin');

  return (
    <div className="min-h-screen bg-[#ECEEF2] flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Cabeçalho Oficial Grupo BNG (exceto na tela de splash e admin) */}
      {!isWelcomeScreen && !isAdminScreen && <AppHeader />}

      {/* Conteúdo da Tela */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {renderScreen()}
      </main>

      {/* Navegação Inferior Móvel (oculta na tela de boas-vindas, admin e detalhes do imóvel para exibir barra de contacto) */}
      {!isWelcomeScreen && !isAdminScreen && currentScreen !== 'detail' && <BottomNavigation />}

      {/* Modal de Autenticação / Registo para Clientes */}
      <AuthModal />

      {/* Modal Obrigatório de Ativação de Notificações com Som ao Iniciar */}
      {showNotificationOnboarding && (
        <NotificationOnboardingModal onComplete={handleCompleteNotificationOnboarding} />
      )}

      {/* Centro de Notificações Histórico e Teste de Som */}
      <NotificationCenterModal 
        isOpen={isNotificationCenterOpen} 
        onClose={closeNotificationCenter} 
      />

      {/* Modal de Atualização de Nova Versão do APK */}
      <AppUpdateModal />

      {/* Assistente de IA "Ajuda" */}
      <AiHelpModal isOpen={isAiHelpOpen} onClose={closeAiHelp} />

      {/* Botão Flutuante Ajuda BNG IA (Acesso Rápido em Todas as Telas Principais) */}
      {!isWelcomeScreen && !isAdminScreen && !isAiHelpOpen && (
        <button
          onClick={openAiHelp}
          aria-label="Ajuda BNG"
          className="fixed z-30 bottom-16 sm:bottom-6 right-3 sm:right-6 flex items-center gap-2 bg-[#14181B]/95 backdrop-blur-md text-white pl-3 pr-3.5 py-2 rounded-full border border-[#C89B3C]/50 shadow-2xl hover:shadow-[#C89B3C]/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9B7423] via-[#C89B3C] to-[#F3D785] text-[#14181B] flex items-center justify-center shrink-0 shadow">
            <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-[#E3BE63] leading-none flex items-center gap-1">
              <span>Ajuda</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-[9px] text-slate-300 leading-none mt-0.5">Buscar Imóvel</div>
          </div>
        </button>
      )}
    </div>
  );
};

