# Guia de Notificações Android & Assets para Geração do APK — Grupo BNG

Este guia contém todas as especificações técnicas, permissões e estrutura de ficheiros gerados a partir do favicon e logótipo oficial dourado do **Grupo BNG** para garantir que as notificações funcionem perfeitamente no telemóvel Android com som e ícone.

---

## 1. Assets Gerados para o APK e PWA

Todos os tamanhos oficiais foram gerados diretamente a partir da imagem do logótipo dourado em alta definição:

### Pasta Web / PWA (`public/`):
- `favicon.ico` (48x48)
- `favicon.png` / `favicon-32x32.png` / `favicon-16x16.png`
- `apple-touch-icon.png` (180x180)
- `icon-192.png` (192x192) — Ícone PWA e Notificações Mobile
- `icon-512.png` (512x512) — Splash Screen e Alta Densidade
- `maskable-icon-512.png` — Ícone adaptativo com margem de segurança para Android
- `notification-icon.png` (96x96) — Logótipo para corpo da notificação
- `notification-statusbar-icon.png` (96x96) — Silhueta branca com fundo transparente para a barra de estado

### Pasta Nativa Android (`apk-assets/android/res/`):
Pronta para copiar diretamente para o projeto Android Studio, Capacitor (`android/app/src/main/res/`) ou Cordova:
- `mipmap-mdpi/`: `ic_launcher.png` (48x48), `ic_launcher_round.png` (48x48)
- `mipmap-hdpi/`: `ic_launcher.png` (72x72), `ic_launcher_round.png` (72x72)
- `mipmap-xhdpi/`: `ic_launcher.png` (96x96), `ic_launcher_round.png` (96x96)
- `mipmap-xxhdpi/`: `ic_launcher.png` (144x144), `ic_launcher_round.png` (144x144)
- `mipmap-xxxhdpi/`: `ic_launcher.png` (192x192), `ic_launcher_round.png` (192x192)
- `drawable-*/ic_stat_notification.png`: Ícones da barra de notificações nos tamanhos 24, 36, 48, 72 e 96px com fundo transparente.

---

## 2. Permissões no `AndroidManifest.xml`

Para que o APK tenha as notificações ativadas imediatamente na instalação (ou peça a permissão obrigatória do Android 13+ sem bloqueios):

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.grupobng.app">

    <!-- Permissão obrigatória para Android 13 (API 33+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Permissões para vibração e som nativo móvel -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:name=".MainApplication"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:label="Grupo BNG"
        android:theme="@style/AppTheme">

        <!-- Configuração padrão para notificações FCM / Locais -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@drawable/ic_stat_notification" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/bng_gold" />
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="bng_alerta_geral" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/AppTheme.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 3. Canal de Notificação com Som e Vibração (`NotificationChannel`)

No Android 8.0 até Android 15, toda notificação deve pertencer a um canal com `IMPORTANCE_HIGH` para tocar som e vibrar:

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    String channelId = "bng_alerta_geral";
    CharSequence name = "Avisos e Imóveis Grupo BNG";
    String description = "Notificações em tempo real com som sobre novos imóveis, aprovações e pagamentos";
    int importance = NotificationManager.IMPORTANCE_HIGH;

    NotificationChannel channel = new NotificationChannel(channelId, name, importance);
    channel.setDescription(description);
    channel.enableLights(true);
    channel.setLightColor(Color.parseColor("#C89B3C"));
    channel.enableVibration(true);
    channel.setVibrationPattern(new long[]{100, 50, 150});

    // Som padrão do sistema Android
    AudioAttributes audioAttributes = new AudioAttributes.Builder()
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
        .build();
    channel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), audioAttributes);

    NotificationManager notificationManager = getSystemService(NotificationManager.class);
    if (notificationManager != null) {
        notificationManager.createNotificationChannel(channel);
    }
}
```

---

## 4. Comportamento no Aplicativo Web / PWA / APK
1. **Ativação Inicial**: Ao carregar, o banner solicita a ativação nas definições ou aceitação da permissão com 1 toque.
2. **Som Padrão**: Toca som padrão harmônico (sintetizador Web Audio + padrão de vibração `[100, 50, 150]ms`).
3. **Histórico e Limpeza**: O sino agora possui botão para **"Limpar"** todo o histórico (esvaziando completamente), botão para **"Marcar como lidas"**, visual dourado brilhante com selo pulsante `Nova` para mensagens não lidas, e fundo padrão limpo para mensagens já lidas.
