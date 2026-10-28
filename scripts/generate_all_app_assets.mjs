import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImg = 'C:/Users/inaci/.gemini/antigravity-ide/brain/1c0a86d4-95da-4fcb-9309-11613646714b/.user_uploaded/media_1793049525203.jpg';
const publicDir = path.resolve('public');
const apkResDir = path.resolve('apk-assets/android/res');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function buildAllIcons() {
  console.log('--- Construindo Assets de Favicon, PWA e Android APK para Grupo BNG ---');
  await ensureDir(publicDir);

  // 1. Favicons Web & Navegador
  await sharp(sourceImg).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(sourceImg).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(sourceImg).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  await sharp(sourceImg).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(sourceImg).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✅ Favicons criados (16x16, 32x32, 48x48, favicon.ico)');

  // 2. Apple Touch Icons
  await sharp(sourceImg).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(sourceImg).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));
  console.log('✅ Apple Touch Icons criados (180x180)');

  // 3. PWA Icons (192, 512, e aliases)
  await sharp(sourceImg).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(sourceImg).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(sourceImg).resize(192, 192).png().toFile(path.join(publicDir, 'logo192.png'));
  await sharp(sourceImg).resize(512, 512).png().toFile(path.join(publicDir, 'logo512.png'));
  await sharp(sourceImg).resize(1024, 1024).png().toFile(path.join(publicDir, 'bng-app-icon.png'));

  // Maskable Icon com padding de 10% para Android launcher não cortar as bordas
  await sharp(sourceImg)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#14181B'
    })
    .png()
    .toFile(path.join(publicDir, 'maskable-icon-512.png'));
  console.log('✅ PWA Icons criados (192, 512, 1024 e Maskable com safe margin)');

  // 4. Ícone de Notificação da Barra de Estado do Celular (Status Bar Icon)
  // No Android, a barra de notificações exige ícone com fundo transparente e canal alfa
  // Vamos criar uma versão de alta nitidez transparente e a versão com cor
  await sharp(sourceImg).resize(96, 96).png().toFile(path.join(publicDir, 'notification-icon.png'));
  await sharp(sourceImg).resize(72, 72).png().toFile(path.join(publicDir, 'bng-badge.png'));

  // Criação da silhueta branca sobre transparente para a status bar do Android
  const { data, info } = await sharp(sourceImg)
    .resize(96, 96)
    .grayscale()
    .threshold(110)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Cria buffer RGBA onde os pixels claros ficam brancos com opacidade, e o fundo preto fica transparente
  const rgbaBuffer = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const val = data[i];
    if (val > 100) {
      rgbaBuffer[i * 4] = 255;     // R
      rgbaBuffer[i * 4 + 1] = 255; // G
      rgbaBuffer[i * 4 + 2] = 255; // B
      rgbaBuffer[i * 4 + 3] = 255; // Alpha total
    } else {
      rgbaBuffer[i * 4] = 0;
      rgbaBuffer[i * 4 + 1] = 0;
      rgbaBuffer[i * 4 + 2] = 0;
      rgbaBuffer[i * 4 + 3] = 0;   // Transparente
    }
  }

  await sharp(rgbaBuffer, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(publicDir, 'notification-statusbar-icon.png'));
  console.log('✅ Ícones de Notificação do Sistema Android criados');

  // 5. Estrutura Completa de Pastas para Compilar APK Nativo Android (mipmap e drawable)
  const densities = [
    { name: 'mdpi', launcherSize: 48, notifSize: 24 },
    { name: 'hdpi', launcherSize: 72, notifSize: 36 },
    { name: 'xhdpi', launcherSize: 96, notifSize: 48 },
    { name: 'xxhdpi', launcherSize: 144, notifSize: 72 },
    { name: 'xxxhdpi', launcherSize: 192, notifSize: 96 },
  ];

  for (const d of densities) {
    const mipmapDir = path.join(apkResDir, `mipmap-${d.name}`);
    const drawableDir = path.join(apkResDir, `drawable-${d.name}`);
    await ensureDir(mipmapDir);
    await ensureDir(drawableDir);

    // ic_launcher.png (quadrado / cantos padrão)
    await sharp(sourceImg)
      .resize(d.launcherSize, d.launcherSize)
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher.png'));

    // ic_launcher_round.png (formato redondo do Android)
    await sharp(sourceImg)
      .resize(d.launcherSize, d.launcherSize)
      .png()
      .toFile(path.join(mipmapDir, 'ic_launcher_round.png'));

    // ic_stat_notification.png (ícone para a barra de notificações do Android)
    await sharp(rgbaBuffer, { raw: { width: info.width, height: info.height, channels: 4 } })
      .resize(d.notifSize, d.notifSize)
      .png()
      .toFile(path.join(drawableDir, 'ic_stat_notification.png'));
  }
  console.log('✅ Estrutura completa de pastas Android res/ (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) gerada em apk-assets/android/res/');

  console.log('--- Todos os assets de notificação e ícones foram gerados com sucesso! ---');
}

buildAllIcons().catch(err => {
  console.error('Erro ao gerar ícones:', err);
  process.exit(1);
});
