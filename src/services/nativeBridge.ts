/**
 * Ponte Nativa Android / PWA para o Grupo BNG
 * Permite que o aplicativo interaja diretamente com as Definições do Sistema Operativo Android (APK),
 * canais de notificação e Intents quando compilado para APK, mantendo total compatibilidade no PWA.
 */

export interface NativeAndroidInterface {
  openNotificationSettings?: () => void;
  openAppSettings?: () => void;
  showToast?: (message: string) => void;
  showNativeNotification?: (title: string, body: string) => void;
  playDefaultNotificationTone?: () => void;
  openExternalUrl?: (url: string) => void;
}

declare global {
  interface Window {
    AndroidBridge?: NativeAndroidInterface;
    Capacitor?: any;
  }
}

/**
 * Detecta se a aplicação está a correr dentro de um APK nativo Android
 */
export function isNativeAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  // Detecta WebView Android, Capacitor ou Interface Nativa
  const isAndroidBridge = Boolean(window.AndroidBridge);
  const isCapacitorNative = Boolean(window.Capacitor?.isNativePlatform?.());
  const isAndroidUserAgent = /Android.*(wv|\.0\.0\.0)/i.test(navigator.userAgent);
  return isAndroidBridge || isCapacitorNative || isAndroidUserAgent;
}

/**
 * Abre diretamente as Definições do Telemóvel (Configurações de Notificação do App)
 * No Android APK: lança o Intent nativo android.settings.APPLICATION_DETAILS_SETTINGS ou NOTIFICATION_SETTINGS
 * No PWA/Browser: orienta o utilizador com fallback
 */
export function openDeviceSettings(): { openedNatively: boolean; message?: string } {
  // 1. Tentar interface nativa injetada no APK (ex: JavaScriptInterface no Android Studio)
  if (window.AndroidBridge?.openNotificationSettings) {
    try {
      window.AndroidBridge.openNotificationSettings();
      return { openedNatively: true };
    } catch (e) {
      console.warn('Erro ao chamar AndroidBridge:', e);
    }
  }

  // 2. Tentar Capacitor Native Plugin
  if (window.Capacitor?.Plugins?.App?.openSettings) {
    try {
      window.Capacitor.Plugins.App.openSettings();
      return { openedNatively: true };
    } catch (e) {
      console.warn('Erro ao chamar Capacitor App.openSettings:', e);
    }
  }

  // 3. Tentar scheme de settings em navegadores móveis compatíveis
  try {
    // Alguns webviews e navegadores suportam o intent direto
    const intentUrl = 'intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;package=com.grupobng.app;end';
    const a = document.createElement('a');
    a.href = intentUrl;
    // Não bloqueia caso o navegador ignore o intent
  } catch (err) {
    // Silencioso
  }

  return { 
    openedNatively: false, 
    message: 'No navegador, clique no ícone de cadeado ou definições ao lado do endereço web para ativar notificações.' 
  };
}

/**
 * Abre um link externo (website, WhatsApp, etc.) com segurança:
 * - No APK Android: chama AndroidBridge.openExternalUrl para abrir no navegador padrão do celular
 * - No Navegador / PWA: abre via window.open ou redirecionamento seguro
 * - Adiciona automaticamente https:// caso o usuário tenha digitado apenas www.exemplo.com ou exemplo.com
 */
export function openExternalUrl(rawUrl: string): void {
  if (!rawUrl || !rawUrl.trim()) return;
  let target = rawUrl.trim();

  // Tratamento de WhatsApp
  if (target.startsWith('wa.me')) {
    target = 'https://' + target;
  } else if (
    !target.startsWith('http://') && 
    !target.startsWith('https://') && 
    !target.startsWith('tel:') && 
    !target.startsWith('mailto:')
  ) {
    // Se digitou www.dominio.com ou apenas dominio.com
    target = 'https://' + target;
  }

  // 1. Tenta chamar o AndroidBridge nativo (evita bloqueio de popup no WebView do APK)
  if (typeof window !== 'undefined' && window.AndroidBridge?.openExternalUrl) {
    try {
      window.AndroidBridge.openExternalUrl(target);
      return;
    } catch (bridgeErr) {
      console.warn('Erro ao chamar AndroidBridge.openExternalUrl:', bridgeErr);
    }
  }

  // 2. Fallback para navegador web / PWA
  try {
    const win = window.open(target, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = target;
    }
  } catch (err) {
    window.location.href = target;
  }
}
