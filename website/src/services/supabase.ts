import { createClient } from '@supabase/supabase-js';
import { Listing, ListingPhoto, Category, Banner, UserProfile, ListingFilters } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohfxjwotkgllccdiismc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UeM95RFADZ96gx94HfgydQ_7xjH4HKY';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : supabase;

// Mapeamento de dados entre banco Supabase e aplicação
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
  }

  return {
    id: row.id,
    userId: row.user_id || 'user-unknown',
    authorName: row.author_name || 'Grupo BNG Imobiliária',
    authorPhone: row.author_phone || '+258 84 152 4822',
    authorWhatsapp: row.author_whatsapp || '+258 88 009 6995',
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
    photos: photosList,
    // Atributos de Condomínios Residenciais
    condoCommercialModel: row.condo_commercial_model || (
      row.description?.includes('Modalidade: Venda do Condomínio Todo') ? 'venda_todo' :
      row.description?.includes('Modalidade: Arrendamento') ? 'arrendamento_casas' :
      row.description?.includes('Modalidade: Venda e Arrendamento') ? 'venda_e_arrendamento' :
      row.description?.includes('Modalidade:') ? 'venda_fraccoes' : undefined
    ),
    condoTotalAreaM2: row.condo_total_area_m2 || (
      row.description?.match(/Área Total do Condomínio:\s*(\d+)/i) ? Number(row.description.match(/Área Total do Condomínio:\s*(\d+)/i)[1]) : undefined
    ),
    condoTotalHouses: row.condo_total_houses || (
      row.description?.match(/Total de Casas:\s*(\d+)/i) ? Number(row.description.match(/Total de Casas:\s*(\d+)/i)[1]) : (
        row.title?.match(/(\d+)\s*CASAS/i) ? Number(row.title.match(/(\d+)\s*CASAS/i)[1]) : undefined
      )
    ),
    condoAvailableHouses: row.condo_available_houses || (
      row.description?.match(/Casas Disponíveis:\s*(\d+)/i) ? Number(row.description.match(/Casas Disponíveis:\s*(\d+)/i)[1]) : undefined
    ),
    condoConstructionStatus: row.condo_construction_status || (
      row.description?.includes('Estado: Pronto a Habitar') ? 'pronto_habitar' :
      row.description?.includes('Estado: Em Obras') ? 'em_obra' :
      row.description?.includes('Estado: Em Projeto') ? 'em_projeto' : undefined
    ),
    condoHasSecurity: row.condo_has_security ?? (
      row.description?.includes('Segurança: Sim') || row.has_security
    ),
    condoSecurityDetails: row.condo_security_details || (
      row.description?.match(/Segurança Detalhes:\s*([^\n\r]+)/i)?.[1]?.trim()
    ),
    condoLocationReference: row.condo_location_reference || (
      row.description?.match(/Localização do Condomínio:\s*([^\n\r]+)/i)?.[1]?.trim()
    ),
    condoHouseTypology: row.condo_house_typology || (
      row.description?.match(/Tipologia das Casas:\s*([^\n\r]+)/i)?.[1]?.trim() || (
        row.title?.match(/T[1-5]/i)?.[0]?.toUpperCase()
      )
    ),
    condoHasCommonPool: row.condo_has_common_pool ?? row.description?.includes('Piscina Comum'),
    condoHasPlayground: row.condo_has_playground ?? row.description?.includes('Parque Infantil'),
    condoHasGeneratorOrBorehole: row.condo_has_generator_or_borehole ?? (row.description?.includes('Gerador') || row.description?.includes('Furo de Água')),
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

export async function recordListingView(listingId: string): Promise<number> {
  const client = supabaseAdmin || supabase;
  let newViews = 1;
  try {
    const { data } = await client
      .from('listings')
      .select('views_count')
      .eq('id', listingId)
      .single();
    if (data && typeof data.views_count === 'number') {
      newViews = data.views_count + 1;
    }
    await client
      .from('listings')
      .update({ views_count: newViews })
      .eq('id', listingId);
  } catch (err) {
    console.warn('Erro ao atualizar views_count:', err);
  }
  return newViews;
}

// Buscar Imóveis da Nuvem
export async function fetchWebsiteListings(filters?: ListingFilters): Promise<Listing[]> {
  try {
    let q = supabase
      .from('listings')
      .select('*, listing_photos(*)')
      .in('status', ['published', 'completed'])
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.transactionType) q = q.eq('transaction_type', filters.transactionType);
    if (filters?.province) q = q.ilike('province', `%${filters.province}%`);
    if (filters?.district) q = q.ilike('district', `%${filters.district}%`);
    if (filters?.minPrice) q = q.gte('price', filters.minPrice);
    if (filters?.maxPrice) q = q.lte('price', filters.maxPrice);

    const { data, error } = await q;
    if (error) {
      console.warn('Erro ao consultar listings no Supabase:', error);
      return [];
    }

    let listings = (data || []).map(mapDbToListing);

    // Filtros em memória (para busca por texto e categoria resiliente)
    if (filters?.categoryId && filters.categoryId !== 'all') {
      const target = filters.categoryId.toLowerCase();
      listings = listings.filter(item => {
        return (
          item.categoryId?.toLowerCase() === target ||
          item.categoryName?.toLowerCase() === target ||
          (target.includes('terreno') && item.categoryName?.toLowerCase().includes('terreno')) ||
          (target.includes('casa') && item.categoryName?.toLowerCase().includes('casa')) ||
          (target.includes('apartamento') && item.categoryName?.toLowerCase().includes('apartamento')) ||
          (target.includes('viatura') && item.categoryName?.toLowerCase().includes('viatura')) ||
          (target.includes('escritorio') && item.categoryName?.toLowerCase().includes('escritório')) ||
          (target.includes('comercia') && item.categoryName?.toLowerCase().includes('comercia')) ||
          (target.includes('armazem') && item.categoryName?.toLowerCase().includes('armazém'))
        );
      });
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        `${l.province} ${l.district} ${l.neighborhood || ''}`.toLowerCase().includes(query)
      );
    }

    return listings;
  } catch (err) {
    console.error('Falha geral ao carregar imóveis:', err);
    return [];
  }
}

