export type UserRole = 'visitor' | 'advertiser' | 'admin';

export type ListingStatus = 
  | 'draft'               // Rascunho do anunciante
  | 'submitted'           // Submetido (aguardando comprovativo ou análise)
  | 'under_review'        // Em análise editorial pelo administrador
  | 'changes_requested'   // Correcções solicitadas ao anunciante
  | 'approved'            // Aprovado
  | 'published'           // Publicado no catálogo visível
  | 'suspended'           // Suspenso temporariamente
  | 'rejected'            // Rejeitado com justificativa
  | 'expired'             // Expirado pelo prazo
  | 'completed';          // Vendido / Arrendado

export type PaymentStatus = 
  | 'not_started'
  | 'instructions_viewed'
  | 'proof_submitted'
  | 'under_verification'
  | 'confirmed'
  | 'rejected'
  | 'resubmission_required';

export type TransactionType = 'sale' | 'rent' | 'lease';

export type PaymentPlanType = 'full' | 'installments' | 'special';

export interface PaymentConditions {
  planType: PaymentPlanType;
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  remainingBalance?: number;
  installmentsCount?: number;
  installmentFrequency?: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  installmentAmount?: number;
  firstInstallmentTrigger?: string;
  additionalNotes?: string;
}

export interface ListingPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isCover: boolean;
  displayOrder: number;
}

export interface ListingFeePayment {
  id: string;
  listingId: string;
  userId: string;
  amountExpected: number; // 150 MT
  amountDeclared?: number;
  paymentMethod: 'm_pesa' | 'e_mola' | 'bank_transfer';
  referenceCode?: string;
  proofFileUrl?: string;
  status: PaymentStatus;
  adminNotes?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface Listing {
  id: string;
  userId: string;
  authorName: string;
  authorPhone: string;
  authorWhatsapp: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  transactionType: TransactionType;
  price: number;
  currency: 'MT';
  
  // Localização em Moçambique
  province: string;
  district: string;
  neighborhood?: string;
  addressReference?: string;

  // Características gerais & específicas
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  areaM2?: number;
  parkingSpaces?: number;
  hasWaterAndLight?: boolean;
  hasAirConditioning?: boolean;
  hasPool?: boolean;
  hasSecurity?: boolean;
  conditionState?: 'novo' | 'excelente' | 'bom' | 'precisa_reforma';
  declaredDocumentation?: string;
  
  // Terrenos (quando categoria = terrenos)
  landDimensions?: string; // Ex: '20x40m', '30x50m'
  landZoneType?: 'vip_urbana' | 'residencial' | 'expansao' | 'rural_agricola';
  landTopography?: 'plano' | 'declinio' | 'aclive';
  landRoadAccess?: 'alcatrao' | 'terra_boa' | 'regular_4x4';
  landDistanceToMainRoad?: string; // Ex: 'Beira da estrada', 'A 2-5 min da paragem (300m)', 'A 1 km da estrada principal'
  landIsFenced?: boolean; // Murado ou Vedado
  landHasWaterNearby?: boolean; // Furo ou FIPAG próximo
  landHasElectricityNearby?: boolean; // Postes EDM próximos

  // Condomínios Residenciais (quando categoria = condominios)
  condoCommercialModel?: 'venda_todo' | 'venda_fraccoes' | 'arrendamento_casas' | 'venda_e_arrendamento';
  condoTotalAreaM2?: number; // Área total do empreendimento / condomínio em m²
  condoTotalHouses?: number; // Número total de casas / moradias no condomínio
  condoAvailableHouses?: number; // Número de casas disponíveis para venda/arrendamento
  condoConstructionStatus?: 'pronto_habitar' | 'em_obra' | 'em_projeto';
  condoHasSecurity?: boolean; // Existência de segurança no condomínio
  condoSecurityDetails?: string; // Ex: 'Portaria 24h, Guarita, Cerca Elétrica, Câmaras CCTV'
  condoLocationReference?: string; // Localização específica / Bairro do condomínio
  condoHouseTypology?: string; // Tipologia das moradias (ex: 'T2', 'T3', 'T4', 'Moradias Geminadas')
  condoHasCommonPool?: boolean; // Piscina Comum do Condomínio
  condoHasPlayground?: boolean; // Parque Infantil / Área de Lazer
  condoHasGeneratorOrBorehole?: boolean; // Gerador de Emergência ou Furo de Água Comum

  // Comerciais & Armazéns
  ceilingHeightM?: number; // Pé-direito em metros
  hasLoadingDock?: boolean; // Cais de carga/descarga
  hasThreePhasePower?: boolean; // Eletricidade Trifásica
  officeAreaM2?: number; // Área de escritórios

  // Veículos (quando categoria = viaturas)
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleMileage?: number;
  vehicleFuel?: 'gasolina' | 'diesel' | 'hibrido';
  vehicleTransmission?: 'manual' | 'automatica';

  // Fotos
  photos: ListingPhoto[];

  // Condições de pagamento do imóvel
  paymentConditions: PaymentConditions;

  // Taxa de publicação
  feePayment: ListingFeePayment;

  // Estados e Métricas
  status: ListingStatus;
  isFeatured?: boolean;
  isSold?: boolean; // Selo público de VENDIDO / CONCLUÍDO
  impressionsCount: number;
  viewsCount: number;
  contactClicksCount: number;
  
  // Auditoria e Mensagens
  rejectionReason?: string;
  correctionMessage?: string;

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  count?: number;
}

export interface Banner {
  id: string;
  title: string;
  shortText: string;
  ctaText: string;
  linkUrl: string;
  mobileImageUrl: string;
  desktopImageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  impressionsCount: number;
  clicksCount: number;
}

export interface PaymentChannelConfig {
  id: string;
  name: string;
  accountNumber: string;
  beneficiaryName: string;
  instructions: string;
  isActive: boolean;
}

export interface AppUpdateConfig {
  isUpdateAvailable: boolean;
  versionName: string;
  versionCode: number;
  title: string;
  message: string;
  downloadUrl: string;
  isMandatory: boolean;
  publishedAt?: string;
}

export interface PlatformConfig {
  publicationFeeMt: number;
  minPhotosRequired: number;
  maxPhotosAllowed: number;
  paymentChannels: PaymentChannelConfig[];
  appUpdate?: AppUpdateConfig;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ListingFilters {
  categoryId?: string;
  province?: string;
  district?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  planType?: string;
  searchQuery?: string;
  status?: ListingStatus;
  userId?: string;
}
