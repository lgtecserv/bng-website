import fs from 'fs';
import path from 'path';

function searchImages(dir, depth = 0) {
  if (depth > 5) return;
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (!item.includes('node_modules') && !item.includes('.git')) {
          searchImages(full, depth + 1);
        }
      } else if (/\.(png|jpe?g|webp)$/i.test(item)) {
        const mtime = stat.mtime;
        // arquivos criados/modificados nas ultimas 24 horas
        if (Date.now() - mtime.getTime() < 24 * 3600 * 1000) {
          console.log(mtime.toISOString(), stat.size, full);
        }
      }
    }
  } catch (e) {}
}

console.log('--- BUSCA EM C:\\Users\\inaci\\.gemini ---');
searchImages('C:\\Users\\inaci\\.gemini');
