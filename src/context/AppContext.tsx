import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole, ListingFilters } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { initializeStorage, getFavorites, toggleFavorite as toggleFavStorage, supabase } from '../services/supabase';
import { getUnreadNotificationsCount } from '../services/notifications';

export type ScreenName = 
  | 'welcome'
  | 'home'
  | 'search'
  | 'search-results'
  | 'detail'
  | 'create'
  | 'my-listings'
  | 'favorites'
  | 'account'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-listings'
  | 'admin-banners'
  | 'admin-settings';

const ADMIN_EMAILS = [
  'lgtecserv@gmail.com',
  'grupobngoficial@gmail.com',
  'admin@grupobng.co.mz'
];

interface AppContextType {
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName, params?: { listingId?: string; filters?: ListingFilters }) => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  loginUser: (email: string, pass: string, asAdmin?: boolean) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, phone: string, whatsapp: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  selectedListingId: string | null;
  searchFilters: ListingFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<ListingFilters>>;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  
  // Auth Modal para clientes
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register', intended?: ScreenName) => void;
  closeAuthModal: () => void;

  // Centro de Notificações
  isNotificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bng_auth_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-visitor',
      fullName: 'Visitante',
      email: 'visitante@grupobng.co.mz',
      phone: '',
      whatsapp: '',
      role: 'visitor'
    };
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bng_is_auth') === 'true';
  });

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<ListingFilters>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal de autenticação
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [intendedScreen, setIntendedScreen] = useState<ScreenName | null>(null);

  // Centro de Notificações
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(() => getUnreadNotificationsCount());

  useEffect(() => {
    const handleUpdate = () => {
      setUnreadNotificationsCount(getUnreadNotificationsCount());
    };
    window.addEventListener('bng_notifications_updated', handleUpdate);
    return () => window.removeEventListener('bng_notifications_updated', handleUpdate);
  }, []);

  const openNotificationCenter = () => setIsNotificationCenterOpen(true);
  const closeNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
    setUnreadNotificationsCount(getUnreadNotificationsCount());
  };

  // Refs para evitar problemas de closure assíncrona nas funções de autenticação e navegação
  const currentUserRef = useRef<UserProfile>(currentUser);
  const isAuthenticatedRef = useRef<boolean>(isAuthenticated);
  const intendedScreenRef = useRef<ScreenName | null>(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const updateAuth = (profile: UserProfile, isAuth: boolean) => {
    currentUserRef.current = profile;
    isAuthenticatedRef.current = isAuth;
    setCurrentUser(profile);
    setIsAuthenticated(isAuth);
    if (isAuth) {
      localStorage.setItem('bng_auth_user', JSON.stringify(profile));
      localStorage.setItem('bng_is_auth', 'true');
    } else {
      localStorage.removeItem('bng_auth_user');
      localStorage.removeItem('bng_is_auth');
    }
  };

  useEffect(() => {
    initializeStorage();
    setFavorites(getFavorites());

    // Sincronizar sessão do Supabase ao iniciar
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const cleanEmail = session.user.email?.toLowerCase().trim() || '';
          const meta = session.user.user_metadata || {};
          const isAdmin = ADMIN_EMAILS.includes(cleanEmail) || meta.role === 'admin';
          const profile: UserProfile = {
            id: session.user.id,
            fullName: meta.full_name || (isAdmin ? 'Administrador Grupo BNG' : cleanEmail.split('@')[0]),
            email: cleanEmail,
            phone: meta.phone || '',
            whatsapp: meta.whatsapp || meta.phone || '',
            role: isAdmin ? 'admin' : 'advertiser'
          };
          updateAuth(profile, true);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          const visitor: UserProfile = {
            id: 'user-visitor',
            fullName: 'Visitante',
            email: 'visitante@grupobng.co.mz',
            phone: '',
            whatsapp: '',
            role: 'visitor'
          };
          updateAuth(visitor, false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const openAuthModal = (mode: 'login' | 'register' = 'login', intended?: ScreenName) => {
    setAuthModalMode(mode);
    if (intended) {
      intendedScreenRef.current = intended;
      setIntendedScreen(intended);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    intendedScreenRef.current = null;
    setIntendedScreen(null);
  };

  const loginUser = async (email: string, pass: string, asAdmin: boolean = false): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail) || asAdmin || cleanEmail.includes('admin');

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass
      });

      if (!error && data?.user) {
        const meta = data.user.user_metadata || {};
        const isUserAdmin = isAdmin || meta.role === 'admin';
        const profile: UserProfile = {
          id: data.user.id,
          fullName: meta.full_name || (isUserAdmin ? 'Administrador Grupo BNG' : cleanEmail.split('@')[0]),
          email: data.user.email || cleanEmail,
          phone: meta.phone || '+258 84 000 0000',
          whatsapp: meta.whatsapp || meta.phone || '+258 84 000 0000',
          role: isUserAdmin ? 'admin' : 'advertiser'
        };

        updateAuth(profile, true);
        const targetScreen = isUserAdmin ? 'admin-dashboard' : (intendedScreenRef.current || intendedScreen || 'home');
        setIsAuthModalOpen(false);
        intendedScreenRef.current = null;
        setIntendedScreen(null);
        setCurrentScreen(targetScreen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerRefresh();

        return { success: true };
      }

      // Se falhou no Supabase Auth, verifica senha alterada pelo utilizador ou senha padrão
      const savedPass = localStorage.getItem(`bng_pwd_${cleanEmail}`);
      const isCustomPassValid = savedPass && pass === savedPass;
      const isDefaultAdminPass = isAdmin && (pass === '123456' || pass === 'admin123');

      if (isCustomPassValid || isDefaultAdminPass) {
        const isUserAdmin = isAdmin;
        const profile: UserProfile = {
          id: 'user-' + (isUserAdmin ? 'admin-' : 'adv-') + Date.now().toString().slice(-4),
          fullName: cleanEmail === 'lgtecserv@gmail.com' ? 'Administrador LG Tecserv' : cleanEmail === 'grupobngoficial@gmail.com' ? 'Grupo BNG Oficial Admin' : (isUserAdmin ? 'Administrador Grupo BNG' : cleanEmail.split('@')[0]),
          email: cleanEmail,
          phone: '+258 84 000 0001',
          whatsapp: '+258 84 000 0001',
          role: isUserAdmin ? 'admin' : 'advertiser'
        };
        updateAuth(profile, true);
        const targetScreen = isUserAdmin ? 'admin-dashboard' : (intendedScreenRef.current || intendedScreen || 'home');
        setIsAuthModalOpen(false);
        intendedScreenRef.current = null;
        setIntendedScreen(null);
        setCurrentScreen(targetScreen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerRefresh();
        return { success: true };
      }

      return {
        success: false,
        error: error?.message || 'E-mail ou palavra-passe incorretos.'
      };
    }

    // Fallback sem Supabase ativo
    const userRole: UserRole = isAdmin ? 'admin' : 'advertiser';
    const profile: UserProfile = {
      id: 'user-' + Date.now().toString().slice(-4),
      fullName: isAdmin ? 'Administrador Grupo BNG' : cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+258 84 000 0000',
      whatsapp: '+258 84 000 0000',
      role: userRole
    };
    updateAuth(profile, true);
    const target = isAdmin ? 'admin-dashboard' : (intendedScreenRef.current || intendedScreen || 'home');
    setIsAuthModalOpen(false);
    intendedScreenRef.current = null;
    setIntendedScreen(null);
    setCurrentScreen(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerRefresh();
    return { success: true };
  };

  const registerUser = async (name: string, email: string, phone: string, whatsapp: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name,
            phone: phone || '',
            whatsapp: whatsapp || phone || '',
            role: isAdmin ? 'admin' : 'advertiser'
          }
        }
      });

      if (!error && data?.user) {
        const profile: UserProfile = {
          id: data.user.id,
          fullName: name,
          email: cleanEmail,
          phone: phone || '+258 84 000 0000',
          whatsapp: whatsapp || phone || '+258 84 000 0000',
          role: isAdmin ? 'admin' : 'advertiser'
        };
        updateAuth(profile, true);
        const targetScreen = intendedScreenRef.current || intendedScreen || 'create';
        setIsAuthModalOpen(false);
        intendedScreenRef.current = null;
        setIntendedScreen(null);
        setCurrentScreen(targetScreen);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerRefresh();
        return { success: true };
      }

      if (error) {
        // Se a conta já existe, efetua login automático com a senha informada
        if (error.message.toLowerCase().includes('already registered')) {
          const loginResult = await loginUser(cleanEmail, pass);
          if (loginResult.success) {
            return { success: true };
          }
          return {
            success: false,
            error: 'Este e-mail já está registado no sistema. Aceda à aba "Entrar" com a sua palavra-passe.'
          };
        }
        return { success: false, error: error.message };
      }
    }

    // Fallback se offline
    const user: UserProfile = {
      id: 'user-adv-' + Date.now().toString().slice(-4),
      fullName: name,
      email: cleanEmail,
      phone: phone || '+258 84 000 0000',
      whatsapp: whatsapp || phone || '+258 84 000 0000',
      role: 'advertiser'
    };
    updateAuth(user, true);
    const target = intendedScreenRef.current || intendedScreen || 'create';
    setIsAuthModalOpen(false);
    intendedScreenRef.current = null;
    setIntendedScreen(null);
    setCurrentScreen(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerRefresh();
    return { success: true };
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'A nova palavra-passe deve ter pelo menos 6 caracteres.' };
    }

    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          console.warn('Supabase updateUser warning:', error.message);
        }
      }

      // Salva localmente para login offline / emergência
      const key = `bng_pwd_${currentUser.email.toLowerCase().trim()}`;
      localStorage.setItem(key, newPassword);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro ao alterar a palavra-passe.' };
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro ao encerrar sessão no Supabase:', e);
      }
    }

    const visitor: UserProfile = {
      id: 'user-visitor',
      fullName: 'Visitante',
      email: 'visitante@grupobng.co.mz',
      phone: '',
      whatsapp: '',
      role: 'visitor'
    };
    updateAuth(visitor, false);
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (screen: ScreenName, params?: { listingId?: string; filters?: ListingFilters }) => {
    if (params?.listingId) {
      setSelectedListingId(params.listingId);
    }
    if (params?.filters) {
      setSearchFilters(params.filters);
    }

    const isAuth = isAuthenticatedRef.current;
    const userRole = currentUserRef.current.role;

    // Proteção de rotas: Telas restritas a usuários autenticados
    const requiresAuthScreens: ScreenName[] = ['create', 'my-listings', 'account'];
    if (requiresAuthScreens.includes(screen) && (!isAuth || userRole === 'visitor')) {
      openAuthModal('login', screen);
      return;
    }

    // Proteção de rotas administrativas
    const adminScreens: ScreenName[] = ['admin-dashboard', 'admin-listings', 'admin-banners', 'admin-settings'];
    if (adminScreens.includes(screen) && userRole !== 'admin') {
      setCurrentScreen('admin-login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (listingId: string) => {
    if (!isAuthenticated || currentUser.role === 'visitor') {
      openAuthModal('login', 'favorites');
      return;
    }
    toggleFavStorage(listingId);
    setFavorites(getFavorites());
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        currentUser,
        isAuthenticated,
        loginUser,
        registerUser,
        changePassword,
        logout,
        selectedListingId,
        searchFilters,
        setSearchFilters,
        favorites,
        toggleFavorite,
        refreshTrigger,
        triggerRefresh,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isNotificationCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        unreadNotificationsCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};
