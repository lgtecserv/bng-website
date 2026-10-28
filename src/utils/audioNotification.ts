/**
 * Utilitário de Som e Vibração de Notificações para o Grupo BNG
 * Reproduz o som padrão de notificação mobile via Web Audio API e vibração nativa.
 * Funciona offline e em qualquer dispositivo Android / iOS / Web sem depender de ficheiros externos.
 */

export function playDefaultNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Tonalidade de sino/notificação clássica Android (Dois tons harmônicos: C6 e G6)
    const now = ctx.currentTime;

    // Primeiro tom (800 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(1050, now + 0.12);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Segundo tom mais agudo e brilhante (1320 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.28);

    gain2.gain.setValueAtTime(0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.13);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);

    // Vibração padrão do telemóvel (WhatsApp / Android standard pattern: vibra 100ms, pausa 50ms, vibra 150ms)
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 150]);
    }
  } catch (err) {
    console.warn('Não foi possível reproduzir som de notificação:', err);
  }
}
