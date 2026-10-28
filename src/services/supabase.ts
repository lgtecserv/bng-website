import { createClient } from '@supabase/supabase-js';
import { Listing, ListingPhoto, Category, Banner, PlatformConfig, ListingFeePayment, ListingStatus, PaymentStatus, ListingFilters } from '../types';
import { INITIAL_LISTINGS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_CONFIG } from '../data/mockData';
import { triggerAppNotification, AppNotification } from './notifications';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('exemplo-seu-projeto') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : supabase;

export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem('bng_device_uuid');
    if (!id) {
      id = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('bng_device_uuid', id);
    }
    return id;
  } catch {
    return 'dev-unknown';
  }
}

// ==========================================
// SUPABASE STORAGE UPLOADS
// ==========================================
// SUPABASE STORAGE UPLOADS
// ==========================================
export async function uploadToStorage(
  file: File, 
  bucket: 'listing-photos' | 'payment-proofs' | 'banners' = 'listing-photos'
): Promise<string> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    // Fallback: Data URL local se Supabase não estiver disponível
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = `${fileName}`;

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, { 
      cacheControl: '3600', 
      upsert: false,
      contentType: file.type || 'image/jpeg'
    });

  if (error) {
    console.warn(`Erro no upload para ${bucket}, usando fallback local:`, error.message);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  if (bucket === 'payment-proofs') {
    // Bucket privado: cria URL assinada válida por 7 dias para visualização segura
    const { data: signed } = await client.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);
    return signed?.signedUrl || filePath;
  }

  // Bucket público
  const { data: publicUrl } = client.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl?.publicUrl || filePath;
}

// ==========================================
// PERSISTÊNCIA INTEGRADA (LocalStorage / Store)
// ==========================================
const STORAGE_KEYS = {
  LISTINGS: 'bng_listings_v1',
  CATEGORIES: 'bng_categories_v1',
  BANNERS: 'bng_banners_v1',
  CONFIG: 'bng_config_v1',
  FAVORITES: 'bng_favorites_v1',
};

function getLocalData<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

// Inicializar armazenamento se vazio
export function initializeStorage(): void {
  if (!isSupabaseConfigured) {
    getLocalData(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  }
  getLocalData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  getLocalData(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  getLocalData(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
}

// ==========================================
// ALGORITMO DE ROTAÇÃO INTELIGENTE (Item 7 PRD)
// ==========================================
export function applySmartRotation(listings: Listing[], userSessionSeed: number): Listing[] {
  // A rotação só se aplica a anúncios 'published'
  // Calcula score = (Recência) + (Fator de Baixas Impressões) + (Destaque) + Variação da Sessão
  return [...listings].sort((a, b) => {
    // Preserva destaques prioritariamente, mas rotaciona internamente
    const aFeatured = a.isFeatured ? 50 : 0;
    const bFeatured = b.isFeatured ? 50 : 0;

    // Fator de justiça de exposição (anúncios elegíveis com menos impressões ganham relevância)
    const aImpFactor = 100 / (1 + (a.impressionsCount || 0) * 0.05);
    const bImpFactor = 100 / (1 + (b.impressionsCount || 0) * 0.05);

    // Hash pseudo-randômico derivado do ID e da sessão para evitar repetição constante no mesmo dia
    const hashA = Math.sin(a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), userSessionSeed)) * 20;
    const hashB = Math.sin(b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), userSessionSeed)) * 20;

    const scoreA = aFeatured + aImpFactor + hashA;
    const scoreB = bFeatured + bImpFactor + hashB;

    return scoreB - scoreA;
  });
}

