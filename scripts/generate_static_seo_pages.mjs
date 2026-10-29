import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../website-dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[ERRO] website-dist/index.html não encontrado! Execute vite build primeiro.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const routes = [
  {
    path: 'imobiliario',
    title: 'Imóveis em Moçambique | Casas, Vivendas e Apartamentos — Grupo BNG',
    description: 'Encontre casas, vivendas no Triunfo, apartamentos na Polana e terrenos para venda e arrendamento em Maputo, Matola e Moçambique. Grupo BNG Imobiliária Oficial.',
    canonical: 'https://www.grupobngoficial.com/imobiliario',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'servicos/limpeza',
    title: 'Limpeza Profissional e Pós-Obra em Maputo | Grupo BNG Facilidades',
    description: 'Serviços de limpeza industrial, empresarial, residencial e pós-obra de alta performance em Maputo e Matola. Equipas qualificadas com fatura com NUIT.',
    canonical: 'https://www.grupobngoficial.com/servicos/limpeza',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'servicos/procurement',
    title: 'Procurement Corporativo e Fornecimento de Bens em Moçambique | Grupo BNG',
    description: 'Fornecimento corporativo de EPIs, consumíveis, materiais de escritório e equipamentos industriais para empresas em Moçambique com cotação ágil.',
    canonical: 'https://www.grupobngoficial.com/servicos/procurement',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'baixar-app',
    title: 'Baixar App BNG Imóvel Oficial | Android APK Direto',
    description: 'Baixe o aplicativo móvel oficial do Grupo BNG para Android. Explore imóveis em tempo real, receba alertas de novas oportunidades e contacte agentes diretamente.',
    canonical: 'https://www.grupobngoficial.com/baixar-app',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'contato',
    title: 'Fale Conosco | Atendimento Imobiliário e Corporativo — Grupo BNG',
    description: 'Contacte o Grupo BNG em Maputo. Atendimento para compra, venda e arrendamento, orçamentos de limpeza e cotações de procurement corporativo via WhatsApp ou telefone.',
    canonical: 'https://www.grupobngoficial.com/contato',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'publicar',
    title: 'Publicar Imóvel para Venda ou Arrendamento | Grupo BNG',
    description: 'Cadastre o seu imóvel no portal oficial do Grupo BNG e alcance milhares de compradores e investidores em Moçambique e na diáspora.',
    canonical: 'https://www.grupobngoficial.com/publicar',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  },
  {
    path: 'privacidade',
    title: 'Política de Privacidade | Grupo BNG Moçambique',
    description: 'Consulte as diretrizes de privacidade, proteção de dados pessoais e segurança da informação do Grupo BNG em conformidade com a legislação de Moçambique.',
    canonical: 'https://www.grupobngoficial.com/privacidade',
    robots: 'index, follow'
  },
  {
    path: 'termos',
    title: 'Termos de Uso e Condições Gerais | Grupo BNG Moçambique',
    description: 'Termos e condições de utilização da plataforma digital imobiliária e serviços corporativos do Grupo BNG. Regras de publicação e transações.',
    canonical: 'https://www.grupobngoficial.com/termos',
    robots: 'index, follow'
  },
  {
    path: 'parcerias',
    title: 'Políticas de Parcerias e Co-Corretagem Imobiliária | Grupo BNG',
    description: 'Diretrizes oficiais de parceria e co-corretagem do Grupo BNG com agências e corretores: divisão equitativa 50/50 e regra estrita de no máximo 1 intermediário.',
    canonical: 'https://www.grupobngoficial.com/parcerias',
    robots: 'index, follow'
  },
  {
    path: 'admin',
    title: 'Painel Administrativo | Grupo BNG',
    description: 'Painel de gestão interna do Grupo BNG.',
    canonical: 'https://www.grupobngoficial.com/admin',
    robots: 'noindex, nofollow'
  }
];

console.log('--- Gerando páginas estáticas para SEO e Vercel 200 OK ---');

for (const r of routes) {
  const targetDir = path.join(distDir, r.path);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let html = baseHtml;
  // Substituir title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${r.title}</title>`);
  
  // Substituir description
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${r.description}" />`);
  
  // Substituir canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${r.canonical}" />`);
  
  // Substituir Open Graph title, description, url
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${r.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${r.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${r.canonical}" />`);
  
  // Substituir Twitter title, description
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${r.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${r.description}" />`);

  // Substituir robots se necessário
  if (r.robots) {
    html = html.replace(/<meta name="robots" content=".*?" \/>/s, `<meta name="robots" content="${r.robots}" />`);
  }

  const outPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`[OK] Criada rota estática: /${r.path}/index.html`);
}

console.log('--- Todas as páginas estáticas de SEO foram geradas com sucesso! ---');
