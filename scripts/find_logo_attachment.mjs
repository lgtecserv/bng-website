import fs from 'fs';

const logPath = 'C:\\Users\\inaci\\.gemini\\antigravity-ide\\brain\\1c0a86d4-95da-4fcb-9309-11613646714b\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('preciso que o sistema use o logo real')) {
    const obj = JSON.parse(line);
    console.log('ENCONTRADO NO STEP:', obj.step_index);
    console.log(JSON.stringify(obj, null, 2));
    break;
  }
}