// Funções auxiliares de mapeamento entre Supabase e modelos TypeScript
function mapDbToListing(row: any): Listing {
  let photosList: ListingPhoto[] = [];
  if (Array.isArray(row.listing_photos) && row.listing_photos.length > 0) {
    photosList = row.listing_photos
      .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((p: any, index: number) => ({
        id: p.id || `p-${index}`,
        url: p.url,
        isCover: Boolean(p.is_cover || index === 0),
        displayOrder: p.display_order ?? index
      }));
  } else if (Array.isArray(row.photos)) {
    photosList = row.photos.map((url: string, index: number) => ({
      id: `p-${index}`,
      url,
      isCover: index === 0,
      displayOrder: index
    }));
  }

  return {
    id: row.id,
    userId: row.user_id || 'user-unknown',
    authorName: row.author_name || row.advertiser_name || 'Anunciante Grupo BNG',
    authorPhone: row.author_phone || row.advertiser_phone || '+258 84 152 4822',
    authorWhatsapp: row.author_whatsapp || row.advertiser_whatsapp || row.author_phone || '+258 88 009 6995',
    title: row.title,
    description: row.description,
    categoryId: row.category_id || (row.category_name ? row.category_name.toLowerCase() : 'cat-casas'),
    categoryName: row.category_name || 'Casas',
    transactionType: row.transaction_type || 'sale',
    price: Number(row.price),
    currency: 'MT',
    province: row.province,
    district: row.district,
    neighborhood: row.neighborhood || '',
    addressReference: row.address_reference,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    suites: row.suites,
    areaM2: row.area_m2 ? Number(row.area_m2) : undefined,
    parkingSpaces: row.parking_spaces,
    hasWaterAndLight: row.has_water_and_light ?? true,
    hasAirConditioning: row.has_air_conditioning ?? false,
    hasPool: row.has_pool ?? false,
    hasSecurity: row.has_security ?? false,
    conditionState: row.condition_state,
    declaredDocumentation: row.declared_documentation,
    vehicleBrand: row.vehicle_brand,
    vehicleModel: row.vehicle_model,
    vehicleYear: row.vehicle_year,
    vehicleMileage: row.vehicle_mileage,
    vehicleFuel: row.vehicle_fuel,
    vehicleTransmission: row.vehicle_transmission,
    rejectionReason: row.rejection_reason,
    correctionMessage: row.correction_message,
    submittedAt: row.submitted_at,
    publishedAt: row.published_at,
    photos: photosList,
    paymentConditions: {
      planType: row.payment_plan_type || 'full',
      downPaymentPercentage: row.down_payment_percentage,
      downPaymentAmount: row.down_payment_amount,
      installmentsCount: row.installments_count,
      installmentAmount: row.installment_amount,
      installmentFrequency: row.installment_frequency,
      additionalNotes: row.payment_notes
    },
    feePayment: {
      id: `fee-${row.id}`,
      listingId: row.id,
      userId: row.user_id || 'user-unknown',
      amountExpected: 150,
      paymentMethod: row.fee_payment_method || 'm_pesa',
      status: row.fee_payment_status || 'not_started'
    },
    status: row.status || 'published',
    isFeatured: Boolean(row.is_featured),
    isSold: Boolean(row.is_sold || row.status === 'completed'),
    impressionsCount: row.impressions_count || 0,
    viewsCount: row.views_count || 0,
    contactClicksCount: row.contact_clicks_count || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

function mapListingToDb(listing: any): any {
  return {
    title: listing.title,
    description: listing.description,
    category_id: listing.categoryId || null,
    category_name: listing.categoryName || 'Casas',
    transaction_type: listing.transactionType || 'sale',
    price: listing.price,
    currency: 'MT',
    province: listing.province,
    district: listing.district,
    neighborhood: listing.neighborhood || '',
    address_reference: listing.addressReference || null,
    bedrooms: listing.bedrooms || null,
    bathrooms: listing.bathrooms || null,
    suites: listing.suites || null,
    area_m2: listing.areaM2 || null,
    parking_spaces: listing.parkingSpaces || null,
    has_water_and_light: Boolean(listing.hasWaterAndLight),
    has_air_conditioning: Boolean(listing.hasAirConditioning),
    has_pool: Boolean(listing.hasPool),
    has_security: Boolean(listing.hasSecurity),
    condition_state: listing.conditionState || null,
    declared_documentation: listing.declaredDocumentation || null,
    vehicle_brand: listing.vehicleBrand || null,
    vehicle_model: listing.vehicleModel || null,
    vehicle_year: listing.vehicleYear || null,
    vehicle_mileage: listing.vehicleMileage || null,
    vehicle_fuel: listing.vehicleFuel || null,
    vehicle_transmission: listing.vehicleTransmission || null,
    author_name: listing.authorName || 'Grupo BNG Imobiliária',
    author_phone: listing.authorPhone || '+258 84 152 4822',
    author_whatsapp: listing.authorWhatsapp || '+258 88 009 6995',
    status: listing.isSold ? 'completed' : (listing.status || 'published'),
    is_featured: Boolean(listing.isFeatured),
    rejection_reason: listing.rejectionReason || null,
    correction_message: listing.correctionMessage || null,
    submitted_at: listing.submittedAt || null,
    published_at: listing.publishedAt || null,
    views_count: listing.viewsCount || 0,
    contact_clicks_count: listing.contactClicksCount || 0,
    updated_at: new Date().toISOString()
  };
}

// ==========================================
// SERVIÇOS DE ANÚNCIOS
// ==========================================

export async function fetchListings(
  filters?: ListingFilters, 
  sortOption: 'smart' | 'recent' | 'price_asc' | 'price_desc' | 'featured' = 'smart',
  sessionSeed: number = 42
): Promise<Listing[]> {
  // 1. Sincronizar diretamente da nuvem Supabase
  if (supabase) {
    try {
      let q = supabase.from('listings').select('*, listing_photos(*)');
      if (filters?.status) {
        q = q.eq('status', filters.status);
      } else if (!filters?.userId) {
        // Na busca pública, inclui anúncios ativos e vendidos (selo de credibilidade)
        q = q.in('status', ['published', 'completed']);
      }
      if (filters?.transactionType) q = q.eq('transaction_type', filters.transactionType);
      if (filters?.province) q = q.ilike('province', `%${filters.province}%`);
      if (filters?.district) q = q.ilike('district', `%${filters.district}%`);
      if (filters?.minPrice) q = q.gte('price', filters.minPrice);
      if (filters?.maxPrice) q = q.lte('price', filters.maxPrice);

      const { data, error } = await q;
      if (!error && Array.isArray(data)) {
        const cloudListings = data.map(mapDbToListing);
        // A nuvem Supabase é a Fonte da Verdade definitiva: substitui o cache local sem ressuscitar mock data
        setLocalData(STORAGE_KEYS.LISTINGS, cloudListings);
      }
    } catch (e) {
      console.warn('Aviso: Operando com cache local enquanto o banco sincroniza:', e);
    }
  }

  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  
  let filtered = allListings.filter(item => {
    if (!filters?.status && !filters?.userId) {
      const isPubliclyVisible = item.status === 'published' || item.status === 'completed' || Boolean(item.isSold);
      if (!isPubliclyVisible) return false;
    }
    if (filters?.status && item.status !== filters.status) return false;
    if (filters?.categoryId) {
      const target = filters.categoryId.toLowerCase();
      const matchCat = 
        item.categoryId?.toLowerCase() === target ||
        item.categoryName?.toLowerCase() === target ||
        (target.includes('terreno') && item.categoryName?.toLowerCase().includes('terreno')) ||
        (target.includes('casa') && item.categoryName?.toLowerCase().includes('casa')) ||
        (target.includes('apartamento') && item.categoryName?.toLowerCase().includes('apartamento')) ||
        (target.includes('viatura') && item.categoryName?.toLowerCase().includes('viatura')) ||
        (target.includes('escritorio') && item.categoryName?.toLowerCase().includes('escritório')) ||
        (target.includes('comercia') && item.categoryName?.toLowerCase().includes('comercia')) ||
        (target.includes('armazem') && item.categoryName?.toLowerCase().includes('armazém'));
      if (!matchCat) return false;
    }
    if (filters?.province && item.province !== filters.province) return false;
    if (filters?.district && item.district !== filters.district) return false;
    if (filters?.transactionType && item.transactionType !== filters.transactionType) return false;
    if (filters?.minPrice && item.price < filters.minPrice) return false;
    if (filters?.maxPrice && item.price > filters.maxPrice) return false;
    if (filters?.bedrooms && (item.bedrooms || 0) < filters.bedrooms) return false;
    if (filters?.planType && item.paymentConditions.planType !== filters.planType) return false;
    
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = `${item.province} ${item.district} ${item.neighborhood || ''}`.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    return true;
  });

  if (sortOption === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortOption === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'featured') {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } else {
    filtered = applySmartRotation(filtered, sessionSeed);
  }

  return filtered;
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  let found = allListings.find(l => l.id === id);
  if (!found && supabase) {
    try {
      const { data } = await supabase.from('listings').select('*, listing_photos(*)').eq('id', id).single();
      if (data) {
        found = mapDbToListing(data);
        allListings.push(found);
      }
    } catch {}
  }
  if (found) {
    found.viewsCount = (found.viewsCount || 0) + 1;
    setLocalData(STORAGE_KEYS.LISTINGS, allListings);
    return { ...found };
  }
  return null;
}

export async function createListing(listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'impressionsCount' | 'viewsCount' | 'contactClicksCount'>): Promise<Listing> {
  const now = new Date().toISOString();
  let generatedId = `bng-${Date.now().toString().slice(-6)}`;
  
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const dbRow = mapListingToDb(listingData);
      const { data: inserted, error: insErr } = await client.from('listings').insert([dbRow]).select();
      if (!insErr && inserted && inserted[0]) {
        generatedId = inserted[0].id;
        if (listingData.photos && listingData.photos.length > 0) {
          const photosToInsert = listingData.photos.map((p, idx) => ({
            listing_id: generatedId,
            url: p.url,
            is_cover: Boolean(p.isCover || idx === 0),
            display_order: idx
          }));
          await client.from('listing_photos').insert(photosToInsert);
        }
      } else if (insErr) {
        console.warn('Erro ao inserir anúncio no Supabase:', insErr);
      }
    } catch (err) {
      console.warn('Persistido localmente enquanto sincroniza na nuvem:', err);
    }
  }

  const newListing: Listing = {
    ...listingData,
    id: generatedId,
    impressionsCount: 0,
    viewsCount: 0,
    contactClicksCount: 0,
    createdAt: now,
    updatedAt: now,
    submittedAt: listingData.status === 'submitted' ? now : undefined
  };

  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const filtered = allListings.filter(l => l.id !== generatedId);
  filtered.unshift(newListing);
  setLocalData(STORAGE_KEYS.LISTINGS, filtered);

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));

  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}

  return newListing;
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const index = allListings.findIndex(l => l.id === id);
  const now = new Date().toISOString();

  let updated: Listing;
  if (index !== -1) {
    updated = {
      ...allListings[index],
      ...updates,
      updatedAt: now
    };
    allListings[index] = updated;
  } else {
    updated = {
      ...updates,
      id,
      updatedAt: now
    } as Listing;
    allListings.push(updated);
  }
  setLocalData(STORAGE_KEYS.LISTINGS, allListings);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const dbRow = mapListingToDb(updated);
      await client.from('listings').update(dbRow).eq('id', id);
    } catch (err) {
      console.warn('Erro ao atualizar anúncio no Supabase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));

  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}

  return updated;
}