// Buscar Categorias Oficiais
export async function fetchWebsiteCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        icon: c.icon || 'home',
        displayOrder: c.display_order,
        isActive: Boolean(c.is_active),
        count: 0
      }));
    }
  } catch (e) {
    console.warn('Erro ao buscar categorias:', e);
  }
  return [
    { id: '688ce998-5398-4176-b62e-1248676e86e5', slug: 'casas-vivendas', name: 'Casas e Vivendas', icon: 'home', displayOrder: 1, isActive: true, count: 0 },
    { id: 'b237199c-a8a4-4a82-b77c-7006d300b0fa', slug: 'apartamentos-flats', name: 'Apartamentos e Flats', icon: 'apartment', displayOrder: 2, isActive: true, count: 0 },
    { id: 'b9d6d6ee-bc70-4197-95e1-43568854f5bc', slug: 'condominios', name: 'Condomínios Residenciais', icon: 'holiday_village', displayOrder: 3, isActive: true, count: 0 },
    { id: 'f37eaa8d-8b7c-44b3-8f3b-71693012718c', slug: 'terrenos', name: 'Terrenos', icon: 'landscape', displayOrder: 4, isActive: true, count: 0 },
    { id: '751d810a-94ba-4a8c-ba56-dcbecda6d0e8', slug: 'escritorios', name: 'Escritórios', icon: 'domain', displayOrder: 5, isActive: true, count: 0 },
    { id: 'ad451530-c603-40c5-ac14-46c61df61845', slug: 'lojas-salas-comerciais', name: 'Lojas e Salas Comerciais', icon: 'storefront', displayOrder: 6, isActive: true, count: 0 },
    { id: 'c4ecf6ad-0e62-4e5a-98d3-15d2ddbe06a3', slug: 'armazens-galpoes', name: 'Armazéns e Galpões', icon: 'warehouse', displayOrder: 7, isActive: true, count: 0 },
    { id: 'saloes-eventos-id', slug: 'saloes-eventos', name: 'Salões de Eventos', icon: 'celebration', displayOrder: 8, isActive: true, count: 0 },
    { id: 'contentores-modulares-id', slug: 'contentores-modulares', name: 'Contentores e Estruturas Modulares', icon: 'view_in_ar', displayOrder: 9, isActive: true, count: 0 },
    { id: 'ccf09372-0523-44e8-9b82-307d3cbf8da5', slug: 'carros-maquinas', name: 'Carros e Máquinas', icon: 'directions_car', displayOrder: 10, isActive: true, count: 0 },
  ];
}

