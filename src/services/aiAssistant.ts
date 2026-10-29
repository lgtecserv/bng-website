import { Listing, Category } from '../types/index';
import { broadcastGlobalAnnouncement } from './supabase';

export interface PropertySearchLead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientWhatsapp?: string;
  propertyType: string;
  transactionType: 'venda' | 'arrendamento' | 'qualquer';
  locationPreferred: string;
  typologyOrDimensions: string;
  essentialFeatures: string;
  budget: string;
  urgencyDeadline: string;
  additionalNotes?: string;
  source: 'ai_assistant_ajuda';
  status: 'novo' | 'em_atendimento' | 'atendido';
  createdAt: string;
}

export interface LeadChecklist {
  propertyType?: string;
  transactionType?: 'venda' | 'arrendamento' | 'qualquer';
  locationPreferred?: string;
  typologyOrDimensions?: string;
  essentialFeatures?: string;
  budget?: string;
  urgencyDeadline?: string;
  clientName?: string;
  clientPhone?: string;
  clientWhatsapp?: string;
  additionalNotes?: string;
  isComplete?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedListings?: Listing[];
  leadCaptured?: PropertySearchLead;
  checklist?: LeadChecklist;
  isQuestionnairePrompt?: boolean;
}

const STORAGE_LEADS_KEY = 'bng_property_leads_v2';
export const OFFICIAL_BNG_WHATSAPP = '258880096995';

export function getStoredLeads(): PropertySearchLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredLead(lead: PropertySearchLead): void {
  try {
    const list = getStoredLeads();
    // Evita duplicar se já existir o mesmo id
    const existingIdx = list.findIndex(l => l.id === lead.id);
    if (existingIdx >= 0) {
      list[existingIdx] = lead;
    } else {
      list.unshift(lead);
    }
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
  } catch (err) {
    console.error('Erro ao guardar lead:', err);
  }
}

export function updateLeadStatus(leadId: string, status: 'novo' | 'em_atendimento' | 'atendido'): void {
  try {
    const list = getStoredLeads().map(l => l.id === leadId ? { ...l, status } : l);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
  } catch (err) {
    console.error('Erro ao actualizar status da lead:', err);
  }
}

export function deleteLead(leadId: string): void {
  try {
    const list = getStoredLeads().filter(l => l.id !== leadId);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
  } catch (err) {
    console.error('Erro ao eliminar lead:', err);
  }
}

// Formatação da mensagem pronta para o WhatsApp Oficial do Grupo BNG
export function generateWhatsAppLeadMessage(checklist: LeadChecklist): string {
  const name = checklist.clientName || 'Cliente';
  const phone = checklist.clientPhone || checklist.clientWhatsapp || 'A confirmar';
  const prop = checklist.propertyType || 'Imóvel sob consulta';
  const finality = checklist.transactionType === 'venda' ? 'Compra (Venda)' : checklist.transactionType === 'arrendamento' ? 'Arrendamento (Renda)' : 'Compra ou Arrendamento';
  const loc = checklist.locationPreferred || 'Moçambique (a especificar)';
  const tip = checklist.typologyOrDimensions || 'Sob consulta';
  const feat = checklist.essentialFeatures || 'Não especificado';
  const bud = checklist.budget || 'A negociar';
  const urg = checklist.urgencyDeadline || 'Prontamente';
  const obs = checklist.additionalNotes ? `\n8️⃣ *Outras Observações:* ${checklist.additionalNotes}` : '';

  return `*SOLICITAÇÃO DE IMÓVEL • GRUPO BNG*\n` +
    `----------------------------------------\n` +
    `👤 *Cliente:* ${name}\n` +
    `📱 *Contacto:* ${phone}\n\n` +
    `📋 *FICHA DE ESPECIFICAÇÃO DE PROCURA:*\n` +
    `1️⃣ *Tipo de Imóvel:* ${prop}\n` +
    `2️⃣ *Finalidade:* ${finality}\n` +
    `3️⃣ *Localização:* ${loc}\n` +
    `4️⃣ *Tipologia / Dimensão:* ${tip}\n` +
    `5️⃣ *Características Essenciais:* ${feat}\n` +
    `6️⃣ *Orçamento Pretendido:* ${bud}\n` +
    `7️⃣ *Quando Precisa do Imóvel:* ${urg}` +
    `${obs}\n` +
    `----------------------------------------\n` +
    `_Enviado pelo Assistente Inteligente de Ajuda do Grupo BNG_`;
}