export async function deleteListing(id: string): Promise<void> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const filtered = allListings.filter(l => l.id !== id);
  setLocalData(STORAGE_KEYS.LISTINGS, filtered);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('listing_photos').delete().eq('listing_id', id);
      await client.from('listings').delete().eq('id', id);
    } catch (err) {
      console.warn('Erro ao remover anúncio do Supabase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));

  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}
}

export async function toggleListingSold(id: string, isSold: boolean): Promise<Listing> {
  return updateListing(id, { 
    isSold,
    status: isSold ? 'completed' : 'published'
  });
}

export async function updateListingStatus(
  id: string, 
  status: ListingStatus, 
  notes?: { rejectionReason?: string; correctionMessage?: string }
): Promise<Listing> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const index = allListings.findIndex(l => l.id === id);
  const now = new Date().toISOString();

  let updated: Listing;
  if (index !== -1) {
    const current = allListings[index];
    updated = {
      ...current,
      status,
      rejectionReason: notes?.rejectionReason,
      correctionMessage: notes?.correctionMessage,
      publishedAt: status === 'published' ? (current.publishedAt || now) : current.publishedAt,
      updatedAt: now
    };
    allListings[index] = updated;
  } else {
    updated = {
      id,
      status,
      rejectionReason: notes?.rejectionReason,
      correctionMessage: notes?.correctionMessage,
      publishedAt: status === 'published' ? now : undefined,
      updatedAt: now
    } as any;
    allListings.push(updated);
  }
  setLocalData(STORAGE_KEYS.LISTINGS, allListings);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('listings').update({
        status,
        rejection_reason: notes?.rejectionReason || null,
        correction_message: notes?.correctionMessage || null,
        published_at: status === 'published' ? now : null,
        updated_at: now
      }).eq('id', id);
    } catch (err) {
      console.warn('Erro ao atualizar status do anúncio no Supabase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));
  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}

  return updated;
}

