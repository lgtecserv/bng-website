import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = path.resolve('.');
const BUILD_DIR = path.join(ROOT_DIR, 'android-apk-build');
const SDK_DIR = 'C:\\Users\\inaci\\AppData\\Local\\Android\\Sdk';
const BUILD_TOOLS_DIR = path.join(SDK_DIR, 'build-tools', '29.0.3');
const ANDROID_JAR = path.join(SDK_DIR, 'platforms', 'android-34', 'android.jar');
const JDK_BIN = 'C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.472.8-hotspot\\bin';

const JAVA = path.join(JDK_BIN, 'java.exe');
const JAVAC = path.join(JDK_BIN, 'javac.exe');
const KEYTOOL = path.join(JDK_BIN, 'keytool.exe');
const JAR = path.join(JDK_BIN, 'jar.exe');

const AAPT = path.join(BUILD_TOOLS_DIR, 'aapt.exe');
const D8_JAR = path.join(BUILD_TOOLS_DIR, 'lib', 'd8.jar');
const ZIPALIGN = path.join(BUILD_TOOLS_DIR, 'zipalign.exe');
const APKSIGNER_JAR = path.join(BUILD_TOOLS_DIR, 'lib', 'apksigner.jar');

function run(cmd, cwd = ROOT_DIR) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, PATH: `${JDK_BIN};${BUILD_TOOLS_DIR};${process.env.PATH}` } });
}