// Upload de fotos para o Supabase Storage
export async function uploadWebsitePhoto(file: File): Promise<string> {
  const client = supabaseAdmin || supabase;
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `web-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const { error } = await client.storage
    .from('listing-photos')
    .upload(fileName, file, { 
      cacheControl: '3600', 
      upsert: false,
      contentType: file.type || 'image/jpeg'
    });

  if (error) {
    console.warn('Erro ao fazer upload no storage:', error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const { data: publicUrl } = client.storage
    .from('listing-photos')
    .getPublicUrl(fileName);

  return publicUrl?.publicUrl || fileName;
}

// Criar Anúncio no Supabase a partir do Website
export async function createWebsiteListing(listingData: any): Promise<string> {
  const client = supabaseAdmin || supabase;
  const now = new Date().toISOString();

  const dbRow = {
    title: listingData.title,
    description: listingData.description,
    category_id: listingData.categoryId || null,
    category_name: listingData.categoryName || 'Casas',
    transaction_type: listingData.transactionType || 'sale',
    price: Number(listingData.price),
    currency: 'MT',
    province: listingData.province,
    district: listingData.district,
    neighborhood: listingData.neighborhood || '',
    address_reference: listingData.addressReference || null,
    bedrooms: listingData.bedrooms || null,
    bathrooms: listingData.bathrooms || null,
    suites: listingData.suites || null,
    area_m2: listingData.areaM2 || null,
    parking_spaces: listingData.parkingSpaces || null,
    has_water_and_light: Boolean(listingData.hasWaterAndLight),
    has_air_conditioning: Boolean(listingData.hasAirConditioning),
    has_pool: Boolean(listingData.hasPool),
    has_security: Boolean(listingData.hasSecurity),
    condition_state: listingData.conditionState || null,
    declared_documentation: listingData.declaredDocumentation || null,
    author_name: listingData.authorName || 'Anunciante Web',
    author_phone: listingData.authorPhone || '+258 84 152 4822',
    author_whatsapp: listingData.authorWhatsapp || '+258 88 009 6995',
    status: listingData.isAdmin ? 'published' : (listingData.status || 'published'),
    is_featured: Boolean(listingData.isAdmin || listingData.isFeatured),
    submitted_at: now,
    created_at: now,
    updated_at: now
  };

  const { data: inserted, error } = await client
    .from('listings')
    .insert([dbRow])
    .select();

  if (error || !inserted || !inserted[0]) {
    throw new Error(error?.message || 'Erro ao gravar anúncio no Supabase');
  }

  const newId = inserted[0].id;

  // Inserir fotos na tabela listing_photos
  if (Array.isArray(listingData.photos) && listingData.photos.length > 0) {
    const photosToInsert = listingData.photos.map((url: string, idx: number) => ({
      listing_id: newId,
      url,
      is_cover: idx === 0,
      display_order: idx
    }));

    await client.from('listing_photos').insert(photosToInsert);
  }

  // Notifica todos os telemóveis e admins em tempo real
  try {
    const channel = supabase.channel('bng-broadcast-bus');
    channel.send({
      type: 'broadcast',
      event: 'listings_changed',
      payload: { id: newId }
    });
  } catch {}

  return newId;
}

// Buscar Todos os Imóveis para o Painel Administrativo (sem filtros de status)
export async function fetchAllAdminListings(): Promise<Listing[]> {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('listings')
      .select('*, listing_photos(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao carregar anúncios admin:', error);
      return [];
    }

    return (data || []).map(mapDbToListing);
  } catch (err) {
    console.error('Erro ao consultar Supabase admin:', err);
    return [];
  }
}

// Eliminar Imóvel do Supabase
export async function deleteWebsiteListing(id: string): Promise<boolean> {
  try {
    const client = supabaseAdmin || supabase;
    
    // Primeiro elimina fotos associadas
    await client.from('listing_photos').delete().eq('listing_id', id);
    
    // Elimina o imóvel
    const { error } = await client.from('listings').delete().eq('id', id);
    if (error) throw error;

    // Notifica em tempo real
    try {
      const channel = supabase.channel('bng-broadcast-bus');
      channel.send({
        type: 'broadcast',
        event: 'listings_changed',
        payload: { deletedId: id }
      });
    } catch {}

    return true;
  } catch (err) {
    console.error('Erro ao eliminar anúncio:', err);
    throw err;
  }
}

// Atualizar Status do Imóvel (published, under_review, rejected, completed)
export async function updateWebsiteListingStatus(id: string, status: string): Promise<boolean> {
  try {
    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from('listings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    try {
      const channel = supabase.channel('bng-broadcast-bus');
      channel.send({
        type: 'broadcast',
        event: 'listings_changed',
        payload: { updatedId: id, status }
      });
    } catch {}

    return true;
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    throw err;
  }
}

export type WebsiteUser = UserProfile;

// Apenas estes e-mails oficiais rigorosamente definidos podem aceder como administrador
export const STRICT_ADMIN_EMAILS = [
  'lgtecserv@gmail.com',
  'grupobngoficial@gmail.com',
  'admin@grupobng.co.mz'
];

export function broadcastGlobalAnnouncement(
  message: string, 
  type: 'geral' | 'prioritaria' | 'aprovacao' = 'geral',
  targetAudience: 'all' | 'admin_only' | 'user_only' = 'all',
  targetUserId?: string
): void {
  try {
    const raw = localStorage.getItem('bng_announcements_v2');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: `ann-${Date.now()}`,
      message,
      type,
      targetAudience,
      targetUserId,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('bng_announcements_v2', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('bng_notifications_updated'));
  } catch {}
}

export function isUserAdmin(emailOrUser?: string | UserProfile | null): boolean {
  if (!emailOrUser) return false;
  const email = typeof emailOrUser === 'string' 
    ? emailOrUser.toLowerCase().trim() 
    : (emailOrUser.email || '').toLowerCase().trim();

  return STRICT_ADMIN_EMAILS.includes(email);
}

// Autenticação com proteção estrita de papéis: usuários comuns NUNCA recebem 'admin'
export function getSavedWebsiteUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('bng_web_user');
    if (raw) {
      const user: UserProfile = JSON.parse(raw);
      if (user && user.email) {
        // Se não for um dos e-mails da administração estrita, é SEMPRE utilizador normal
        const isAdmin = isUserAdmin(user.email);
        user.role = isAdmin ? 'admin' : 'advertiser';
        // Garante que o nome não fique como "Administrador" se for utilizador normal
        if (!isAdmin && (user.fullName?.toLowerCase().includes('administrador') || !user.fullName)) {
          user.fullName = user.email.split('@')[0];
        }
        return user;
      }
    }
  } catch {}
  return null;
}

export function saveWebsiteUser(user: UserProfile | null) {
  if (user && user.email) {
    const isAdmin = isUserAdmin(user.email);
    user.role = isAdmin ? 'admin' : 'advertiser';
    if (!isAdmin && (user.fullName?.toLowerCase().includes('administrador') || !user.fullName)) {
      user.fullName = user.email.split('@')[0];
    }
    localStorage.setItem('bng_web_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('bng_web_user');
  }
}

// Banners do Website e App
export async function fetchWebsiteBanners(): Promise<any[]> {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('banners')
      .select('*')
      .order('priority', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        title: b.title,
        shortText: b.short_text || '',
        ctaText: b.cta_text || 'Explorar Imóveis',
        linkUrl: b.link_url || 'imobiliario',
        mobileImageUrl: b.mobile_image_url || '',
        desktopImageUrl: b.desktop_image_url || b.mobile_image_url || '',
        isActive: Boolean(b.is_active),
        priority: b.priority || 1
      }));
    }
  } catch (e) {
    console.warn('Erro ao carregar banners:', e);
  }

  return [
    {
      id: 'b-1',
      title: 'Soluções Imobiliárias de Excelência',
      shortText: 'Compre, venda e arrende com a segurança e garantia do Grupo BNG em todo o país.',
      ctaText: 'Explorar Imóveis',
      linkUrl: 'imobiliario',
      desktopImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      priority: 1
    },
    {
      id: 'b-2',
      title: 'Gestão de Património e Condomínios',
      shortText: 'Transparência, assessoria jurídica e moderação oficial em Moçambique.',
      ctaText: 'Fale Connosco',
      linkUrl: 'contato',
      desktopImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      priority: 2
    }
  ];
}

export async function saveWebsiteBanners(banners: any[]): Promise<void> {
  const client = supabaseAdmin || supabase;
  if (!client) return;
  try {
    const rows = banners.map(b => ({
      id: b.id.includes('-') && b.id.length > 30 ? b.id : undefined,
      title: b.title,
      short_text: b.shortText || null,
      cta_text: b.ctaText || 'Explorar Imóveis',
      link_url: b.linkUrl || 'imobiliario',
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

// Configurações da Plataforma e Contas
export async function fetchWebsitePlatformConfig(): Promise<any> {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('platform_settings')
      .select('value')
      .eq('key', 'general_config')
      .single();

    if (!error && data?.value) {
      return data.value;
    }
  } catch {}

  return {
    listingFeeMt: 150,
    paymentChannels: [
      { id: 'ch-mpesa', name: 'M-Pesa Oficial Grupo BNG', accountNumber: '84 152 4822', accountHolder: 'Grupo BNG E.I', isEnabled: true },
      { id: 'ch-emola', name: 'e-Mola Oficial BNG', accountNumber: '86 525 2525', accountHolder: 'Grupo BNG E.I', isEnabled: true },
      { id: 'ch-bci', name: 'Conta BCI (Meticais)', accountNumber: '0008 0000 1234 5678 901', accountHolder: 'Grupo BNG & Investimentos Lda', isEnabled: true }
    ]
  };
}

export async function saveWebsitePlatformConfig(config: any): Promise<void> {
  const client = supabaseAdmin || supabase;
  if (!client) return;
  try {
    await client.from('platform_settings').upsert({
      key: 'general_config',
      value: config,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Erro ao salvar configurações da plataforma:', err);
  }
}