export async function submitPaymentProof(
  listingId: string, 
  payment: Partial<ListingFeePayment>
): Promise<Listing> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const index = allListings.findIndex(l => l.id === listingId);
  const now = new Date().toISOString();

  const current = index !== -1 ? allListings[index] : ({} as Listing);
  const updatedFeePayment: ListingFeePayment = {
    ...current.feePayment,
    ...payment,
    listingId,
    amountExpected: current.feePayment?.amountExpected || 150,
    status: 'proof_submitted',
    submittedAt: now
  };

  const updatedListing: Listing = {
    ...current,
    id: listingId,
    feePayment: updatedFeePayment,
    status: 'under_review',
    submittedAt: current.submittedAt || now,
    updatedAt: now
  };

  if (index !== -1) {
    allListings[index] = updatedListing;
  } else {
    allListings.push(updatedListing);
  }
  setLocalData(STORAGE_KEYS.LISTINGS, allListings);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('listings').update({
        fee_payment_method: payment.paymentMethod || 'm_pesa',
        fee_payment_status: 'proof_submitted',
        status: 'under_review',
        submitted_at: now,
        updated_at: now
      }).eq('id', listingId);
    } catch (err) {
      console.warn('Erro ao submeter comprovativo no Supabase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));
  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}

  return updatedListing;
}

