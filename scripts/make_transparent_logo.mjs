import sharp from 'sharp';

async function processLogo() {
  const input = 'public/logo.png';
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 245; // Branco ou quase branco

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0; // Transparente
    } else if (r >= 220 && g >= 220 && b >= 220) {
      // Suavização da borda
      const factor = (255 - Math.max(r, g, b)) / (255 - 220);
      data[i + 3] = Math.round(data[i + 3] * factor);
    }
  }

  // Gera a imagem transparente e faz trim dos espaços vazios
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .trim()
  .toFile('public/logo-transparent.png');

  // Também cria uma versão recortada da logo original
  await sharp(input)
    .trim({ threshold: 10 })
    .toFile('public/logo-cropped.png');

  console.log('Logo processado com sucesso: public/logo-transparent.png e public/logo-cropped.png');
}

processLogo().catch(console.error);
