import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImg = 'C:/Users/inaci/.gemini/antigravity-ide/brain/1c0a86d4-95da-4fcb-9309-11613646714b/.user_uploaded/media_1793049525203.jpg';
const publicDir = path.resolve('public');

async function generateIcons() {
  console.log('Generating app icons from BNG circular gold logo...');

  // 1. Favicon 32x32
  await sharp(sourceImg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png (32x32)');

  // 2. Favicon.ico (sharp doesn't directly encode multi-size ico, so save 32x32 png / rename or copy)
  await sharp(sourceImg)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated favicon.ico (48x48)');

  // 3. Apple Touch Icon 180x180
  await sharp(sourceImg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png (180x180)');

  // 4. Android PWA / APK Icon 192x192
  await sharp(sourceImg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated icon-192.png (192x192)');

  // 5. Android PWA / APK Icon 512x512
  await sharp(sourceImg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated icon-512.png (512x512)');

  // 6. Notification Icon (para a barra de notificações do telemóvel e Push)
  await sharp(sourceImg)
    .resize(96, 96)
    .png()
    .toFile(path.join(publicDir, 'notification-icon.png'));
  console.log('Generated notification-icon.png (96x96)');

  // 7. Badge Icon (para Android Notification Channel badge)
  await sharp(sourceImg)
    .resize(72, 72)
    .png()
    .toFile(path.join(publicDir, 'bng-badge.png'));
  console.log('Generated bng-badge.png (72x72)');

  // 8. Cópia em alta resolução para assets de APK
  await sharp(sourceImg)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(publicDir, 'bng-app-icon.png'));
  console.log('Generated bng-app-icon.png (1024x1024)');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
