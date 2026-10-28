import fs from 'fs';
import path from 'path';

const p = 'D:\\Projetos de websites\\Grupo Bng app\\stitch_extracted\\stitch_grupo_bng_mobile_admin';
console.log('Items in folder:', fs.readdirSync(p));

const sub = path.join(p, 'conceito_ui_ux_do_grupo_bng.png');
const stat = fs.statSync(sub);
console.log('conceito isDirectory?', stat.isDirectory());
if (stat.isDirectory()) {
  console.log('Sub contents:', fs.readdirSync(sub));
}
