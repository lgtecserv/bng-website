-- ==============================================================================
-- GRUPO BNG — ESQUEMA COMPLETO POSTGRESQL & POLÍTICAS RLS (SUPABASE)
-- Execute este script no SQL Editor do Supabase (https://supabase.com/dashboard/project/ohfxjwotkgllccdiismc/sql)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUMERADOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('visitor', 'advertiser', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM (
        'draft', 'submitted', 'under_review', 'changes_requested',
        'approved', 'published', 'suspended', 'rejected', 'expired', 'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'not_started', 'instructions_viewed', 'proof_submitted',
        'under_verification', 'confirmed', 'rejected', 'resubmission_required'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('sale', 'rent', 'lease');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_plan_type AS ENUM ('full', 'installments', 'special');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABELAS

-- 3.1 Perfis de Utilizadores
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    role user_role DEFAULT 'advertiser',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Categorias Dinâmicas
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Anúncios
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    category_name TEXT,
    transaction_type transaction_type NOT NULL DEFAULT 'sale',
    price NUMERIC(15, 2) NOT NULL,
    currency TEXT DEFAULT 'MT',
    
    -- Localização Geográfica (Moçambique)
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    neighborhood TEXT,
    address_reference TEXT,

    -- Características
    bedrooms INT,
    bathrooms INT,
    suites INT,
    area_m2 NUMERIC(10, 2),
    parking_spaces INT,
    has_water_and_light BOOLEAN DEFAULT TRUE,
    has_air_conditioning BOOLEAN DEFAULT FALSE,
    has_pool BOOLEAN DEFAULT FALSE,
    has_security BOOLEAN DEFAULT FALSE,
    condition_state TEXT,
    declared_documentation TEXT,

    -- Veículos
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_year INT,
    vehicle_mileage NUMERIC(10, 2),
    vehicle_fuel TEXT,
    vehicle_transmission TEXT,

    -- Dados do Anunciante
    author_name TEXT NOT NULL,
    author_phone TEXT NOT NULL,
    author_whatsapp TEXT NOT NULL,

    -- Estados e Métricas
    status listing_status DEFAULT 'under_review',
    is_featured BOOLEAN DEFAULT FALSE,
    impressions_count BIGINT DEFAULT 0,
    views_count BIGINT DEFAULT 0,
    contact_clicks_count BIGINT DEFAULT 0,

    -- Mensagens da Moderação
    rejection_reason TEXT,
    correction_message TEXT,

    submitted_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Condições de Pagamento do Imóvel
CREATE TABLE IF NOT EXISTS public.listing_payment_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID UNIQUE REFERENCES public.listings(id) ON DELETE CASCADE,
    plan_type payment_plan_type NOT NULL DEFAULT 'full',
    down_payment_percentage NUMERIC(5, 2),
    down_payment_amount NUMERIC(15, 2),
    remaining_balance NUMERIC(15, 2),
    installments_count INT,
    installment_frequency TEXT DEFAULT 'mensal',
    installment_amount NUMERIC(15, 2),
    first_installment_trigger TEXT,
    additional_notes TEXT
);

-- 3.5 Fotografias dos Anúncios
CREATE TABLE IF NOT EXISTS public.listing_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_cover BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Taxa de Publicação (150 MT) e Comprovativos
CREATE TABLE IF NOT EXISTS public.listing_fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID UNIQUE REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount_expected NUMERIC(10, 2) DEFAULT 150.00,
    amount_declared NUMERIC(10, 2) DEFAULT 150.00,
    payment_method TEXT DEFAULT 'm_pesa',
    reference_code TEXT,
    proof_file_url TEXT,
    status payment_status DEFAULT 'proof_submitted',
    admin_notes TEXT,
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Banners Institucionais Rotativos
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_text TEXT,
    cta_text TEXT DEFAULT 'Explorar',
    link_url TEXT DEFAULT '/pesquisa',
    mobile_image_url TEXT NOT NULL,
    desktop_image_url TEXT,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    impressions_count BIGINT DEFAULT 0,
    clicks_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Configurações Gerais da Plataforma
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Imóveis Guardados / Favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_payment_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 4.1 Políticas de Leitura Pública
CREATE POLICY "Categorias visíveis para todos" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Banners ativos visíveis para todos" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Configurações visíveis para todos" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Anúncios publicados visíveis para todos" ON public.listings FOR SELECT USING (status = 'published');
CREATE POLICY "Fotos de anúncios visíveis para todos" ON public.listing_photos FOR SELECT USING (true);
CREATE POLICY "Condições de pagamento visíveis para todos" ON public.listing_payment_conditions FOR SELECT USING (true);

-- 4.2 Políticas de Anunciantes
CREATE POLICY "Anunciantes podem ler seus próprios anúncios" ON public.listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anunciantes podem inserir anúncios" ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anunciantes podem atualizar seus anúncios em rascunho ou correcção" ON public.listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anunciantes podem gerir comprovativos próprios" ON public.listing_fee_payments FOR ALL USING (auth.uid() = user_id);

-- 4.3 Políticas de Favoritos
CREATE POLICY "Utilizadores gerem os seus próprios favoritos" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 5. TRIGGER DE CRIAÇÃO AUTOMÁTICA DE PERFIL QUANDO UTILIZADOR REGISTA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, whatsapp, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilizador Grupo BNG'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp',
    'advertiser'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. DADOS SEMEADOS INICIAIS (CATEGORIAS E CONFIGURAÇÃO)
INSERT INTO public.categories (slug, name, icon, display_order)
VALUES 
  ('casas', 'Casas', 'home', 1),
  ('apartamentos', 'Apartamentos', 'apartment', 2),
  ('terrenos', 'Terrenos', 'landscape', 3),
  ('escritorios', 'Escritórios', 'domain', 4),
  ('armazens', 'Armazéns', 'warehouse', 5),
  ('comerciais', 'Espaços Comerciais', 'storefront', 6),
  ('viaturas', 'Viaturas', 'directions_car', 7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.platform_settings (key, value, description)
VALUES (
  'general_config',
  '{
    "publicationFeeMt": 150,
    "minPhotosRequired": 5,
    "maxPhotosAllowed": 15,
    "paymentChannels": [
      {
        "id": "mpesa",
        "name": "M-Pesa (Vodacom)",
        "accountNumber": "84 123 4567 [TESTE/DEMO]",
        "beneficiaryName": "Grupo BNG Lda [TESTE]",
        "instructions": "Envie 150 MT via M-Pesa para o número acima e anexe o comprovativo ou insira o código da transação.",
        "isActive": true
      },
      {
        "id": "emola",
        "name": "e-Mola (Movitel)",
        "accountNumber": "86 987 6543 [TESTE/DEMO]",
        "beneficiaryName": "Grupo BNG Lda [TESTE]",
        "instructions": "Transfira 150 MT via e-Mola e carregue o print do SMS de confirmação.",
        "isActive": true
      },
      {
        "id": "bim",
        "name": "Millennium BIM (Bancário)",
        "accountNumber": "Conta: 123456789 | NIB: 000100000123456789012 [TESTE/DEMO]",
        "beneficiaryName": "Grupo BNG Imobiliária & Negócios Lda",
        "instructions": "Depósito ou transferência interbancária com envio do talão ou comprovativo em PDF.",
        "isActive": true
      }
    ]
  }'::jsonb,
  'Configurações oficiais de pagamentos e taxas do Grupo BNG'
)
ON CONFLICT (key) DO NOTHING;
