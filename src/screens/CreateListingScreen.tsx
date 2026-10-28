import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCategories, fetchPlatformConfig, createListing, uploadToStorage, broadcastGlobalAnnouncement } from '../services/supabase';
import { Category, PlatformConfig, TransactionType, PaymentPlanType, ListingPhoto } from '../types';
import { MOZAMBIQUE_PROVINCES } from '../data/mockData';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Upload, Trash2, Star, 
  MapPin, DollarSign, Camera, FileCheck, AlertCircle, Copy, Check
} from 'lucide-react';

export const CreateListingScreen: React.FC = () => {
  const { navigateTo, currentUser, triggerRefresh } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [step, setStep] = useState(1);
  const [copiedChannelId, setCopiedChannelId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Formulário por etapas
  const [categoryId, setCategoryId] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');

  // Características Residenciais (Casas & Apartamentos)
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [suites, setSuites] = useState(1);
  const [areaM2, setAreaM2] = useState(180);
  const [parkingSpaces, setParkingSpaces] = useState(2);
  const [hasWaterAndLight, setHasWaterAndLight] = useState(true);
  const [hasAirConditioning, setHasAirConditioning] = useState(true);
  const [hasPool, setHasPool] = useState(false);
  const [hasSecurity, setHasSecurity] = useState(true);
  const [conditionState, setConditionState] = useState<'novo' | 'excelente' | 'bom' | 'precisa_reforma'>('excelente');

  // Características Específicas de Terrenos (PRD e Solicitação do Utilizador)
  const [landDimensions, setLandDimensions] = useState('20m x 40m');
  const [landZoneType, setLandZoneType] = useState<'vip_urbana' | 'residencial' | 'expansao' | 'rural_agricola'>('residencial');
  const [landRoadAccess, setLandRoadAccess] = useState<'alcatrao' | 'terra_boa' | 'regular_4x4'>('alcatrao');
  const [landDistanceToMainRoad, setLandDistanceToMainRoad] = useState('A 2 a 5 minutos a pé da paragem (300m)');
  const [landTopography, setLandTopography] = useState<'plano' | 'declinio' | 'aclive'>('plano');
  const [landIsFenced, setLandIsFenced] = useState(true);
  const [landHasWaterNearby, setLandHasWaterNearby] = useState(true);
  const [landHasElectricityNearby, setLandHasElectricityNearby] = useState(true);

  // Características Específicas de Viaturas
  const [vehicleBrand, setVehicleBrand] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Land Cruiser Prado TXL');
  const [vehicleYear, setVehicleYear] = useState(2022);
  const [vehicleMileage, setVehicleMileage] = useState(45000);
  const [vehicleFuel, setVehicleFuel] = useState<'gasolina' | 'diesel' | 'hibrido'>('diesel');
  const [vehicleTransmission, setVehicleTransmission] = useState<'manual' | 'automatica'>('automatica');

  // Características Específicas de Comerciais & Armazéns
  const [ceilingHeightM, setCeilingHeightM] = useState(6);
  const [officeAreaM2, setOfficeAreaM2] = useState(45);
  const [hasLoadingDock, setHasLoadingDock] = useState(true);
  const [hasThreePhasePower, setHasThreePhasePower] = useState(true);

  // Fotografias (Mínimo 5 por regra)
  const [photos, setPhotos] = useState<ListingPhoto[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', isCover: true, displayOrder: 1 },
    { id: '2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', isCover: false, displayOrder: 2 },
    { id: '3', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', isCover: false, displayOrder: 3 },
    { id: '4', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', isCover: false, displayOrder: 4 },
    { id: '5', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80', isCover: false, displayOrder: 5 },
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Descrição e Preço
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(3500000);
  const [declaredDocumentation, setDeclaredDocumentation] = useState('DUAT definitivo com Registo Predial');

  // Condições de pagamento
  const [planType, setPlanType] = useState<PaymentPlanType>('full');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [installmentsCount, setInstallmentsCount] = useState(6);
  const [installmentFrequency, setInstallmentFrequency] = useState<'mensal' | 'trimestral'>('mensal');
  const [firstInstallmentTrigger, setFirstInstallmentTrigger] = useState('30 dias após assinatura');

  // Localização Moçambique
  const [province, setProvince] = useState('Maputo Cidade');
  const [district, setDistrict] = useState('KaMavota');
  const [neighborhood, setNeighborhood] = useState('Triunfo');
  const [addressReference, setAddressReference] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // Contactos
  const [authorName, setAuthorName] = useState(isAdmin ? 'Grupo BNG Oficial' : (currentUser.fullName || ''));
  const [authorPhone, setAuthorPhone] = useState(isAdmin ? '+258 84 000 0000' : (currentUser.phone || '+258 84 000 0000'));
  const [authorWhatsapp, setAuthorWhatsapp] = useState(isAdmin ? '+258 84 000 0000' : (currentUser.whatsapp || '+258 84 000 0000'));

  // Taxa de Publicação (150 MT)
  const [selectedMethod, setSelectedMethod] = useState<'m_pesa' | 'e_mola' | 'bank_transfer'>('m_pesa');
  const [paymentReference, setPaymentReference] = useState('MPESA-' + Math.floor(100000 + Math.random() * 900000));
  const [proofFileUrl, setProofFileUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');

  useEffect(() => {
    fetchCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
    });
    fetchPlatformConfig().then(setConfig);
  }, []);

  // Identificação dinâmica da categoria ativa para o formulário específico
  const selectedCategoryObj = categories.find(c => c.id === categoryId);
  const catSlug = selectedCategoryObj?.slug || '';
  const catName = selectedCategoryObj?.name?.toLowerCase() || '';
  const isLand = catSlug === 'terrenos' || catName.includes('terreno');
  const isVehicle = catSlug === 'viaturas' || catName.includes('viatura') || catName.includes('carro');
  const isCommercial = catSlug === 'escritorios' || catSlug === 'armazens' || catSlug === 'comerciais' || catName.includes('armazém') || catName.includes('escritório') || catName.includes('comercial');
  const isResidential = !isLand && !isVehicle && !isCommercial;

  // Cálculos matemáticos rigorosos das prestações
  const downPaymentAmount = planType === 'installments' ? (price * downPaymentPercentage) / 100 : 0;
  const remainingBalance = planType === 'installments' ? price - downPaymentAmount : 0;
  const installmentAmount = (planType === 'installments' && installmentsCount > 0) 
    ? remainingBalance / installmentsCount 
    : 0;

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhoto(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToStorage(files[i], 'listing-photos');
        setPhotos(prev => [
          ...prev,
          {
            id: `p-${Date.now()}-${i}`,
            url,
            isCover: prev.length === 0 && i === 0,
            displayOrder: prev.length + 1 + i
          }
        ]);
      }
    } catch (err) {
      console.error('Erro no upload de foto:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProofFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const url = await uploadToStorage(file, 'payment-proofs');
      setProofFileUrl(url);
    } catch (err) {
      console.error('Erro no upload de comprovativo:', err);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newP: ListingPhoto = {
      id: Date.now().toString(),
      url: newPhotoUrl.trim(),
      isCover: photos.length === 0,
      displayOrder: photos.length + 1
    };
    setPhotos([...photos, newP]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    if (updated.length > 0 && !updated.some(p => p.isCover)) {
      updated[0].isCover = true;
    }
    setPhotos(updated);
  };

  const handleSetCover = (id: string) => {
    setPhotos(photos.map(p => ({ ...p, isCover: p.id === id })));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannelId(id);
    setTimeout(() => setCopiedChannelId(null), 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isAdmin = currentUser.role === 'admin';

      let autoTitle = title;
      if (!autoTitle) {
        if (isLand) {
          autoTitle = `Terreno (${landDimensions}) em ${district}, ${province}`;
        } else if (isVehicle) {
          autoTitle = `${vehicleBrand} ${vehicleModel} (${vehicleYear})`;
        } else if (isCommercial) {
          autoTitle = `Espaço Comercial / Armazém (${areaM2} m²) em ${district}`;
        } else {
          autoTitle = `Moradia T${bedrooms} em ${district}, ${province}`;
        }
      }

      await createListing({
        userId: currentUser.id || (isAdmin ? 'user-admin' : 'user-adv-1'),
        authorName,
        authorPhone,
        authorWhatsapp,
        title: autoTitle,
        description: description || (
          isLand 
            ? `Excelente terreno com dimensões de ${landDimensions} (${areaM2} m²), localizado em ${neighborhood || district}, ${province}. ${landDistanceToMainRoad}. Documentação: ${declaredDocumentation}.`
            : isVehicle
            ? `Viatura ${vehicleBrand} ${vehicleModel} ano ${vehicleYear}, com ${vehicleMileage.toLocaleString()} km, transmissão ${vehicleTransmission}, combustível ${vehicleFuel}. Excelente estado de conservação.`
            : 'Excelente imóvel em localização privilegiada, ideal para habitação ou investimento.'
        ),
        categoryId,
        categoryName: selectedCategoryObj?.name || 'Casas',
        transactionType,
        price,
        currency: 'MT',
        province,
        district,
        neighborhood,
        addressReference,
        
        // Características Residenciais
        bedrooms: isResidential ? bedrooms : undefined,
        bathrooms: (isResidential || isCommercial) ? bathrooms : undefined,
        suites: isResidential ? suites : undefined,
        areaM2,
        parkingSpaces: (isResidential || isCommercial) ? parkingSpaces : undefined,
        hasWaterAndLight: isResidential ? hasWaterAndLight : undefined,
        hasAirConditioning: isResidential ? hasAirConditioning : undefined,
        hasPool: isResidential ? hasPool : undefined,
        hasSecurity: (isResidential || isCommercial) ? hasSecurity : undefined,
        conditionState: (isResidential || isVehicle) ? conditionState : undefined,
        declaredDocumentation,

        // Terrenos
        landDimensions: isLand ? landDimensions : undefined,
        landZoneType: isLand ? landZoneType : undefined,
        landTopography: isLand ? landTopography : undefined,
        landRoadAccess: isLand ? landRoadAccess : undefined,
        landDistanceToMainRoad: isLand ? landDistanceToMainRoad : undefined,
        landIsFenced: isLand ? landIsFenced : undefined,
        landHasWaterNearby: isLand ? landHasWaterNearby : undefined,
        landHasElectricityNearby: isLand ? landHasElectricityNearby : undefined,

        // Viaturas
        vehicleBrand: isVehicle ? vehicleBrand : undefined,
        vehicleModel: isVehicle ? vehicleModel : undefined,
        vehicleYear: isVehicle ? vehicleYear : undefined,
        vehicleMileage: isVehicle ? vehicleMileage : undefined,
        vehicleFuel: isVehicle ? vehicleFuel : undefined,
        vehicleTransmission: isVehicle ? vehicleTransmission : undefined,

        // Comerciais
        ceilingHeightM: isCommercial ? ceilingHeightM : undefined,
        officeAreaM2: isCommercial ? officeAreaM2 : undefined,
        hasLoadingDock: isCommercial ? hasLoadingDock : undefined,
        hasThreePhasePower: isCommercial ? hasThreePhasePower : undefined,

        photos,
        paymentConditions: {
          planType,
          downPaymentPercentage: planType === 'installments' ? downPaymentPercentage : undefined,
          downPaymentAmount: planType === 'installments' ? downPaymentAmount : undefined,
          remainingBalance: planType === 'installments' ? remainingBalance : undefined,
          installmentsCount: planType === 'installments' ? installmentsCount : undefined,
          installmentFrequency: planType === 'installments' ? installmentFrequency : undefined,
          installmentAmount: planType === 'installments' ? installmentAmount : undefined,
          firstInstallmentTrigger: planType === 'installments' ? firstInstallmentTrigger : undefined
        },
        feePayment: {
          id: `fee-${Date.now()}`,
          listingId: '',
          userId: currentUser.id || 'user-adv-1',
          amountExpected: isAdmin ? 0 : 150,
          amountDeclared: isAdmin ? 0 : 150,
          paymentMethod: isAdmin ? 'bank_transfer' : selectedMethod,
          referenceCode: isAdmin ? 'ADMIN-DIRETO' : paymentReference,
          proofFileUrl: isAdmin ? 'aprovado-admin' : proofFileUrl,
          status: isAdmin ? 'confirmed' : 'proof_submitted',
          submittedAt: new Date().toISOString()
        },
        status: isAdmin ? 'published' : 'under_review' // Admin publica direto, cliente vai para aprovação
      });

      // Dispara notificação push instantânea para todos os telemóveis e registra na central
      if (isAdmin) {
        await broadcastGlobalAnnouncement(
          '🏠 Novo Imóvel Cadastrado!',
          `O anúncio "${autoTitle}" foi publicado com sucesso no catálogo oficial do Grupo BNG.`,
          'listing_published'
        );
      } else {
        await broadcastGlobalAnnouncement(
          '📋 Novo Imóvel Submetido para Revisão',
          `O anúncio "${autoTitle}" e a taxa de 150 MT foram submetidos com sucesso para a moderação do Grupo BNG.`,
          'system'
        );
      }

      triggerRefresh();
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Erro na submissão:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSuccess) {
    if (isAdmin) {
      return (
        <div className="min-h-screen bg-[#F5F7FA] p-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-[#C89B3C] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-[#C89B3C]" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Imóvel Publicado com Sucesso!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Como <strong>Administrador do Grupo BNG</strong>, este anúncio foi publicado diretamente sem necessidade de taxa ou comprovativo e já se encontra <strong>100% ativo</strong> no catálogo público.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-800 text-left flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span><strong>Estado Oficial:</strong> Publicado e visível para todos os clientes em Moçambique.</span>
            </div>
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => navigateTo('home')}
                className="w-full bg-[#14181B] text-[#C89B3C] py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors shadow"
              >
                Ver no Catálogo Público
              </button>
              <button
                onClick={() => navigateTo('admin-listings')}
                className="w-full bg-[#C89B3C] text-[#14181B] py-2.5 rounded-2xl text-xs font-bold hover:bg-[#B6882C] transition-colors"
              >
                Ir para Gestão de Imóveis (Admin)
              </button>
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setStep(1);
                  setTitle('');
                  setDescription('');
                }}
                className="w-full text-slate-500 py-2 rounded-2xl text-xs font-semibold hover:text-slate-800"
              >
                + Cadastrar Outro Imóvel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Anúncio Submetido com Sucesso!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            O seu comprovativo da taxa de <strong>150 MT</strong> e os dados do anúncio foram enviados para a equipa do Grupo BNG. O seu anúncio está no estado <strong>Em Análise</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-800 text-left">
            <strong>Nota de Moderação:</strong> Após a conferência do pagamento e validação das fotografias pelo administrador, o anúncio será publicado e ficará visível publicamente.
          </div>
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => navigateTo('my-listings')}
              className="w-full bg-[#14181B] text-[#C89B3C] py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Consultar Meus Anúncios
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full text-slate-500 py-2 rounded-2xl text-xs font-semibold hover:text-slate-800"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  const maxStep = isAdmin ? 6 : 8;
  const stepsLabels = isAdmin
    ? ['Categoria', 'Características', 'Fotos', 'Preço', 'Localização', 'Revisão & Publicar']
    : ['Categoria', 'Características', 'Fotos', 'Preço', 'Localização', 'Contactos', 'Revisão', 'Taxa 150 MT'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 sm:pb-12">
      {/* Top Header */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigateTo(isAdmin ? 'admin-dashboard' : 'home'))}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Publicar Anúncio
                </h1>
                {isAdmin && (
                  <span className="bg-[#C89B3C] text-[#14181B] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#C89B3C]">
                Etapa {step} de {maxStep}: {stepsLabels[step - 1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-200 h-1.5 w-full">
        <div
          className="bg-[#C89B3C] h-full transition-all duration-300"
          style={{ width: `${(step / maxStep) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-5 mt-2">
        {/* ETAPA 1: Categoria e Transação */}
        {step === 1 && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Selecione a Categoria e Transação</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Tipo de Negócio</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType('sale')}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                    transactionType === 'sale'
                      ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Venda de Imóvel ou Bem
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('rent')}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                    transactionType === 'rent'
                      ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Arrendamento / Renda
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Categoria</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-2xl text-left border flex items-center space-x-2 transition-all ${
                      categoryId === cat.id
                        ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    <span className="text-xs font-bold truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 2: Características Específicas por Tipo de Imóvel / Bem */}
        {step === 2 && (
          <div className="space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {isLand ? 'Especificações do Terreno' : isVehicle ? 'Especificações da Viatura' : isCommercial ? 'Especificações Comerciais / Armazém' : 'Características da Moradia / Apartamento'}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Preencha os detalhes específicos para <strong>{selectedCategoryObj?.name || 'este bem'}</strong>.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#C89B3C] border border-[#C89B3C]/30 px-2.5 py-1 rounded-full">
                {selectedCategoryObj?.name}
              </span>
            </div>

            {/* CASO 1: TERRENOS */}
            {isLand && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dimensões do Terreno <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={landDimensions}
                      onChange={(e) => setLandDimensions(e.target.value)}
                      placeholder="Ex: 20m x 40m, 50m x 100m, 1 Ha"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Ex: Frente x Fundo ou Hectares</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Área Estimada Total (m²) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      placeholder="Ex: 800"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enquadramento / Tipo de Zona</label>
                    <select
                      value={landZoneType}
                      onChange={(e) => setLandZoneType(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="vip_urbana">Zona Nobre / VIP (Centro Urbano)</option>
                      <option value="residencial">Bairro Residencial Consolidado</option>
                      <option value="expansao">Zona de Expansão / Novo Loteamento</option>
                      <option value="rural_agricola">Zona Rural / Agrícola / Quinta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Acesso Rodoviário</label>
                    <select
                      value={landRoadAccess}
                      onChange={(e) => setLandRoadAccess(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="alcatrao">Estrada Asfaltada / Alcatrão à porta</option>
                      <option value="terra_boa">Terra Batida em Bom Estado</option>
                      <option value="regular_4x4">Acesso Regular / Recomendado 4x4</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Distância até à Paragem / Estrada Principal
                  </label>
                  <input
                    type="text"
                    value={landDistanceToMainRoad}
                    onChange={(e) => setLandDistanceToMainRoad(e.target.value)}
                    placeholder="Ex: A 2 a 5 minutos a pé da paragem (200m), na 1ª linha da circular..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Topografia do Terreno</label>
                    <select
                      value={landTopography}
                      onChange={(e) => setLandTopography(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="plano">Terreno 100% Plano / Regular</option>
                      <option value="declinio">Ligeiro Declive</option>
                      <option value="aclive">Aclive / Elevado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado da Vedação</label>
                    <select
                      value={landIsFenced ? 'vedado' : 'nao_vedado'}
                      onChange={(e) => setLandIsFenced(e.target.value === 'vedado')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="vedado">Totalmente Vedado / Murado</option>
                      <option value="nao_vedado">Aberto / Não Vedado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Situação Documental (DUAT / Posse)</label>
                  <select
                    value={declaredDocumentation}
                    onChange={(e) => setDeclaredDocumentation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                  >
                    <option value="DUAT definitivo com Registo Predial">DUAT definitivo com Registo Predial</option>
                    <option value="DUAT em tramitação regular">DUAT em tramitação regular</option>
                    <option value="Título de ocupação e declaração do bairro / régulo">Título de ocupação com declaração do bairro / régulo</option>
                    <option value="Declaração de cedência reconhecida">Declaração de cedência reconhecida</option>
                  </select>
                </div>

                {/* Infraestruturas próximas */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-700 mb-2">Infraestruturas Disponíveis nas Imediações</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <input
                        type="checkbox"
                        checked={landHasElectricityNearby}
                        onChange={(e) => setLandHasElectricityNearby(e.target.checked)}
                        className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                      />
                      <span className="font-medium text-slate-700">Postes de Energia (EDM) Próximos</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <input
                        type="checkbox"
                        checked={landHasWaterNearby}
                        onChange={(e) => setLandHasWaterNearby(e.target.checked)}
                        className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                      />
                      <span className="font-medium text-slate-700">Rede de Água / Furo Próximo</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* CASO 2: VIATURAS */}
            {isVehicle && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={vehicleBrand}
                      onChange={(e) => setVehicleBrand(e.target.value)}
                      placeholder="Ex: Toyota, Ford, Nissan..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="Ex: Land Cruiser Prado TXL, Hilux..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ano de Fabrico</label>
                    <input
                      type="number"
                      min="1990"
                      max={2030}
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quilometragem (km)</label>
                    <input
                      type="number"
                      min="0"
                      value={vehicleMileage}
                      onChange={(e) => setVehicleMileage(Number(e.target.value))}
                      placeholder="Ex: 45000"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Combustível</label>
                    <select
                      value={vehicleFuel}
                      onChange={(e) => setVehicleFuel(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="diesel">Diesel</option>
                      <option value="gasolina">Gasolina</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Caixa / Transmissão</label>
                    <select
                      value={vehicleTransmission}
                      onChange={(e) => setVehicleTransmission(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="automatica">Automática</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado de Conservação</label>
                  <select
                    value={conditionState}
                    onChange={(e) => setConditionState(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                  >
                    <option value="excelente">Excelente / Como Novo</option>
                    <option value="bom">Bom Estado de Funcionamento</option>
                    <option value="precisa_reforma">Precisa de Reparos / Revisão</option>
                  </select>
                </div>
              </div>
            )}

            {/* CASO 3: ESCRITÓRIOS, ARMAZÉNS E COMERCIAIS */}
            {isCommercial && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Área Útil Total (m²)</label>
                    <input
                      type="number"
                      min="1"
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pé Direito / Altura (m)</label>
                    <input
                      type="number"
                      min="2"
                      value={ceilingHeightM}
                      onChange={(e) => setCeilingHeightM(Number(e.target.value))}
                      placeholder="Ex: 6"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Salas / Compartimentos</label>
                    <input
                      type="number"
                      min="0"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Casas de Banho (WC)</label>
                    <input
                      type="number"
                      min="1"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasLoadingDock}
                      onChange={(e) => setHasLoadingDock(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Cais de Carga e Descarga</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasThreePhasePower}
                      onChange={(e) => setHasThreePhasePower(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Energia Trifásica</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSecurity}
                      onChange={(e) => setHasSecurity(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Segurança 24h</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAirConditioning}
                      onChange={(e) => setHasAirConditioning(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Climatização</span>
                  </label>
                </div>
              </div>
            )}

            {/* CASO 4: MORADIAS E APARTAMENTOS (RESIDENCIAL) */}
            {isResidential && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quartos</label>
                    <input
                      type="number"
                      min="0"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suítes</label>
                    <input
                      type="number"
                      min="0"
                      value={suites}
                      onChange={(e) => setSuites(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Casas de Banho (WC)</label>
                    <input
                      type="number"
                      min="1"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Área Total (m²)</label>
                    <input
                      type="number"
                      min="1"
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vagas de Garagem</label>
                    <input
                      type="number"
                      min="0"
                      value={parkingSpaces}
                      onChange={(e) => setParkingSpaces(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado de Conservação</label>
                    <select
                      value={conditionState}
                      onChange={(e) => setConditionState(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#C89B3C] outline-none"
                    >
                      <option value="novo">Novo / A Estrear</option>
                      <option value="excelente">Excelente Estado</option>
                      <option value="bom">Bom Estado</option>
                      <option value="precisa_reforma">Necessita de Reforma</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes de comodidades */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasWaterAndLight}
                      onChange={(e) => setHasWaterAndLight(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Água e Luz da Rede</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAirConditioning}
                      onChange={(e) => setHasAirConditioning(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Climatização (AC)</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPool}
                      onChange={(e) => setHasPool(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Piscina</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSecurity}
                      onChange={(e) => setHasSecurity(e.target.checked)}
                      className="rounded text-[#C89B3C] focus:ring-[#C89B3C]"
                    />
                    <span className="font-medium text-slate-700">Segurança Privada</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 3: Fotografias (Pelo menos 5) */}
        {step === 3 && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Fotografias do Anúncio</h2>
                <p className="text-xs text-slate-500">
                  São necessárias pelo menos <strong>5 fotografias nítidas</strong>.
                </p>
              </div>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                photos.length >= 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {photos.length} / 5 Mínimo
              </span>
            </div>

            {/* Grid de Fotos */}
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, idx) => (
                <div key={p.id} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSetCover(p.id)}
                      title="Definir como Principal"
                      className={`p-1.5 rounded-full ${p.isCover ? 'bg-[#C89B3C] text-black' : 'bg-white text-slate-700'}`}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(p.id)}
                      title="Remover Foto"
                      className="p-1.5 rounded-full bg-red-600 text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {p.isCover && (
                    <span className="absolute top-1 left-1 bg-[#C89B3C] text-[#14181B] text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow">
                      Capa
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload de arquivo direto para Supabase Storage ou via Link */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Carregar Fotografias (Ficheiros Locais ou Link)
              </label>

              {/* Botão de Ficheiro Local -> Supabase Storage */}
              <div className="flex items-center space-x-2">
                <label className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-[#14181B] border border-[#C89B3C]/50 rounded-xl cursor-pointer text-xs font-bold transition-colors">
                  <Upload className="w-4 h-4 text-[#C89B3C]" />
                  <span>{uploadingPhoto ? 'A carregar para Supabase Storage...' : 'Selecionar Fotos do Telemóvel / PC'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>

              {/* Fallback por URL */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Ou cole o link direto da imagem..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-[#14181B] text-[#C89B3C] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: Descrição e Preço */}
        {step === 4 && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Descrição e Condições Comerciais</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Título do Anúncio</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Moradia T4 com Piscina no Triunfo"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Descrição Pormenorizada</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente o imóvel, acabamentos, localização e vantagens..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Preço Total (Meticais MT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900"
              />
            </div>

            {/* Modalidade de Pagamento */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-600 mb-2">Modalidade de Pagamento</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPlanType('full')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    planType === 'full' ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Pagamento Integral
                </button>
                <button
                  type="button"
                  onClick={() => setPlanType('installments')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    planType === 'installments' ? 'bg-[#14181B] text-[#C89B3C] border-[#C89B3C]' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Pagamento em Prestações
                </button>
              </div>

              {planType === 'installments' && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-600 block mb-1">Entrada (%)</span>
                      <input
                        type="number"
                        min="5"
                        max="90"
                        value={downPaymentPercentage}
                        onChange={(e) => setDownPaymentPercentage(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 block mb-1">Nº de Prestações</span>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  {/* Resumo matemático validado */}
                  <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor da Entrada:</span>
                      <strong className="text-slate-900">{new Intl.NumberFormat('pt-MZ').format(downPaymentAmount)} MT</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Saldo Restante:</span>
                      <strong className="text-slate-900">{new Intl.NumberFormat('pt-MZ').format(remainingBalance)} MT</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1 text-[#C89B3C] font-extrabold">
                      <span>Valor de cada prestação:</span>
                      <span>{new Intl.NumberFormat('pt-MZ').format(installmentAmount)} MT/mês</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 5: Localização em Moçambique */}
        {step === 5 && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Localização em Moçambique</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Província</label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict(MOZAMBIQUE_PROVINCES[e.target.value]?.[0] || '');
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {Object.keys(MOZAMBIQUE_PROVINCES).map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Distrito / Município</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {(MOZAMBIQUE_PROVINCES[province] || []).map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Polana, Sommerschield, Matola Rio..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Ponto de Referência (Opcional)</label>
              <input
                type="text"
                value={addressReference}
                onChange={(e) => setAddressReference(e.target.value)}
                placeholder="Ex: Próximo ao Supermercado, junto à rotunda..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* ETAPA 6 ADMIN: Revisão & Publicação Direta */}
        {step === 6 && isAdmin && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C89B3C] text-[#14181B]">
                Admin
              </span>
              <h2 className="text-sm font-extrabold text-slate-900">Revisão e Publicação Imediata</h2>
            </div>

            <div className="bg-amber-50 border border-[#C89B3C]/40 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                <span>Isenção Total de Taxa e Aprovação Automática</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Como <strong>Administrador do Grupo BNG</strong>, este anúncio será publicado <strong>diretamente no catálogo público</strong>, sem cobrança da taxa de 150 MT, sem necessidade de comprovativo bancário e com o contacto oficial do Grupo BNG associado.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Título:</span>
                <strong className="text-slate-900">{title || 'Título gerado automaticamente'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Categoria:</span>
                <strong className="text-slate-900">{selectedCategoryObj?.name || 'Imóvel'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Preço:</span>
                <strong className="text-[#C89B3C] font-extrabold">
                  {new Intl.NumberFormat('pt-MZ').format(price)} MT
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Localização:</span>
                <strong className="text-slate-900">{neighborhood ? `${neighborhood}, ` : ''}{district}, {province}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total de Fotos:</span>
                <strong className="text-slate-900">{photos.length} fotos anexadas</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Condições de Pagamento:</span>
                <strong className="text-slate-900">{planType === 'installments' ? 'Prestações' : 'Pagamento Integral'}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Contacto Associado:</span>
                <strong className="text-slate-900">{authorName} ({authorPhone})</strong>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 6 CLIENTE: Contactos */}
        {step === 6 && !isAdmin && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Contactos do Anunciante</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo ou Razão Social</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Número de Telefone</label>
              <input
                type="text"
                value={authorPhone}
                onChange={(e) => setAuthorPhone(e.target.value)}
                placeholder="+258 84 000 0000"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Número de WhatsApp</label>
              <input
                type="text"
                value={authorWhatsapp}
                onChange={(e) => setAuthorWhatsapp(e.target.value)}
                placeholder="+258 84 000 0000"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* ETAPA 7: Revisão Geral (Apenas Clientes) */}
        {step === 7 && !isAdmin && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Revisão do Anúncio</h2>
            
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Título:</span>
                <strong className="text-slate-900">{title || 'Sem título preenchido'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Preço:</span>
                <strong className="text-[#C89B3C] font-extrabold">
                  {new Intl.NumberFormat('pt-MZ').format(price)} MT
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Localização:</span>
                <strong className="text-slate-900">{neighborhood ? `${neighborhood}, ` : ''}{district}, {province}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total de Fotos:</span>
                <strong className="text-slate-900">{photos.length} fotos anexadas</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Condições:</span>
                <strong className="text-slate-900">{planType === 'installments' ? 'Prestações' : 'Integral'}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Na próxima etapa, serão apresentadas as instruções da taxa de publicação de <strong>150 MT</strong> para envio do comprovativo.
            </p>
          </div>
        )}

        {/* ETAPA 8: Taxa de Publicação (150 MT) e Envio de Comprovativo (Apenas Clientes) */}
        {step === 8 && !isAdmin && (
          <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#14181B] text-[#C89B3C] font-extrabold flex items-center justify-center text-xs">
                MT
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Taxa de Publicação: 150 MT</h2>
                <p className="text-xs text-slate-500">Conforme o PRD do Grupo BNG, cada anúncio requer 150 MT.</p>
              </div>
            </div>

            {/* Canais Oficiais Autorizados */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Selecione o Canal de Pagamento:</label>
              {(config?.paymentChannels || []).map(ch => (
                <div
                  key={ch.id}
                  onClick={() => setSelectedMethod(ch.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === ch.id
                      ? 'bg-amber-50/80 border-[#C89B3C] shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{ch.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(ch.accountNumber, ch.id);
                      }}
                      className="text-[10px] font-bold text-[#C89B3C] flex items-center space-x-1"
                    >
                      {copiedChannelId === ch.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedChannelId === ch.id ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono font-extrabold text-slate-800">{ch.accountNumber}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Titular: {ch.beneficiaryName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 italic">{ch.instructions}</div>
                </div>
              ))}
            </div>

            {/* Referência e Comprovativo */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Código ou Referência da Transação
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ex: MPESA839102"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comprovativo de Pagamento (Ficheiro ou URL)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-[#14181B] border border-[#C89B3C]/50 rounded-xl cursor-pointer text-xs font-bold transition-colors">
                    <Upload className="w-4 h-4 text-[#C89B3C]" />
                    <span>{uploadingProof ? 'A carregar comprovativo seguro...' : 'Anexar Comprovativo (PDF / Foto)'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleProofFileUpload}
                      className="hidden"
                      disabled={uploadingProof}
                    />
                  </label>
                  <input
                    type="text"
                    value={proofFileUrl}
                    onChange={(e) => setProofFileUrl(e.target.value)}
                    placeholder="Ou cole o link do comprovativo..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center space-x-1 font-bold text-slate-800">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Segurança e Auditoria do Grupo BNG:</span>
                </div>
                <p>
                  O simples envio do comprovativo <strong>não</strong> publica o anúncio automaticamente. Um administrador fará a conferência da transação financeira antes da aprovação final.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação entre Etapas */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
            >
              Voltar
            </button>
          ) : <div />}

          {step < maxStep ? (
            <button
              type="button"
              onClick={() => {
                if (step === 3 && photos.length < 5) {
                  alert('Por favor, adicione pelo menos 5 fotografias para prosseguir.');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-6 py-2.5 rounded-full bg-[#14181B] text-[#C89B3C] text-xs font-extrabold hover:bg-slate-800 flex items-center space-x-1 shadow-md"
            >
              <span>Avançar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#C89B3C] to-[#E5B95C] text-[#14181B] text-xs font-extrabold shadow-lg flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'A Publicar...' : (isAdmin ? 'Publicar Imóvel Agora' : 'Concluir Submissão')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
