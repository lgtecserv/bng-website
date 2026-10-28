import fs from 'fs';

const logPath = 'C:\\Users\\inaci\\.gemini\\antigravity-ide\\brain\\1c0a86d4-95da-4fcb-9309-11613646714b\\.system_generated\\logs\\transcript_full.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('preciso que o sistema use o logo real')) {
    const obj = JSON.parse(line);
    console.log('STEP 221 KEYS:', Object.keys(obj));
    if (obj.files || obj.media || obj.attachments || obj.images) {
      console.log('MEDIA:', obj.files || obj.media || obj.attachments || obj.images);
    }
    // Percorre todos os campos procurando caminhos de arquivo .png
    const str = JSON.stringify(obj);
    const matches = str.match(/([A-Za-z]:\\[^"'\n]+\.png|\/[^"'\n]+\.png)/g);
    console.log('PNG MATCHES:', matches);
    break;
  }
}