async function buildApk() {
  console.log('====================================================');
  console.log('   Compilação do APK: "BNG Imovel" (Grupo BNG)');
  console.log('====================================================\n');

  // 1. Limpar e recriar diretório de build
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });

  const srcDir = path.join(BUILD_DIR, 'src', 'com', 'grupobng', 'imovel');
  const resDir = path.join(BUILD_DIR, 'res');
  const assetsDir = path.join(BUILD_DIR, 'assets', 'www');
  const binDir = path.join(BUILD_DIR, 'bin');
  const objDir = path.join(BUILD_DIR, 'obj');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(resDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(binDir, { recursive: true });
  fs.mkdirSync(objDir, { recursive: true });

  // 2. Copiar os recursos gráficos (mipmap e drawable gerados a partir do favicon oficial)
  console.log('1. A copiar ícones e recursos do APK...');
  const iconResDir = path.join(ROOT_DIR, 'apk-assets', 'android', 'res');
  if (fs.existsSync(iconResDir)) {
    fs.cpSync(iconResDir, resDir, { recursive: true });
  }

  // 2.1 Ler configurações do Firebase google-services.json caso exista
  let fcmSenderId = '620146147430';
  let googleAppId = '1:620146147430:android:986ae25405d7aad8c1ada7';
  let googleApiKey = 'AIzaSyDAy0JPYUMg5qSaa_LSu3iduNJ2nMx542E';
  let projectId = 'grupo-bng';
  let storageBucket = 'grupo-bng.firebasestorage.app';

  const googleServicesJsonPath = path.join(ROOT_DIR, 'google-services.json');
  if (fs.existsSync(googleServicesJsonPath)) {
    try {
      const gs = JSON.parse(fs.readFileSync(googleServicesJsonPath, 'utf8'));
      fcmSenderId = gs.project_info?.project_number || fcmSenderId;
      projectId = gs.project_info?.project_id || projectId;
      storageBucket = gs.project_info?.storage_bucket || storageBucket;
      const client = gs.client?.[0];
      if (client) {
        googleAppId = client.client_info?.mobilesdk_app_id || googleAppId;
        googleApiKey = client.api_key?.[0]?.current_key || googleApiKey;
      }
      console.log(`✓ Firebase google-services.json integrado com sucesso (Projeto: ${projectId}, Sender ID: ${fcmSenderId})`);
    } catch (e) {
      console.warn('! Aviso ao ler google-services.json:', e);
    }
  }

  // Criar res/values/strings.xml e styles.xml com credenciais do Firebase
  const valuesDir = path.join(resDir, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });

  fs.writeFileSync(path.join(valuesDir, 'strings.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">BNG Imovel</string>
    <string name="gcm_defaultSenderId">${fcmSenderId}</string>
    <string name="google_app_id">${googleAppId}</string>
    <string name="google_api_key">${googleApiKey}</string>
    <string name="firebase_database_url">https://${projectId}.firebaseio.com</string>
    <string name="google_storage_bucket">${storageBucket}</string>
    <string name="project_id">${projectId}</string>
</resources>
`);

  fs.writeFileSync(path.join(valuesDir, 'styles.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar">
        <item name="android:windowBackground">@android:color/black</item>
    </style>
</resources>
`);

  // 3. Criar AndroidManifest.xml com nome "BNG Imovel" e permissões completas
  console.log('2. A criar AndroidManifest.xml...');
  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.grupobng.imovel"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:allowBackup="true"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Receptor de Conexão à Internet / Dados Móveis e Avisos em Segundo Plano -->
        <receiver
            android:name=".NetworkReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="com.grupobng.imovel.CHECK_NOTIFICATIONS" />
            </intent-filter>
        </receiver>
    </application>
</manifest>`;

  fs.writeFileSync(path.join(BUILD_DIR, 'AndroidManifest.xml'), manifestContent);

  // 4. Criar MainActivity.java com WebView + Bridge + Suporte para Notificações & Uploads
  console.log('3. A criar MainActivity.java...');
  const javaCode = `package com.grupobng.imovel;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView mWebView;
    private ValueCallback<Uri[]> mFilePathCallback;
    private final static int FILECHOOSER_RESULTCODE = 1001;

    public class AndroidBridge {
        private Context mContext;
        public AndroidBridge(Context context) {
            mContext = context;
        }

        @JavascriptInterface
        public void openNotificationSettings() {
            try {
                Intent intent = new Intent();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
                    intent.putExtra("android.provider.extra.APP_PACKAGE", getPackageName());
                } else {
                    intent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
                    intent.setData(Uri.parse("package:" + getPackageName()));
                }
                startActivity(intent);
            } catch (Exception e) {
                try {
                    Intent fallback = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    fallback.setData(Uri.parse("package:" + getPackageName()));
                    startActivity(fallback);
                } catch (Exception ignored) {}
            }
        }

        @JavascriptInterface
        public void openAppSettings() {
            try {
                Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void showToast(String message) {
            Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void showNativeNotification(String title, String body) {
            try {
                createNotificationChannel();

                NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
                if (notificationManager == null) return;

                String channelId = "bng_alerta_geral";
                Intent intent = new Intent(mContext, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                android.app.PendingIntent pendingIntent;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    pendingIntent = android.app.PendingIntent.getActivity(mContext, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
                } else {
                    pendingIntent = android.app.PendingIntent.getActivity(mContext, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
                }

                android.app.Notification.Builder builder;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    builder = new android.app.Notification.Builder(mContext, channelId);
                } else {
                    builder = new android.app.Notification.Builder(mContext);
                }

                builder.setContentTitle(title)
                       .setContentText(body)
                       .setSmallIcon(R.mipmap.ic_launcher)
                       .setAutoCancel(true)
                       .setContentIntent(pendingIntent)
                       .setDefaults(android.app.Notification.DEFAULT_ALL);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    builder.setStyle(new android.app.Notification.BigTextStyle().bigText(body));
                    builder.setPriority(android.app.Notification.PRIORITY_MAX);
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    builder.setColor(Color.parseColor("#C89B3C"));
                }

                int notifId = (int) (System.currentTimeMillis() & 0xfffffff);
                notificationManager.notify(notifId, builder.build());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            try {
                if (url == null || url.trim().isEmpty()) return;
                String dest = url.trim();
                if (!dest.startsWith("http://") && !dest.startsWith("https://") && !dest.startsWith("tel:") && !dest.startsWith("mailto:")) {
                    dest = "https://" + dest;
                }
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(dest));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(intent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void markAnnouncementSeen(String id) {
            try {
                if (id == null || id.trim().isEmpty()) return;
                SharedPreferences prefs = mContext.getSharedPreferences(NetworkReceiver.PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit().putString(NetworkReceiver.KEY_LAST_SEEN_ID, id).apply();
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public boolean isAnnouncementSeen(String id) {
            try {
                if (id == null || id.trim().isEmpty()) return false;
                SharedPreferences prefs = mContext.getSharedPreferences(NetworkReceiver.PREFS_NAME, Context.MODE_PRIVATE);
                String lastSeen = prefs.getString(NetworkReceiver.KEY_LAST_SEEN_ID, "");
                return id.equals(lastSeen);
            } catch (Exception ignored) {
                return false;
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Barra de status com fundo escuro e elegante Grupo BNG (#14181B)
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#14181B"));
        }

        createNotificationChannel();

        // Solicita permissão de notificação no Android 13+ (API 33+)
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 101);
            }
        }

        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        mWebView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                }
                mFilePathCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    mFilePathCallback = null;
                    return false;
                }
                return true;
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || 
                    url.startsWith("https://wa.me/") || url.startsWith("intent:") || url.endsWith(".apk")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                // Links externos (sites, portais, ctas de banners) abrem no navegador do celular
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (!url.contains("localhost") && !url.contains("127.0.0.1") && !url.contains("192.168.")) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            startActivity(intent);
                            return true;
                        } catch (Exception ignored) {}
                    }
                }
                return false;
            }
        });

        // Carrega o aplicativo nativamente de assets locais
        mWebView.loadUrl("file:///android_asset/www/index.html");
        // Agendar verificação periódica de novos imóveis e avisos em segundo plano
        NetworkReceiver.scheduleAlarm(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        new Thread(new Runnable() {
            @Override
            public void run() {
                NetworkReceiver.checkAndNotify(MainActivity.this);
            }
        }).start();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "bng_alerta_geral";
            CharSequence name = "Avisos e Imóveis Grupo BNG";
            String description = "Notificações em tempo real com som sobre novos imóveis e taxas";
            int importance = NotificationManager.IMPORTANCE_HIGH;

            NotificationChannel channel = new NotificationChannel(channelId, name, importance);
            channel.setDescription(description);
            channel.enableLights(true);
            channel.setLightColor(Color.parseColor("#C89B3C"));
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{100, 50, 150});

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
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (mFilePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                String dataString = data.getDataString();
                if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                } else if (data.getClipData() != null) {
                    final int numSelectedFiles = data.getClipData().getItemCount();
                    results = new Uri[numSelectedFiles];
                    for (int i = 0; i < numSelectedFiles; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                }
            }
            mFilePathCallback.onReceiveValue(results);
            mFilePathCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;

  fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), javaCode);

  // Criar NetworkReceiver.java para notificações ao ligar dados móveis / Wi-Fi
  console.log('3.1. A criar NetworkReceiver.java (Notificações em Segundo Plano / Dados Móveis)...');
  const receiverCode = `package com.grupobng.imovel;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class NetworkReceiver extends BroadcastReceiver {
    public static final String PREFS_NAME = "bng_push_prefs";
    public static final String KEY_LAST_SEEN_ID = "last_seen_ann_id";
    private static final String SUPABASE_URL = "https://ohfxjwotkgllccdiismc.supabase.co/rest/v1/platform_settings?key=eq.bng_live_announcements&select=value";
    private static final String SUPABASE_KEY = "sb_publishable_UeM95RFADZ96gx94HfgydQ_7xjH4HKY";

    public static void scheduleAlarm(Context context) {
        try {
            android.app.AlarmManager am = (android.app.AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent alarmIntent = new Intent(context, NetworkReceiver.class);
            alarmIntent.setAction("com.grupobng.imovel.CHECK_NOTIFICATIONS");
            android.app.PendingIntent pi;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                pi = android.app.PendingIntent.getBroadcast(context, 1002, alarmIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
            } else {
                pi = android.app.PendingIntent.getBroadcast(context, 1002, alarmIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
            }
            if (am != null) {
                long interval = 15 * 60 * 1000L; // Cada 15 minutos em segundo plano
                am.setInexactRepeating(android.app.AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + interval, interval, pi);
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onReceive(final Context context, Intent intent) {
        try {
            if (intent != null && Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
                scheduleAlarm(context);
            }

            ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return;
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            boolean isConnected = activeNetwork != null && activeNetwork.isConnected();
            if (!isConnected) return;

            new Thread(new Runnable() {
                @Override
                public void run() {
                    checkAndNotify(context);
                }
            }).start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void checkAndNotify(Context context) {
        HttpURLConnection conn = null;
        try {
            URL url = new URL(SUPABASE_URL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("apikey", SUPABASE_KEY);
            conn.setRequestProperty("Authorization", "Bearer " + SUPABASE_KEY);
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);

            if (conn.getResponseCode() == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                reader.close();

                JSONArray arr = new JSONArray(sb.toString());
                if (arr.length() > 0) {
                    JSONObject row = arr.getJSONObject(0);
                    JSONObject val = row.optJSONObject("value");
                    if (val != null && val.has("latest")) {
                        JSONObject latest = val.getJSONObject("latest");
                        String id = latest.optString("id");
                        String title = latest.optString("title");
                        String body = latest.optString("body");

                        if (!id.isEmpty() && !title.isEmpty()) {
                            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                            String lastSeen = prefs.getString(KEY_LAST_SEEN_ID, "");

                            if (!id.equals(lastSeen)) {
                                prefs.edit().putString(KEY_LAST_SEEN_ID, id).apply();
                                showNotification(context, title, body);
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    public static void showNotification(Context context, String title, String body) {
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            String channelId = "bng_alerta_geral";
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                    channelId, 
                    "Avisos e Imóveis Grupo BNG", 
                    NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Notificações em tempo real com som sobre novos imóveis e taxas");
                channel.enableLights(true);
                channel.setLightColor(Color.parseColor("#C89B3C"));
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{100, 50, 150});

                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
                channel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), audioAttributes);
                nm.createNotificationChannel(channel);
            }

            Intent launchIntent = new Intent(context, MainActivity.class);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            
            PendingIntent pendingIntent;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                pendingIntent = PendingIntent.getActivity(context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            } else {
                pendingIntent = PendingIntent.getActivity(context, 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            }

            Notification.Builder builder;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder = new Notification.Builder(context, channelId);
            } else {
                builder = new Notification.Builder(context);
            }

            builder.setContentTitle(title)
                   .setContentText(body)
                   .setSmallIcon(R.mipmap.ic_launcher)
                   .setAutoCancel(true)
                   .setContentIntent(pendingIntent)
                   .setDefaults(Notification.DEFAULT_ALL);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                builder.setStyle(new Notification.BigTextStyle().bigText(body));
                builder.setPriority(Notification.PRIORITY_MAX);
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                builder.setColor(Color.parseColor("#C89B3C"));
            }

            int notifId = (int) (System.currentTimeMillis() & 0xfffffff);
            nm.notify(notifId, builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`;

  fs.writeFileSync(path.join(srcDir, 'NetworkReceiver.java'), receiverCode);

  // 5. Copiar toda a compilação web dist/ para assets/www/
  console.log('4. A empacotar aplicação web em assets/www...');
  const distDir = path.join(ROOT_DIR, 'dist');
  fs.cpSync(distDir, assetsDir, { recursive: true });

  if (fs.existsSync(googleServicesJsonPath)) {
    fs.copyFileSync(googleServicesJsonPath, path.join(assetsDir, 'google-services.json'));
    fs.copyFileSync(googleServicesJsonPath, path.join(BUILD_DIR, 'assets', 'google-services.json'));
  }

  // 6. Gerar R.java com aapt
  console.log('5. A gerar R.java com AAPT...');
  run(`"${AAPT}" package -f -m -J "${path.join(BUILD_DIR, 'src')}" -M "${path.join(BUILD_DIR, 'AndroidManifest.xml')}" -S "${resDir}" -I "${ANDROID_JAR}"`);

  // 7. Compilar arquivos Java com javac
  console.log('6. A compilar código Java com javac...');
  const javaFiles = fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.java'))
    .map(f => `"${path.join(srcDir, f)}"`)
    .join(' ');
  run(`"${JAVAC}" -encoding UTF-8 -source 1.8 -target 1.8 -bootclasspath "${ANDROID_JAR}" -d "${objDir}" ${javaFiles}`);

  // 8. Converter classes compiladas para classes.dex com D8
  console.log('7. A converter bytecode para classes.dex com D8...');
  const classFiles = fs.readdirSync(path.join(objDir, 'com', 'grupobng', 'imovel'))
    .filter(f => f.endsWith('.class'))
    .map(f => `"${path.join(objDir, 'com', 'grupobng', 'imovel', f)}"`)
    .join(' ');

  run(`"${JAVA}" -cp "${D8_JAR}" com.android.tools.r8.D8 --output "${binDir}" ${classFiles}`);

  // 9. Empacotar APK não-alinhado com aapt
  console.log('8. A empacotar APK unaligned...');
  const unalignedApk = path.join(binDir, 'unaligned.apk');
  run(`"${AAPT}" package -f -M "${path.join(BUILD_DIR, 'AndroidManifest.xml')}" -S "${resDir}" -A "${path.join(BUILD_DIR, 'assets')}" -I "${ANDROID_JAR}" -F "${unalignedApk}"`);

  // 10. Inserir classes.dex no APK
  console.log('9. A adicionar classes.dex ao pacote APK...');
  run(`"${AAPT}" add unaligned.apk classes.dex`, binDir);

  // 11. Alinhar o APK em limites de 4 bytes com zipalign
  console.log('10. A alinhar ficheiro APK com zipalign...');
  const finalApkName = 'BNG Imovel.apk';
  const finalApkPath = path.join(ROOT_DIR, finalApkName);
  if (fs.existsSync(finalApkPath)) {
    fs.unlinkSync(finalApkPath);
  }
  run(`"${ZIPALIGN}" -f -p 4 "${unalignedApk}" "${finalApkPath}"`);

  // 12. Criar Keystore de Assinatura caso não exista
  console.log('11. A assinar o APK com chave de lançamento...');
  const keystorePath = path.join(ROOT_DIR, 'bng-release.keystore');
  if (!fs.existsSync(keystorePath)) {
    run(`"${KEYTOOL}" -genkey -v -keystore "${keystorePath}" -alias bngkey -keyalg RSA -keysize 2048 -validity 10000 -storepass grupobng2026 -keypass grupobng2026 -dname "CN=Grupo BNG, OU=Imobiliaria, O=Grupo BNG Lda, L=Maputo, ST=Maputo, C=MZ"`);
  }

  // 13. Assinar o APK com apksigner (v1, v2 e v3 scheme)
  run(`"${JAVA}" -jar "${APKSIGNER_JAR}" sign --ks "${keystorePath}" --ks-pass pass:grupobng2026 --key-pass pass:grupobng2026 --ks-key-alias bngkey "${finalApkPath}"`);

  // 14. Verificar assinatura
  console.log('12. A verificar assinatura do APK...');
  run(`"${JAVA}" -jar "${APKSIGNER_JAR}" verify --verbose "${finalApkPath}"`);

  // 15. Criar cópia com underline para links e compatibilidade adicional
  fs.copyFileSync(finalApkPath, path.join(ROOT_DIR, 'BNG_Imovel.apk'));
  fs.copyFileSync(finalApkPath, path.join(ROOT_DIR, 'public', 'BNG_Imovel.apk'));

  console.log('\n====================================================');
  console.log(`✅ SUCESSO! APK GERADO COM ÊXITO:`);
  console.log(`   Localização: ${finalApkPath}`);
  console.log(`   Tamanho: ${(fs.statSync(finalApkPath).size / 1024 / 1024).toFixed(2)} MB`);
  console.log('====================================================\n');
}

buildApk().catch(err => {
  console.error('\n❌ Erro durante a compilação do APK:', err);
  process.exit(1);
});
