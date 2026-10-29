import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  DollarSign, 
  Camera, 
  FileCheck, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { WebsiteUser, uploadWebsitePhoto, createWebsiteListing } from '../services/supabase';

interface PublicarImovelPageProps {
  currentUser: WebsiteUser | null;
  onBack: () => void;
  onSuccess: () => void;
}

const PROVINCES = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

export const PublicarImovelPage: React.FC<PublicarImovelPageProps> = ({
  currentUser,
  onBack,
  onSuccess,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Formulário por etapas
  const [categoryId, setCategoryId] = useState('casas-vivendas');
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>('sale');

  // Características Condomínios Residenciais
  const [condoCommercialModel, setCondoCommercialModel] = useState<'venda_todo' | 'venda_fraccoes' | 'arrendamento_casas' | 'venda_e_arrendamento'>('venda_todo');
  const [condoTotalAreaM2, setCondoTotalAreaM2] = useState<number | string>(5000);
  const [condoTotalHouses, setCondoTotalHouses] = useState<number | string>(8);
  const [condoAvailableHouses, setCondoAvailableHouses] = useState<number | string>(8);
  const [condoConstructionStatus, setCondoConstructionStatus] = useState<'pronto_habitar' | 'em_obra' | 'em_projeto'>('pronto_habitar');
  const [condoHasSecurity, setCondoHasSecurity] = useState(true);
  const [condoSecurityDetails, setCondoSecurityDetails] = useState('Portaria 24h, Guarita, Cerca Elétrica');
  const [condoLocationReference, setCondoLocationReference] = useState('');
  const [condoHouseTypology, setCondoHouseTypology] = useState('T3');
  const [condoHasCommonPool, setCondoHasCommonPool] = useState(false);
  const [condoHasPlayground, setCondoHasPlayground] = useState(false);
  const [condoHasGeneratorOrBorehole, setCondoHasGeneratorOrBorehole] = useState(true);

  // Características Residenciais
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

  // Características Terrenos
  const [landDimensions, setLandDimensions] = useState('20m x 40m');
  const [landZoneType, setLandZoneType] = useState<'vip_urbana' | 'residencial' | 'expansao' | 'rural_agricola'>('residencial');
  const [landIsFenced, setLandIsFenced] = useState(true);
  const [declaredDocumentation, setDeclaredDocumentation] = useState('DUAT definitivo com Registo Predial');

  // Características Viaturas
  const [vehicleBrand, setVehicleBrand] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Land Cruiser Prado');
  const [vehicleYear, setVehicleYear] = useState(2022);
  const [vehicleMileage, setVehicleMileage] = useState(45000);
  const [vehicleFuel, setVehicleFuel] = useState<'gasolina' | 'diesel' | 'hibrido'>('diesel');
  const [vehicleTransmission, setVehicleTransmission] = useState<'manual' | 'automatica'>('automatica');

  // Fotografias
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  ]);

  // Detalhes Principais
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(3500000);
  const [planType, setPlanType] = useState<'full' | 'installments'>('full');
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [installmentsCount, setInstallmentsCount] = useState(6);

  // Localização
  const [province, setProvince] = useState('Maputo Cidade');
  const [district, setDistrict] = useState('KaMpfumo');
  const [neighborhood, setNeighborhood] = useState('Polana Cimento');

  // Taxa de 150 MT
  const [paymentMethod, setPaymentMethod] = useState<'m_pesa' | 'e_mola' | 'bank_transfer'>('m_pesa');
  const [paymentReference, setPaymentReference] = useState('MPESA-' + Math.floor(100000 + Math.random() * 900000));

  const isCondo = categoryId === 'condominios';
  const isLand = categoryId === 'terrenos';
  const isVehicle = categoryId === 'carros-maquinas' || categoryId === 'viaturas';
  const isCommercial = categoryId === 'escritorios' || categoryId === 'lojas-salas-comerciais' || categoryId === 'armazens-galpoes' || categoryId === 'saloes-eventos' || categoryId === 'contentores-modulares';
  const isResidential = isCondo || categoryId === 'casas-vivendas' || categoryId === 'apartamentos-flats';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadWebsitePhoto(files[i]);
        setPhotos(prev => [...prev, url]);
      }
    } catch {
      setErrorMsg('Erro ao carregar fotografia.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!title.trim() || !price || !district.trim()) {
      setErrorMsg('Por favor preencha todos os campos obrigatórios (Título, Preço e Distrito).');
      return;
    }

    if (photos.length === 0) {
      setErrorMsg('Por favor adicione pelo menos uma fotografia.');
      return;
    }

    let fullDescription = description.trim() || `Excelente imóvel localizado em ${district}, ${province}.`;
    if (isCondo) {
      fullDescription += `\n\n[ESPECIFICAÇÕES DO CONDOMÍNIO]:\nModalidade: ${
        condoCommercialModel === 'venda_todo' ? 'Venda do Condomínio Todo' :
        condoCommercialModel === 'arrendamento_casas' ? 'Arrendamento das Casas' :
        condoCommercialModel === 'venda_e_arrendamento' ? 'Venda e Arrendamento' : 'Venda de Casas Particulares'
      }\nÁrea Total do Condomínio: ${condoTotalAreaM2 || 0} m²\nTotal de Casas: ${condoTotalHouses || 0}\nCasas Disponíveis: ${condoAvailableHouses || 0}\nEstado: ${
        condoConstructionStatus === 'pronto_habitar' ? 'Pronto a Habitar' :
        condoConstructionStatus === 'em_obra' ? 'Em Obras' : 'Em Projeto'
      }\nSegurança: ${condoHasSecurity ? 'Sim (Portaria & Acesso)' : 'Normal'}${condoLocationReference ? `\nLocalização do Condomínio: ${condoLocationReference}` : ''}${condoHasCommonPool ? '\nPiscina Comum: Sim' : ''}${condoHasPlayground ? '\nParque Infantil: Sim' : ''}${condoHasGeneratorOrBorehole ? '\nGerador / Furo de Água Comum: Sim' : ''}`;
    }

    setSubmitting(true);
    try {
      await createWebsiteListing({
        title: title.trim(),
        transactionType,
        categoryId,
        categoryName: isCondo ? 'Condomínios Residenciais' :
                      categoryId === 'apartamentos-flats' ? 'Apartamentos e Flats' :
                      categoryId === 'casas-vivendas' ? 'Casas e Vivendas' :
                      isLand ? 'Terrenos' : 
                      categoryId === 'escritorios' ? 'Escritórios' :
                      categoryId === 'lojas-salas-comerciais' ? 'Lojas e Salas Comerciais' :
                      categoryId === 'armazens-galpoes' ? 'Armazéns e Galpões' :
                      categoryId === 'saloes-eventos' ? 'Salões de Eventos' :
                      categoryId === 'contentores-modulares' ? 'Contentores e Estruturas Modulares' :
                      isVehicle ? 'Carros e Máquinas' : 'Imóveis',
        price: Number(price),
        province,
        district: district.trim(),
        neighborhood: neighborhood.trim(),
        bedrooms: isResidential ? Number(bedrooms) : null,
        bathrooms: isResidential ? Number(bathrooms) : null,
        suites: isResidential ? Number(suites) : null,
        areaM2: Number(areaM2) || null,
        parkingSpaces: isResidential ? Number(parkingSpaces) : null,
        hasWaterAndLight,
        hasAirConditioning,
        hasPool,
        hasSecurity,
        conditionState,
        declaredDocumentation: isLand ? declaredDocumentation : null,
        vehicleBrand: isVehicle ? vehicleBrand : null,
        vehicleModel: isVehicle ? vehicleModel : null,
        vehicleYear: isVehicle ? Number(vehicleYear) : null,
        vehicleMileage: isVehicle ? Number(vehicleMileage) : null,
        vehicleFuel: isVehicle ? vehicleFuel : null,
        vehicleTransmission: isVehicle ? vehicleTransmission : null,
        description: fullDescription,
        photos,
        isAdmin,
        authorName: currentUser?.fullName || (isAdmin ? 'Administrador Oficial BNG' : currentUser?.email),
        authorPhone: currentUser?.phone || '+258 84 152 4822',
        authorWhatsapp: currentUser?.whatsapp || currentUser?.phone || '+258 88 009 6995',
        paymentConditions: {
          planType,
          downPaymentPercentage: planType === 'installments' ? downPaymentPercentage : 0,
          installmentsCount: planType === 'installments' ? installmentsCount : 0
        }
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao publicar imóvel.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 sm:pb-16 pt-4 sm:pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Cabeçalho de Navegação */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Etapa {step} de 3
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`w-6 sm:w-8 h-2 rounded-full transition-all ${
                    s <= step ? 'bg-[#D4AF37]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notificação de Sucesso */}
        {submittedSuccess ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-lg space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Anúncio Publicado com Sucesso!</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? 'Como Administrador Oficial do Grupo BNG, o seu anúncio foi gravado no Supabase e publicado imediatamente no portal e aplicativo!'
                : 'O seu anúncio foi submetido com sucesso no banco de dados e sincronizado em tempo real.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ========================================================
                ETAPA 1: CATEGORIA & CARACTERÍSTICAS
                ======================================================== */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Etapa 1: Categoria e Características do Anúncio
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecione o tipo de anúncio para carregar os campos específicos.
                  </p>
                </div>

                {/* Seleção de Negócio e Categoria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Negócio *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTransactionType('sale')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                          transactionType === 'sale'
                            ? 'bg-[#C89B3C] text-slate-950 border-[#C89B3C] shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Venda
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionType('rent')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                          transactionType === 'rent'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        Arrendamento (Renda)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B3C] bg-white"
                    >
                      <option value="casas-vivendas">1. Casas e Vivendas</option>
                      <option value="apartamentos-flats">2. Apartamentos e Flats</option>
                      <option value="condominios">3. Condomínios Residenciais</option>
                      <option value="terrenos">4. Terrenos</option>
                      <option value="escritorios">5. Escritórios</option>
                      <option value="lojas-salas-comerciais">6. Lojas e Salas Comerciais</option>
                      <option value="armazens-galpoes">7. Armazéns e Galpões</option>
                      <option value="saloes-eventos">8. Salões de Eventos</option>
                      <option value="contentores-modulares">9. Contentores e Estruturas Modulares</option>
                      <option value="carros-maquinas">10. Carros e Máquinas</option>
                    </select>
                  </div>
                </div>

                {/* Campos Específicos para Condomínios Residenciais */}
                {isCondo && (
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="text-xs font-black uppercase text-amber-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                        Características Gerais do Condomínio
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Empreendimento Global
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Modalidade Comercial do Condomínio *</label>
                        <select
                          value={condoCommercialModel}
                          onChange={(e: any) => setCondoCommercialModel(e.target.value)}
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        >
                          <option value="venda_todo">Venda do Condomínio Todo (Empreendimento Completo)</option>
                          <option value="venda_fraccoes">Venda de Casas / Fracções Individuais</option>
                          <option value="arrendamento_casas">Arrendamento das Casas Particulares</option>
                          <option value="venda_e_arrendamento">Venda e Arrendamento Simultâneo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Estado de Habitação / Obra *</label>
                        <select
                          value={condoConstructionStatus}
                          onChange={(e: any) => setCondoConstructionStatus(e.target.value)}
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        >
                          <option value="pronto_habitar">Pronto a Habitar (Concluído)</option>
                          <option value="em_obra">Ainda em Obra / Construção</option>
                          <option value="em_projeto">Em Projeto / Planta</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Área Total Condomínio (m²)</label>
                        <input
                          type="number"
                          value={condoTotalAreaM2}
                          onChange={(e) => setCondoTotalAreaM2(e.target.value)}
                          placeholder="Ex: 5000"
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Número Total de Casas *</label>
                        <input
                          type="number"
                          value={condoTotalHouses}
                          onChange={(e) => setCondoTotalHouses(e.target.value)}
                          placeholder="Ex: 8"
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Casas Disponíveis</label>
                        <input
                          type="number"
                          value={condoAvailableHouses}
                          onChange={(e) => setCondoAvailableHouses(e.target.value)}
                          placeholder="Ex: 8"
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Segurança Privada</label>
                        <select
                          value={condoHasSecurity ? 'sim' : 'nao'}
                          onChange={(e) => setCondoHasSecurity(e.target.value === 'sim')}
                          className="w-full p-2 border border-amber-200 rounded-xl text-xs font-bold bg-white"
                        >
                          <option value="sim">Sim (Portaria & Acesso 24h)</option>
                          <option value="nao">Sem Portaria / Comum</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Localização Específica do Condomínio</label>
                      <input
                        type="text"
                        value={condoLocationReference}
                        onChange={(e) => setCondoLocationReference(e.target.value)}
                        placeholder="Ex: Boane, Djonasse • Próximo à Estrada Circular"
                        className="w-full p-2 border border-amber-200 rounded-xl text-xs bg-white"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={condoHasCommonPool}
                          onChange={(e) => setCondoHasCommonPool(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Piscina Comum</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={condoHasPlayground}
                          onChange={(e) => setCondoHasPlayground(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Parque Infantil</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={condoHasGeneratorOrBorehole}
                          onChange={(e) => setCondoHasGeneratorOrBorehole(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Gerador / Furo de Água Comum</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Campos Residenciais (Moradias) */}
                {isResidential && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-xs font-extrabold uppercase text-slate-700 block">
                      {isCondo ? 'Características das Moradias Individuais do Condomínio' : 'Características Residenciais'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Quartos</label>
                        <input
                          type="number"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Casas de Banho</label>
                        <input
                          type="number"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Suítes</label>
                        <input
                          type="number"
                          value={suites}
                          onChange={(e) => setSuites(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Área Útil (m²)</label>
                        <input
                          type="number"
                          value={areaM2}
                          onChange={(e) => setAreaM2(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasWaterAndLight}
                          onChange={(e) => setHasWaterAndLight(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Água e Luz 24h</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasAirConditioning}
                          onChange={(e) => setHasAirConditioning(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Ar Condicionado</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPool}
                          onChange={(e) => setHasPool(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Piscina</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSecurity}
                          onChange={(e) => setHasSecurity(e.target.checked)}
                          className="rounded text-[#C89B3C]"
                        />
                        <span>Segurança / Guarita</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Campos Terrenos */}
                {isLand && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-xs font-extrabold uppercase text-slate-700 block">
                      Especificações do Terreno
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Dimensões (Ex: 20m x 40m)</label>
                        <input
                          type="text"
                          value={landDimensions}
                          onChange={(e) => setLandDimensions(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Documentação Declarada</label>
                        <input
                          type="text"
                          value={declaredDocumentation}
                          onChange={(e) => setDeclaredDocumentation(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={landIsFenced}
                        onChange={(e) => setLandIsFenced(e.target.checked)}
                        className="rounded text-[#C89B3C]"
                      />
                      <span>Terreno Vedado / Murado</span>
                    </label>
                  </div>
                )}

                {/* Campos Viaturas */}
                {isVehicle && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-xs font-extrabold uppercase text-slate-700 block">
                      Especificações da Viatura
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Marca</label>
                        <input
                          type="text"
                          value={vehicleBrand}
                          onChange={(e) => setVehicleBrand(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Modelo</label>
                        <input
                          type="text"
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Ano</label>
                        <input
                          type="number"
                          value={vehicleYear}
                          onChange={(e) => setVehicleYear(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Quilometragem (km)</label>
                        <input
                          type="number"
                          value={vehicleMileage}
                          onChange={(e) => setVehicleMileage(Number(e.target.value))}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#C89B3C] hover:bg-[#B6882C] text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2"
                  >
                    <span>Avançar para Fotos & Preço</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                ETAPA 2: FOTOGRAFIAS, TÍTULO, PREÇO & LOCALIZAÇÃO
                ======================================================== */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Etapa 2: Fotografias, Título e Localização
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adicione fotos de alta qualidade e preencha os detalhes do imóvel.
                  </p>
                </div>

                {/* Upload de Fotos */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Fotografias ({photos.length} adicionadas) *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                        <img src={url} alt="Foto" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}

                    <label className="aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-[#C89B3C] flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
                      <Plus className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {uploading ? 'Carregando...' : '+ Foto'}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Título do Anúncio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vivenda T3 com Piscina e Dependência no Triunfo"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* Preço e Província */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço em Meticais (MT) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 3500000"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Província *</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B3C] bg-white"
                    >
                      {PROVINCES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Distrito e Bairro */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Distrito / Município *</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Ex: Matola, KaMavota, Boane"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bairro / Zona</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Fomento, Triunfo, Djuba"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição do Imóvel</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhes adicionais sobre o imóvel, acabamentos, localização..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C] resize-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                  >
                    ← Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#C89B3C] hover:bg-[#B6882C] text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2"
                  >
                    <span>Avançar para Moderação / Taxa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                ETAPA 3: MODERAÇÃO / TAXA 150 MT OU ISENÇÃO ADMIN
                ======================================================== */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Etapa 3: Moderação e Publicação
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Revise os termos e conclua a publicação no Grupo BNG.
                  </p>
                </div>

                {isAdmin ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-xs sm:text-sm">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-base font-extrabold text-emerald-950 mb-1">
                        Publicação Direta como Administrador (Isento de Taxas)
                      </strong>
                      <p className="font-medium text-emerald-800 leading-relaxed">
                        Como administrador autenticado do Grupo BNG, o seu imóvel será publicado diretamente na base de dados Supabase e ficará visível de imediato para todos os visitantes do portal e utilizadores do aplicativo móvel.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs sm:text-sm text-amber-950">
                    <div className="flex items-center gap-2 font-black text-amber-900">
                      <Sparkles className="w-5 h-5 text-[#C89B3C]" />
                      <span>Taxa Única Oficial de Moderação: 150 MT</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Para manter a veracidade e prevenir anúncios falsos, efetue a transferência de 150 MT para as contas oficiais:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs">
                        <span className="font-bold block text-slate-900">M-Pesa Oficial</span>
                        <span className="font-mono text-sm text-[#C89B3C] font-extrabold">84 152 4822</span>
                        <span className="block text-[10px] text-slate-400">Titular: Grupo BNG</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs">
                        <span className="font-bold block text-slate-900">e-Mola Oficial</span>
                        <span className="font-mono text-sm text-emerald-600 font-extrabold">86 525 2525</span>
                        <span className="block text-[10px] text-slate-400">Titular: Grupo BNG</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumo do Anúncio */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold uppercase text-slate-500 block text-[10px]">Resumo do Anúncio</span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Título:</span>
                    <strong className="text-slate-900">{title || 'Sem título'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Preço:</span>
                    <strong className="text-slate-900">{Number(price).toLocaleString()} MT {transactionType === 'rent' ? '/mês' : ''}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Localização:</span>
                    <strong className="text-slate-900">{district}, {province}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Fotografias:</span>
                    <strong className="text-slate-900">{photos.length} fotos anexadas</strong>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2"
                  >
                    ← Voltar
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-950 font-black px-8 py-3 rounded-xl text-xs sm:text-sm shadow-lg hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <span>A Publicar Imóvel...</span>
                    ) : (
                      <span>{isAdmin ? 'Publicar Imediatamente como Admin' : 'Submeter e Concluir Anúncio'}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