// Chave da OpenAI a partir do .env
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export async function askAiAssistant(
  userPrompt: string,
  history: ChatMessage[],
  catalog: Listing[],
  categories: Category[],
  currentChecklist?: LeadChecklist
): Promise<{ 
  text: string; 
  suggestedListings: Listing[]; 
  leadData?: PropertySearchLead;
  checklist?: LeadChecklist;
}> {
  // 1. Resumo compacto do catálogo para contexto da IA com contagem de visualizações
  const catalogSummary = catalog.map(item => ({
    id: item.id,
    title: item.title,
    category: item.categoryName,
    type: item.transactionType === 'sale' ? 'Venda' : 'Arrendamento',
    price: `${item.price} MT`,
    location: `${item.neighborhood ? item.neighborhood + ', ' : ''}${item.district}, ${item.province}`,
    rooms: item.bedrooms ? `${item.bedrooms} quartos` : undefined,
    area: item.areaM2 ? `${item.areaM2} m²` : undefined,
    condoHouses: item.condoTotalHouses ? `${item.condoTotalHouses} casas no condomínio` : undefined,
    condoModel: item.condoCommercialModel,
    viewsCount: item.viewsCount || 0
  }));

  const systemInstructions = `
Você é o Consultor Imobiliário Oficial e ATIVO do Grupo BNG em Moçambique.
Você NÃO é passivo e NÃO espera o cliente pedir tudo. Você conduz a conversa com entusiasmo, simpatia moçambicana e profissionalismo.

SUA MISSÃO DUPLA:
1. Se o cliente procura algo que EXISTE no catálogo, apresente as opções de forma calorosa (pode destacar os mais visitados pelo público usando "viewsCount") e retorne os IDs exatos em "suggestedListingIds". Pergunte se alguma lhe agrada ou se deseja algo diferente.
2. Se o cliente diz que "não tem o que quer", pergunta "quais imóveis existem", procura algo ausente no catálogo, ou pede ajuda para encontrar um imóvel:
   - ASSUMA O CONTROLE CONSULTIVO IMEDIATAMENTE!
   - Diga com cordialidade que o Grupo BNG mobiliza e encontra o imóvel exato para si.
   - Conduza ativamente o preenchimento das 8 PERGUNTAS ESSENCIAIS:
     1. Que tipo de imóvel procura? (Vivendas, Apartamentos, Condomínios, Terrenos, etc.)
     2. Pretende arrendar ou comprar?
     3. Em que localização/bairro prefere? (Maputo, Matola, Boane, Sommerschield, etc.)
     4. Qual é a tipologia ou dimensão pretendida? (Ex: T2, T3, T4, m²)
     5. Quais características essenciais procura? (Ex: piscina, segurança 24h, quintal, garagem)
     6. Qual é o seu orçamento máximo ou pretendido em Meticais (MT)?
     7. Quando precisa do imóvel? (Urgente, este mês, próximos meses)
     8. Nome do cliente e número de WhatsApp / Telefone.

INCENTIVO AO BOTÃO DO WHATSAPP (MUITO IMPORTANTE):
- Sempre que você reunir as informações do cliente (ou quando o cliente informar o contacto ou boa parte dos dados), você DEVE INCENTIVAR EXPLICITAMENTE o cliente a clicar no botão verde do WhatsApp que aparece no chat!
- Exemplo de fechamento de resposta: "A sua ficha de procura está organizada! 🎯 Por favor, toque no botão verde abaixo **'Enviar Ficha ao WhatsApp BNG'** para enviar os dados diretamente ao nosso WhatsApp oficial para iniciarmos a procura com máxima prioridade!"

ESTILO DE RESPOSTA OBRIGATÓRIO (LIMPO):
- NÃO use excesso de asteriscos. NUNCA gere blocos com asteriscos em todas as linhas.
- Use negrito com moderação (**apenas títulos ou palavras-chave essenciais**).
- Faça perguntas de forma amigável, agrupando 2 a 3 pontos por vez com naturalidade para o cliente responder com calma.
- NUNCA diga apenas "aqui estão as perguntas" sem perguntar nada. Faça perguntas reais e diretas na própria mensagem!

EXTRAÇÃO DE DADOS (CHECKLIST ACUMULATIVO):
- Analise a mensagem do cliente e o histórico. Sempre que o cliente informar algo (tipo de imóvel, bairro, valor, quartos, compra/arrendamento, nome, telefone), atualize o objeto "checklist".
- Checklist acumulado anterior: ${JSON.stringify(currentChecklist || {})}.
- Se o cliente já forneceu nome e telefone (ou se já tiver quase todas as informações), defina isComplete: true.

FORMATO DE RESPOSTA (JSON ESTRITO):
{
  "reply": "Texto da resposta ao utilizador com tom consultivo, limpo e acolhedor (lembrando de incentivar o clique no botão do WhatsApp)",
  "suggestedListingIds": ["id1"], // se houver imóveis do catálogo que combinam
  "checklist": {
    "propertyType": "string ou null",
    "transactionType": "venda" | "arrendamento" | "qualquer",
    "locationPreferred": "string ou null",
    "typologyOrDimensions": "string ou null",
    "essentialFeatures": "string ou null",
    "budget": "string ou null",
    "urgencyDeadline": "string ou null",
    "clientName": "string ou null",
    "clientPhone": "string ou null",
    "additionalNotes": "string ou null",
    "isComplete": boolean
  }
}
`;

  if (OPENAI_API_KEY) {
    try {
      const messagesPayload = [
        { role: 'system', content: systemInstructions },
        { 
          role: 'system', 
          content: `CATÁLOGO ATUAL DE IMÓVEIS DISPONÍVEIS NO GRUPO BNG:\n${JSON.stringify(catalogSummary, null, 2)}\n\nCATEGORIAS:\n${categories.map(c => c.name).join(', ')}` 
        },
        ...history.slice(-8).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: userPrompt }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload,
          response_format: { type: 'json_object' },
          temperature: 0.6
        })
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const suggestedIds: string[] = parsed.suggestedListingIds || [];
          const matches = catalog.filter(c => suggestedIds.includes(c.id));

          // Merge checklist acumulativo
          const mergedChecklist: LeadChecklist = {
            ...(currentChecklist || {}),
            ...(parsed.checklist || {})
          };

          // Remove campos vazios ou nulos
          Object.keys(mergedChecklist).forEach(key => {
            const k = key as keyof LeadChecklist;
            if (mergedChecklist[k] === null || mergedChecklist[k] === undefined || mergedChecklist[k] === 'null') {
              delete mergedChecklist[k];
            }
          });

          // Se tiver dados suficientes ou se o cliente deu telefone, salva a lead para o admin
          let lead: PropertySearchLead | undefined = undefined;
          const hasMinimumInfo = Boolean(
            mergedChecklist.propertyType || 
            mergedChecklist.locationPreferred || 
            mergedChecklist.budget
          );

          if (hasMinimumInfo) {
            lead = {
              id: `LEAD-${Date.now()}`,
              clientName: mergedChecklist.clientName || 'Cliente Interessado (IA)',
              clientPhone: mergedChecklist.clientPhone || 'Sob consulta WhatsApp',
              clientWhatsapp: mergedChecklist.clientPhone || mergedChecklist.clientWhatsapp || '',
              propertyType: mergedChecklist.propertyType || 'Imóvel em Procura',
              transactionType: mergedChecklist.transactionType || 'venda',
              locationPreferred: mergedChecklist.locationPreferred || 'Moçambique',
              typologyOrDimensions: mergedChecklist.typologyOrDimensions || 'A definir',
              essentialFeatures: mergedChecklist.essentialFeatures || 'Conforme conversa',
              budget: mergedChecklist.budget || 'Sob consulta',
              urgencyDeadline: mergedChecklist.urgencyDeadline || 'Prontamente',
              additionalNotes: mergedChecklist.additionalNotes || '',
              source: 'ai_assistant_ajuda',
              status: 'novo',
              createdAt: new Date().toISOString()
            };

            saveStoredLead(lead);

            // Se tem contacto, alerta os administradores de forma confidencial
            if (mergedChecklist.clientPhone) {
              await broadcastGlobalAnnouncement(
                `🔔 Novo Pedido de Imóvel (IA Ajuda)`,
                `Cliente ${lead.clientName} procura ${lead.propertyType} em ${lead.locationPreferred} (${lead.budget}). Tel: ${lead.clientPhone}`,
                'system',
                'admin-dashboard',
                undefined,
                false,
                'admin_only'
              );
            }
          }

          return {
            text: parsed.reply || 'Como posso ajudar a encontrar o imóvel ideal no Grupo BNG?',
            suggestedListings: matches,
            leadData: lead,
            checklist: Object.keys(mergedChecklist).length > 0 ? mergedChecklist : undefined
          };
        }
      } else {
        console.warn('OpenAI API retornou erro:', response.status, await response.text());
      }
    } catch (e) {
      console.error('Falha ao comunicar com OpenAI:', e);
    }
  }

  // Motor Inteligente Local (Fallback Resiliente de Alta Eficácia)
  return fallbackLocalAi(userPrompt, history, catalog, currentChecklist);
}

