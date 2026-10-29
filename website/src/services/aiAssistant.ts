import { Listing, Category } from '../types';
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

export function generateWhatsAppLeadMessage(checklist: LeadChecklist): string {
  const name = checklist.clientName || 'Cliente';
  const phone = checklist.clientPhone || checklist.clientWhatsapp || 'A confirmar';

  return `Olá Grupo BNG!
Estou a contactar através do website oficial. Gostaria de solicitar acompanhamento para encontrar o seguinte imóvel:

1. Tipo de Imóvel: ${checklist.propertyType || 'Qualquer / A definir'}
2. Finalidade: ${checklist.transactionType === 'venda' ? 'Compra' : checklist.transactionType === 'arrendamento' ? 'Arrendamento' : 'A avaliar'}
3. Localização pretendida: ${checklist.locationPreferred || 'Qualquer zona'}
4. Tipologia ou Dimensão: ${checklist.typologyOrDimensions || 'Conforme disponível'}
5. Características Essenciais: ${checklist.essentialFeatures || 'Padrão moderno'}
6. Orçamento Previsto: ${checklist.budget || 'A negociar'}
7. Prazo pretendido: ${checklist.urgencyDeadline || 'O mais breve possível'}
8. Contacto / Observações: ${name} (${phone}) - ${checklist.additionalNotes || 'Aguardando opções'}`;
}