export async function verifyPayment(
  listingId: string, 
  status: PaymentStatus, 
  adminNotes?: string
): Promise<Listing> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const index = allListings.findIndex(l => l.id === listingId);
  const now = new Date().toISOString();

  const current = index !== -1 ? allListings[index] : ({} as Listing);
  const updatedFeePayment: ListingFeePayment = {
    ...current.feePayment,
    status,
    adminNotes,
    verifiedAt: now,
    verifiedBy: 'user-admin'
  };

  const updatedListing: Listing = {
    ...current,
    id: listingId,
    feePayment: updatedFeePayment,
    updatedAt: now
  };

  if (index !== -1) {
    allListings[index] = updatedListing;
  } else {
    allListings.push(updatedListing);
  }
  setLocalData(STORAGE_KEYS.LISTINGS, allListings);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('listings').update({
        fee_payment_status: status,
        updated_at: now
      }).eq('id', listingId);
    } catch (err) {
      console.warn('Erro ao verificar pagamento no Supabase:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('bng_listings_updated'));
  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) ch.send({ type: 'broadcast', event: 'listings_changed', payload: {} });
  } catch {}

  return updatedListing;
}

export async function recordContactClick(listingId: string): Promise<void> {
  const allListings = getLocalData<Listing[]>(STORAGE_KEYS.LISTINGS, []);
  const target = allListings.find(l => l.id === listingId);
  if (target) {
    target.contactClicksCount = (target.contactClicksCount || 0) + 1;
    setLocalData(STORAGE_KEYS.LISTINGS, allListings);
  }

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const currentClicks = target ? target.contactClicksCount : 1;
      await client.from('listings').update({
        contact_clicks_count: currentClicks
      }).eq('id', listingId);
    } catch (err) {}
  }
}

