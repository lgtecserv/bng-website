import fs from 'fs';
import path from 'path';

const candidateDirs = [
  'C:\\Users\\inaci\\.gemini',
  'C:\\Users\\inaci\\AppData\\Local\\Temp',
  'C:\\Users\\inaci\\AppData\\Roaming\\antigravity-ide',
  'C:\\Users\\inaci\\AppData\\Local\\antigravity-ide'
];

function findRecentImages(dir) {
  try {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (!f.includes('node_modules') && !f.includes('.git') && !f.includes('browser_recordings')) {
            findRecentImages(full);
          }
        } else if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
          // arquivos com tamanho maior que 10KB e menor que 5MB modificados recentemente
          const ageHours = (Date.now() - stat.mtimeMs) / (1000 * 3600);
          if (ageHours < 12 && stat.size > 20000 && stat.size < 5000000) {
            console.log(`${stat.size} bytes | ${stat.mtime.toISOString()} | ${full}`);
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

for (const d of candidateDirs) {
  findRecentImages(d);
}