// Fallback Inteligente caso a API offline ou indisponível
async function fallbackLocalAi(
  prompt: string,
  history: ChatMessage[],
  catalog: Listing[],
  currentChecklist?: LeadChecklist
): Promise<{ 
  text: string; 
  suggestedListings: Listing[]; 
  leadData?: PropertySearchLead;
  checklist?: LeadChecklist;
}> {
  const p = prompt.toLowerCase();
  const merged: LeadChecklist = { ...(currentChecklist || {}) };

  // Detecta intenções básicas
  if (p.includes('arrend') || p.includes('renda') || p.includes('alugar')) {
    merged.transactionType = 'arrendamento';
  } else if (p.includes('compr') || p.includes('venda')) {
    merged.transactionType = 'venda';
  }

  if (p.includes('vivenda') || p.includes('casa')) merged.propertyType = 'Casas e Vivendas';
  if (p.includes('apartam') || p.includes('flat')) merged.propertyType = 'Apartamentos e Flats';
  if (p.includes('condom')) merged.propertyType = 'Condomínios Residenciais';
  if (p.includes('terren')) merged.propertyType = 'Terrenos';
  if (p.includes('escritor')) merged.propertyType = 'Escritórios';
  if (p.includes('armaz')) merged.propertyType = 'Armazéns e Galpões';

  if (p.includes('matola')) merged.locationPreferred = 'Matola';
  if (p.includes('maputo')) merged.locationPreferred = 'Maputo';
  if (p.includes('boane')) merged.locationPreferred = 'Boane';
  if (p.includes('polana')) merged.locationPreferred = 'Polana';
  if (p.includes('triunfo')) merged.locationPreferred = 'Triunfo';
  if (p.includes('sommerschield')) merged.locationPreferred = 'Sommerschield';

  // 1. Procurar no catálogo por palavras-chave
  const matches = catalog.filter(item => {
    const textCorpus = `${item.title} ${item.description} ${item.neighborhood} ${item.district} ${item.province} ${item.categoryName}`.toLowerCase();
    
    if (merged.transactionType === 'arrendamento' && item.transactionType !== 'rent') return false;
    if (merged.transactionType === 'venda' && item.transactionType !== 'sale') return false;

    if (p.includes('condom') && !textCorpus.includes('condom')) return false;
    if (p.includes('terren') && !textCorpus.includes('terren')) return false;
    if (p.includes('apartam') && !textCorpus.includes('apartam')) return false;

    if (merged.locationPreferred && !textCorpus.includes(merged.locationPreferred.toLowerCase())) return false;

    return true;
  });

  if (matches.length > 0 && !p.includes('não tem') && !p.includes('outro')) {
    return {
      text: `Encontrei ${matches.length} excelente${matches.length > 1 ? 's' : ''} opção(ões) no catálogo do Grupo BNG que se enquadram na sua procura. Pode tocar em qualquer uma abaixo para ver fotos e detalhes completos. Se preferir algo diferente, diga-me que farei o acompanhamento sob medida!`,
      suggestedListings: matches.slice(0, 3),
      checklist: Object.keys(merged).length > 0 ? merged : undefined
    };
  }

  // Se o utilizador disser que não tem o que quer ou não encontrou
  return {
    text: `Compreendo perfeitamente! No Grupo BNG nós não ficamos limitados ao catálogo: a nossa equipa de corretores vai localizar ou mobilizar o imóvel exato para si.\n\nPara avançarmos com a sua ficha de procura prioritária: qual seria a tipologia (ex: T2, T3, T4) e características que não podem faltar (ex: piscina, garagem, segurança)?`,
    suggestedListings: [],
    checklist: Object.keys(merged).length > 0 ? merged : undefined
  };
}