// ==========================================
// FAVORITOS
// ==========================================
export function getFavorites(): string[] {
  return getLocalData<string[]>(STORAGE_KEYS.FAVORITES, []);
}

export function toggleFavorite(listingId: string): boolean {
  const favs = getFavorites();
  const exists = favs.includes(listingId);
  const updated = exists ? favs.filter(id => id !== listingId) : [...favs, listingId];
  setLocalData(STORAGE_KEYS.FAVORITES, updated);
  return !exists;
}

// ==========================================
// CATEGORIAS, BANNERS E CONFIG
// ==========================================
export async function fetchCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: Category[] = data.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          icon: c.icon || 'home',
          displayOrder: c.display_order,
          isActive: Boolean(c.is_active),
          count: 0
        }));
        setLocalData(STORAGE_KEYS.CATEGORIES, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Erro ao carregar categorias do Supabase:', e);
    }
  }
  return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  setLocalData(STORAGE_KEYS.CATEGORIES, categories);
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const rows = categories.map(c => ({
        id: c.id.includes('-') && c.id.length > 30 ? c.id : undefined,
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        display_order: c.displayOrder,
        is_active: c.isActive
      }));
      await client.from('categories').upsert(rows);
    } catch (err) {
      console.warn('Erro ao salvar categorias no Supabase:', err);
    }
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: Banner[] = data.map((b: any) => ({
          id: b.id,
          title: b.title,
          shortText: b.short_text || '',
          ctaText: b.cta_text || 'Explorar',
          linkUrl: b.link_url || '/pesquisa',
          mobileImageUrl: b.mobile_image_url || '',
          desktopImageUrl: b.desktop_image_url || b.mobile_image_url || '',
          startDate: b.start_date ? b.start_date.split('T')[0] : '2026-01-01',
          endDate: b.end_date ? b.end_date.split('T')[0] : '2026-12-31',
          isActive: Boolean(b.is_active),
          priority: b.priority || 1,
          impressionsCount: b.impressions_count || 0,
          clicksCount: b.clicks_count || 0
        }));
        setLocalData(STORAGE_KEYS.BANNERS, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Erro ao carregar banners do Supabase:', e);
    }
  }
  return getLocalData<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
}

export async function saveBanners(banners: Banner[]): Promise<void> {
  setLocalData(STORAGE_KEYS.BANNERS, banners);
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const rows = banners.map(b => ({
        id: b.id.includes('-') && b.id.length > 30 ? b.id : undefined,
        title: b.title,
        short_text: b.shortText || null,
        cta_text: b.ctaText || 'Explorar',
        link_url: b.linkUrl || '/pesquisa',
        mobile_image_url: b.mobileImageUrl,
        desktop_image_url: b.desktopImageUrl || b.mobileImageUrl,
        is_active: Boolean(b.isActive),
        priority: b.priority || 1
      }));
      await client.from('banners').upsert(rows);
    } catch (err) {
      console.warn('Erro ao salvar banners no Supabase:', err);
    }
  }
}

