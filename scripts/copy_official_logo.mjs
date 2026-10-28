import fs from 'fs';
import path from 'path';

const source = 'C:\\Users\\inaci\\.gemini\\antigravity-ide\\brain\\1c0a86d4-95da-4fcb-9309-11613646714b\\.user_uploaded\\media_1792970136398.png';
const destPublic = 'd:\\Projetos de websites\\Grupo Bng app\\public\\logo.png';
const destSrc = 'd:\\Projetos de websites\\Grupo Bng app\\src\\assets\\logo.png';

fs.mkdirSync('d:\\Projetos de websites\\Grupo Bng app\\src\\assets', { recursive: true });

fs.copyFileSync(source, destPublic);
fs.copyFileSync(source, destSrc);

console.log('Logo copiado com sucesso para:');
console.log(' -', destPublic);
console.log(' -', destSrc);
console.log('Tamanho:', fs.statSync(destPublic).size, 'bytes');
