import React, { useState, useEffect } from 'react';
import { 
  AppNotification, 
  getStoredNotifications, 
  clearAllNotifications,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead, 
  triggerAppNotification 
} from '../services/notifications';
import { playDefaultNotificationSound } from '../utils/audioNotification';
import { useApp } from '../context/AppContext';
import { 
  Bell, Volume2, Building, DollarSign, 
  Sparkles, X, Trash2, BellOff, CheckCheck, 
  CheckCircle2, Clock
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const { navigateTo } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [testSent, setTestSent] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNotifications(getStoredNotifications());
      setClearedNotice(false);
    }
  }, [isOpen]);

  // Listener para sincronização em tempo real se novas notificações chegarem
  useEffect(() => {
    const handleSync = () => {
      setNotifications(getStoredNotifications());
    };
    window.addEventListener('bng_notifications_updated', handleSync);
    return () => window.removeEventListener('bng_notifications_updated', handleSync);
  }, []);

  if (!isOpen) return null;

  const handleTestNotification = () => {
    playDefaultNotificationSound();
    triggerAppNotification(
      '🔔 Teste de Alerta com Som',
      'O som padrão e a vibração do telemóvel estão configurados com sucesso no Grupo BNG.',
      'welcome'
    );
    setNotifications(getStoredNotifications());
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleNotificationClick = (n: AppNotification) => {
    // Marca a notificação clicada como lida
    markNotificationAsRead(n.id);
    setNotifications(getStoredNotifications());

    if (n.actionScreen === 'detail' && n.actionId) {
      onClose();
      navigateTo('detail', { listingId: n.actionId });
    } else if (n.actionScreen === 'admin-listings') {
      onClose();
      navigateTo('admin-listings');
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3500);
  };

  const handleDeleteOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    setNotifications(getStoredNotifications());
  };

  const handleMarkOneRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markNotificationAsRead(id);
    setNotifications(getStoredNotifications());
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getStoredNotifications());
  };

  const handleClose = () => {
    // Ao fechar a central, marca como lidas para não incomodar no sino
    markAllNotificationsAsRead();
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header com Ações */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#C89B3C] flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  Notificações &amp; Alertas
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Avisos sonoros do catálogo e operações
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl transition-colors"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Lidas</span>
                  </button>
                )}

                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-1 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-xl transition-colors"
                  title="Limpar todas as notificações e esvaziar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              </>
            )}

            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback de limpeza */}
        {clearedNotice && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold text-center animate-in fade-in">
            ✓ Histórico de notificações limpo com sucesso!
          </div>
        )}

        {/* Card de Teste do Som Nativo Mobile */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C89B3C] text-slate-950 flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block leading-tight">
                {testSent ? '🔊 Som reproduzido com sucesso!' : 'Som Padrão de Notificação'}
              </span>
              <span className="text-[10px] text-slate-500">
                Toque móvel + vibração integrados
              </span>
            </div>
          </div>
          <button
            onClick={handleTestNotification}
            className="px-3 py-1.5 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center space-x-1"
          >
            <span>Emitir Som</span>
          </button>
        </div>

        {/* Lista de Notificações com Visual Distinto para Novas vs Lidas */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <BellOff className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-800 text-sm">
                Nenhuma notificação por agora
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                O seu histórico de notificações está completamente vazio. Avisos sobre aprovações, novos imóveis e taxas aparecerão aqui com som.
              </p>
              <button
                onClick={handleTestNotification}
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#C89B3C] font-black text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simular Nova Notificação</span>
              </button>
            </div>
          ) : (
            notifications.map((n) => {
              const isUnread = !n.isRead;

              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group relative p-3.5 rounded-2xl border transition-all text-xs cursor-pointer ${
                    isUnread
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-50/60 to-white border-[#C89B3C] border-l-[6px] shadow-sm shadow-amber-500/10 hover:shadow-md'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Ícone */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isUnread 
                        ? 'bg-slate-900 text-[#C89B3C] shadow-sm' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {n.type === 'listing_published' ? <Building className="w-4 h-4" /> :
                       n.type === 'payment_confirmed' ? <DollarSign className="w-4 h-4" /> :
                       <Sparkles className="w-4 h-4" />}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#C89B3C] text-slate-950 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping inline-block" />
                            Nova
                          </span>
                        )}
                        <strong className={`truncate ${
                          isUnread ? 'font-black text-slate-950 text-xs sm:text-[13px]' : 'font-bold text-slate-700 text-xs'
                        }`}>
                          {n.title}
                        </strong>
                      </div>

                      <p className={`leading-relaxed ${
                        isUnread ? 'text-xs text-slate-800 font-medium' : 'text-[11px] text-slate-500 font-normal'
                      }`}>
                        {n.body}
                      </p>

                      <div className="mt-2 flex items-center space-x-3 text-[10px]">
                        <span className={`flex items-center space-x-1 ${
                          isUnread ? 'text-[#9A701E] font-bold font-mono' : 'text-slate-400 font-mono'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>

                        {isUnread ? (
                          <button
                            onClick={(e) => handleMarkOneRead(e, n.id)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                          >
                            Marcar como lida
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">Lida</span>
                        )}
                      </div>
                    </div>

                    {/* Botão de Excluir Individual */}
                    <button
                      onClick={(e) => handleDeleteOne(e, n.id)}
                      title="Apagar esta notificação"
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-70 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé com botão de fechar */}
        <div className="pt-2 border-t border-slate-100 shrink-0">
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
