import { playDefaultNotificationSound } from '../utils/audioNotification';
import { isNativeAndroidApp, openDeviceSettings } from './nativeBridge';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'listing_published' | 'payment_confirmed' | 'promo' | 'system' | 'welcome';
  timestamp: string;
  isRead: boolean;
  actionScreen?: string;
  actionId?: string;
}

const STORAGE_KEYS = {
  NOTIFICATIONS: 'bng_notifications_v1',
  PERMISSION_ASKED: 'bng_notification_asked_v1',
  NOTIFICATIONS_ENABLED: 'bng_notifications_enabled_v1'
};

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔔 Notificações Ativadas!',
    body: 'Receberá alertas em tempo real sobre aprovação de anúncios, pagamentos de 150 MT e novas oportunidades.',
    type: 'welcome',
    timestamp: new Date().toISOString(),
    isRead: false
  },
  {
    id: 'notif-2',
    title: '🏠 Novo Imóvel no Catálogo',
    body: 'Moradia T4 de Alto Padrão disponível no Triunfo Velho, Maputo.',
    type: 'listing_published',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    actionScreen: 'detail',
    actionId: 'bng-101'
  }
];

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Erro ao ler notificações:', e);
  }
  return DEFAULT_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    // Dispara evento para atualizar a interface em tempo real
    window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
  } catch (e) {
    console.warn('Erro ao guardar notificações:', e);
  }
}

/**
 * Limpa completamente todas as notificações, deixando o histórico vazio
 */
export function clearAllNotifications(): void {
  saveStoredNotifications([]);
}

/**
 * Remove uma única notificação por ID
 */
export function deleteNotification(id: string): void {
  const current = getStoredNotifications().filter(n => n.id !== id);
  saveStoredNotifications(current);
}

/**
 * Marca uma única notificação como lida
 */
export function markNotificationAsRead(id: string): void {
  const current = getStoredNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
  saveStoredNotifications(current);
}

/**
 * Retorna o estado atual da permissão de notificações do sistema
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission;
}

/**
 * Verifica se já foi concedida permissão anteriormente
 */
export function isNotificationActive(): boolean {
  if (typeof window === 'undefined') return false;
  const permission = getNotificationPermissionStatus();
  const enabledFlag = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) === 'true';
  return permission === 'granted' || enabledFlag;
}

/**
 * Solicita a permissão nativa de notificações ao utilizador
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  localStorage.setItem(STORAGE_KEYS.PERMISSION_ASKED, 'true');

  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
        // Toca som padrão do telemóvel imediatamente para feedback auditivo
        playDefaultNotificationSound();
        return true;
      }
    } catch (err) {
      console.warn('Erro ao pedir permissão de notificação:', err);
    }
  }

  // Fallback caso Notification API não esteja disponível ou em WebView Android
  if (isNativeAndroidApp()) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
    playDefaultNotificationSound();
    return true;
  }

  return false;
}

/**
 * Envia uma notificação completa na aplicação (com som, vibração e banner do sistema)
 */
export function triggerAppNotification(
  title: string,
  body: string,
  type: AppNotification['type'] = 'system',
  actionScreen?: string,
  actionId?: string
): void {
  // 1. Reproduz som padrão de notificação e vibração
  playDefaultNotificationSound();

  // 2. Dispara notificação nativa no APK Android (barra de status do telemóvel)
  if (typeof window !== 'undefined' && window.AndroidBridge?.showNativeNotification) {
    try {
      window.AndroidBridge.showNativeNotification(title, body);
    } catch (bridgeErr) {
      console.warn('Erro ao disparar notificação nativa Android:', bridgeErr);
    }
  }

  // 3. Cria notificação no navegador / PWA se houver permissão
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/notification-icon.png'
      });
    } catch (err) {
      // Ignora erro de background
    }
  }

  // 3. Adiciona à lista interna de notificações
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    title,
    body,
    type,
    timestamp: new Date().toISOString(),
    isRead: false,
    actionScreen,
    actionId
  };

  saveStoredNotifications([newNotif, ...current]);
}

/**
 * Marca todas as notificações como lidas
 */
export function markAllNotificationsAsRead(): void {
  const current = getStoredNotifications().map(n => ({ ...n, isRead: true }));
  saveStoredNotifications(current);
}

/**
 * Retorna o número de notificações não lidas
 */
export function getUnreadNotificationsCount(): number {
  return getStoredNotifications().filter(n => !n.isRead).length;
}

export { openDeviceSettings };