export async function fetchPlatformConfig(): Promise<PlatformConfig> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'general_config')
        .single();

      if (!error && data?.value) {
        const cloudConfig = data.value as PlatformConfig;
        const merged = { ...INITIAL_CONFIG, ...cloudConfig };
        setLocalData(STORAGE_KEYS.CONFIG, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Operando com configuração local enquanto sincroniza com a nuvem:', e);
    }
  }
  return getLocalData<PlatformConfig>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
}

export async function savePlatformConfig(config: PlatformConfig): Promise<void> {
  setLocalData(STORAGE_KEYS.CONFIG, config);

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('platform_settings').upsert({
        key: 'general_config',
        value: config,
        updated_at: new Date().toISOString()
      });
      // Notifica todos os ouvintes locais
      window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
    } catch (err) {
      console.warn('Erro ao salvar configurações no Supabase:', err);
    }
  }
}

// ==========================================
// BROADCAST GLOBAL EM TEMPO REAL (Notificações Nativas Multi-Dispositivo)
// ==========================================
export interface GlobalBroadcastMessage {
  id: string;
  title: string;
  body: string;
  type: AppNotification['type'];
  timestamp: string;
  senderDeviceId: string;
  actionScreen?: string;
  actionId?: string;
  isUpdate?: boolean;
}

let globalBroadcastChannel: any = null;

export function getGlobalBroadcastChannel() {
  if (!supabase) return null;
  if (!globalBroadcastChannel) {
    globalBroadcastChannel = supabase.channel('bng-broadcast-bus');
    globalBroadcastChannel.subscribe();
  }
  return globalBroadcastChannel;
}

/**
 * Transmite um alerta/anúncio para TODOS os utilizadores em tempo real.
 * 1. Notifica via WebSockets Supabase Realtime instantaneamente todos os telemóveis ativos.
 * 2. Persiste na tabela platform_settings para novos acessos e dispositivos offline.
 * 3. Dispara no próprio dispositivo (som, vibração, notificação na barra do sistema e histórico).
 */
export async function broadcastGlobalAnnouncement(
  title: string,
  body: string,
  type: AppNotification['type'] = 'system',
  actionScreen?: string,
  actionId?: string,
  isUpdate: boolean = false
): Promise<void> {
  const senderDeviceId = getOrCreateDeviceId();
  const announcementId = `ann-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload: GlobalBroadcastMessage = {
    id: announcementId,
    title,
    body,
    type,
    timestamp: new Date().toISOString(),
    senderDeviceId,
    actionScreen,
    actionId,
    isUpdate
  };

  // 1. Marca imediatamente como visto neste dispositivo para evitar duplicações
  try {
    localStorage.setItem(`bng_seen_ann_${announcementId}`, 'true');
    if ((window as any).AndroidBridge?.markAnnouncementSeen) {
      (window as any).AndroidBridge.markAnnouncementSeen(announcementId);
    }
  } catch {}

  // 2. Dispara localmente neste telemóvel/dispositivo
  triggerAppNotification(title, body, type, actionScreen, actionId);

  // 3. Emite via WebSockets Supabase Realtime Broadcast para todos os telemóveis conectados
  try {
    const ch = getGlobalBroadcastChannel();
    if (ch) {
      await ch.send({
        type: 'broadcast',
        event: 'new_announcement',
        payload
      });
    }
  } catch (wsErr) {
    console.warn('Aviso ao emitir broadcast:', wsErr);
  }

  // 4. Salva no banco de dados na nuvem para persistência permanente (supabaseAdmin)
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      await client.from('platform_settings').upsert({
        key: 'bng_live_announcements',
        value: {
          latest: payload,
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('Aviso ao persistir anúncio global no Supabase:', dbErr);
    }
  }
}

/**
 * Consulta o último anúncio global registrado no Supabase
 */
export async function fetchLatestGlobalAnnouncement(): Promise<GlobalBroadcastMessage | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'bng_live_announcements')
      .single();

    if (!error && data?.value?.latest) {
      return data.value.latest as GlobalBroadcastMessage;
    }
  } catch (err) {
    console.warn('Erro ao consultar anúncio global:', err);
  }
  return null;
}