export async function askAiAssistant(
  userPrompt: string,
  history: ChatMessage[],
  catalog: Listing[],
  categories: Category[],
  currentChecklist?: LeadChecklist
): Promise<{
  text: string;
  suggestedListings?: Listing[];
  leadData?: PropertySearchLead;
  checklist?: LeadChecklist;
}> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || (typeof process !== 'undefined' ? process.env?.VITE_OPENAI_API_KEY : '');

  if (apiKey) {
    try {
      const catalogSummary = catalog.slice(0, 40).map(l => ({
        id: l.id,
        titulo: l.title,
        categoria: l.categoryName,
        tipo: l.transactionType === 'sale' ? 'Venda' : 'Arrendamento',
        precoMT: l.price,
        bairro: l.neighborhood || '',
        distrito: l.district,
        provincia: l.province,
        areaM2: l.areaM2,
        quartos: l.bedrooms,
        casas_condominio: l.condoTotalHouses,
        seguranca_condominio: l.condoHasSecurity ? 'Sim' : 'Não',
        estado_obra: l.condoConstructionStatus
      }));

      const categoriesSummary = categories.map(c => c.name).join(', ');

      const systemPrompt = `Você é o Consultor e Assistente Oficial de IA do Grupo BNG (Moçambique).
Seu objetivo é ser um consultor ativo, cordial, proativo e especialista em mediação imobiliária e negócios em Moçambique.

REGRAS DE FORMATAÇÃO E ESTILO (MUITO IMPORTANTE):
1. NUNCA use asteriscos duplos soltos ou desordenados como "**". Quando quiser dar ênfase, use frases claras ou use negrito limpo em títulos de seções.
2. Seja elegante, conciso, organizado e caloroso.
3. Use a moeda Meticais (MT) e cidades/províncias de Moçambique (ex: Maputo Cidade, Matola, Boane, Marracuene, Triunfo, Polana, Sommerschield, etc.).
4. Use o número oficial de WhatsApp do Grupo BNG: +258 880096995.

COMPORTAMENTO ATIVO DE CONSULTOR:
Você NÃO deve apenas dar respostas secas. Você deve guiar o cliente ativamente, acolhendo as respostas que ele der e fazendo perguntas de seguimento naturais para entender o que ele procura:
- 1. Que tipo de imóvel procura? (Casas, Apartamentos, Condomínios, Terrenos, etc.)
- 2. Pretende arrendar ou comprar?
- 3. Em que localização preferes? (bairro ou distrito em Moçambique)
- 4. Qual é a tipologia ou dimensão pretendida? (ex: T2, T3, T4, ou dimensões de terreno)
- 5. Quais características essenciais procura? (piscina, suíte, água/luz, segurança 24h, garagem, etc.)
- 6. Qual é o seu orçamento estimado?
- 7. Quando precisa do imóvel? (imediato, 1 mês, etc.)
- 8. Contacto do cliente para a equipa ligar.

AÇÕES EM RELAÇÃO AO CATÁLOGO:
- Se houver imóveis no catálogo que atendam à procura, recomende-os pelos IDs no campo "matching_listing_ids".
- Se o imóvel procurado NÃO existir no catálogo, informe com simpatia e garanta que o Grupo BNG tem corretores no terreno para encontrar exatamente o que ele precisa sob encomenda. Incentive o envio da ficha para a equipa pelo WhatsApp ou deixe registrado para o administrador.

CATEGORIAS DISPONÍVEIS:
${categoriesSummary}

CATÁLOGO ATUAL (RESUMO):
${JSON.stringify(catalogSummary)}

CHECKLIST ACUMULADO ATÉ O MOMENTO:
${JSON.stringify(currentChecklist || {})}

FORMATO OBRIGATÓRIO DE RESPOSTA (JSON PURO):
{
  "reply": "Texto de resposta para o cliente",
  "matching_listing_ids": ["id-1", "id-2"],
  "checklist_updates": {
    "propertyType": "Casas e Vivendas",
    "transactionType": "venda",
    "locationPreferred": "Matola",
    "typologyOrDimensions": "T3",
    "essentialFeatures": "garagem e piscina",
    "budget": "5.000.000 MT",
    "urgencyDeadline": "próximo mês",
    "clientName": "Nome se fornecido",
    "clientPhone": "Telefone se fornecido"
  },
  "is_complete_lead": false
}`;

      const conversationMessages = [
        { role: 'system', content: systemPrompt },
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
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: conversationMessages,
          response_format: { type: 'json_object' },
          temperature: 0.5,
          max_tokens: 650
        })
      });

      if (response.ok) {
        const data = await response.json();
        const contentStr = data.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);

          const matches: Listing[] = [];
          if (Array.isArray(parsed.matching_listing_ids)) {
            parsed.matching_listing_ids.forEach((id: string) => {
              const found = catalog.find(l => l.id === id);
              if (found) matches.push(found);
            });
          }

          const mergedChecklist: LeadChecklist = {
            ...(currentChecklist || {}),
            ...(parsed.checklist_updates || {})
          };

          let lead: PropertySearchLead | undefined = undefined;
          if (mergedChecklist.clientPhone || parsed.is_complete_lead) {
            lead = {
              id: `lead-${Date.now()}`,
              clientName: mergedChecklist.clientName || 'Cliente BNG',
              clientPhone: mergedChecklist.clientPhone || mergedChecklist.clientWhatsapp || 'Não informado',
              clientWhatsapp: mergedChecklist.clientWhatsapp,
              propertyType: mergedChecklist.propertyType || 'Geral',
              transactionType: mergedChecklist.transactionType || 'qualquer',
              locationPreferred: mergedChecklist.locationPreferred || 'Moçambique',
              typologyOrDimensions: mergedChecklist.typologyOrDimensions || 'Geral',
              essentialFeatures: mergedChecklist.essentialFeatures || 'Padrão',
              budget: mergedChecklist.budget || 'A definir',
              urgencyDeadline: mergedChecklist.urgencyDeadline || 'Brevemente',
              additionalNotes: mergedChecklist.additionalNotes,
              source: 'ai_assistant_ajuda',
              status: 'novo',
              createdAt: new Date().toISOString()
            };
            saveStoredLead(lead);

            if (broadcastGlobalAnnouncement) {
              broadcastGlobalAnnouncement(
                `Nova Procura: ${lead.clientName} procura ${lead.propertyType} (${lead.transactionType.toUpperCase()}) em ${lead.locationPreferred} • Orçamento: ${lead.budget}`,
                'prioritaria',
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
      }
    } catch (e) {
      console.error('Falha ao comunicar com OpenAI:', e);
    }
  }

  return fallbackLocalAi(userPrompt, history, catalog, currentChecklist);
}

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
      text: `Encontrei ${matches.length} excelente${matches.length > 1 ? 's' : ''} opção(ões) no catálogo do Grupo BNG que se enquadram na sua procura. Pode clicar em qualquer uma abaixo para ver fotos e detalhes completos. Se preferir algo diferente, diga-me que farei o acompanhamento sob medida!`,
      suggestedListings: matches.slice(0, 3),
      checklist: Object.keys(merged).length > 0 ? merged : undefined
    };
  }

  return {
    text: `Compreendo perfeitamente! No Grupo BNG nós não ficamos limitados ao catálogo: a nossa equipa de corretores vai localizar ou mobilizar o imóvel exato para si.\n\nPara avançarmos com a sua ficha de procura prioritária: qual seria a tipologia (ex: T2, T3, T4) e características que não podem faltar (ex: piscina, garagem, segurança)?`,
    suggestedListings: [],
    checklist: Object.keys(merged).length > 0 ? merged : undefined
  };
}
