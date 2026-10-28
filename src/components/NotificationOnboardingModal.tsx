import React, { useState } from 'react';
import { 
  requestNotificationPermission, 
  openDeviceSettings,
  triggerAppNotification 
} from '../services/notifications';
import { playDefaultNotificationSound } from '../utils/audioNotification';
import { Bell, Settings, X, Volume2 } from 'lucide-react';

interface NotificationOnboardingModalProps {
  onComplete: () => void;
}

export const NotificationOnboardingModal: React.FC<NotificationOnboardingModalProps> = ({ onComplete }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleActivate = async () => {
    // 1. Toca o som padrão imediatamente
    playDefaultNotificationSound();

    // 2. Tenta redirecionar para as definições nativas do telemóvel (Android Intent)
    const settingsResult = openDeviceSettings();

    // 3. Solicita a permissão do sistema
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        triggerAppNotification(
          '🔔 Notificações Ativas!',
          'Receberá novos imóveis e avisos do Grupo BNG com som no seu telemóvel.',
          'welcome'
        );
      }
    } catch (e) {
      console.warn('Permissão:', e);
    }

    if (settingsResult.openedNatively) {
      setFeedback('A abrir definições do telemóvel...');
      setTimeout(onComplete, 1200);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[100] animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#14181B] border border-[#C89B3C]/40 rounded-2xl p-4 sm:p-5 shadow-2xl text-white relative">
        <button
          onClick={onComplete}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3 pr-6">
          <div className="w-10 h-10 rounded-xl bg-[#C89B3C] text-[#14181B] flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-5 h-5 fill-current" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-white leading-tight">
              Ative as notificações
            </h4>
            <p className="text-xs text-slate-300 leading-snug">
              Ative as notificações para receber novos imóveis em primeira mão e atualizações dos seus anúncios com som no telemóvel.
            </p>
          </div>
        </div>

        {feedback && (
          <div className="mt-2 text-[11px] font-bold text-amber-300 text-center">
            {feedback}
          </div>
        )}

        <div className="mt-3.5 flex items-center space-x-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleActivate}
            className="flex-1 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-black text-xs py-2.5 px-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ativar nas Definições</span>
          </button>

          <button
            onClick={onComplete}
            className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};
