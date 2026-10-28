import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Category, UserProfile } from '../types';
import { uploadWebsitePhoto, createWebsiteListing } from '../services/supabase';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  user?: UserProfile | null;
  currentUser?: UserProfile | null;
  onRequireAuth?: () => void;
  onListingCreated?: () => void;
  onSuccess?: () => void;
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

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  categories,
  user,
  currentUser,
  onRequireAuth,
  onListingCreated,
  onSuccess
}) => {
  if (!isOpen) return null;

  const activeUser = user || currentUser;

  // Se não estiver logado, pede para logar primeiro
  if (!activeUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#C89B3C]/20 border border-[#C89B3C] text-[#C89B3C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Registo Necessário para Publicar</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Para garantir a segurança, autenticidade dos anúncios e proteção contra fraudes, é necessário iniciar sessão ou registar-se antes de publicar no Grupo BNG.
          </p>
          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => {
                onClose();
                if (onRequireAuth) onRequireAuth();
              }}
              className="w-full py-3 bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              Iniciar Sessão / Criar Conta
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = activeUser?.role === 'admin';

  const [title, setTitle] = useState('');
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>('sale');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'casas');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState('Maputo Cidade');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaM2, setAreaM2] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadWebsitePhoto(files[i]);
        setPhotos(prev => [...prev, url]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro ao carregar fotografia.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !price || !district.trim()) {
      setErrorMsg('Por favor preencha os campos obrigatórios (Título, Preço e Distrito).');
      return;
    }

    if (photos.length === 0) {
      setErrorMsg('Por favor adicione pelo menos uma fotografia do imóvel.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCatObj = categories.find(c => c.id === categoryId || (c as any).slug === categoryId);

      await createWebsiteListing({
        title: title.trim(),
        transactionType,
        categoryId,
        categoryName: selectedCatObj?.name || 'Casas',
        price: Number(price),
        province,
        district: district.trim(),
        neighborhood: neighborhood.trim(),
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        areaM2: areaM2 ? Number(areaM2) : null,
        description: description.trim() || `Excelente imóvel localizado em ${district}, ${province}.`,
        photos,
        isAdmin,
        authorName: activeUser.fullName || (isAdmin ? 'Administrador BNG' : activeUser.email),
        authorPhone: activeUser.phone || '+258 84 152 4822',
        authorWhatsapp: activeUser.phone || '+258 88 009 6995'
      });

      setSuccess(true);
      if (onListingCreated) onListingCreated();
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao submeter anúncio.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="bg-[#14181B] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black">Publicar Novo Imóvel no Grupo BNG</h3>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-900 text-[10px] font-extrabold uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              Anunciante: <strong>{activeUser.fullName || activeUser.email}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        {success ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900">Imóvel Publicado com Sucesso!</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isAdmin
                ? 'O imóvel foi publicado imediatamente no banco de dados e já está visível no website e no aplicativo Android.'
                : 'O seu imóvel foi gravado no banco de dados Supabase e já está pronto para visualização pública e no aplicativo.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Aviso sobre a Taxa ou Isenção de Admin */}
            {isAdmin ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Publicação Direta como Administrador (Isento)</strong>
                  <span className="font-light">
                    Como administrador oficial, a sua publicação é aprovada automaticamente e sincronizada em tempo real no portal e aplicativo nativo.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900 text-xs">
                <span className="text-lg shrink-0">ℹ️</span>
                <div>
                  <strong className="block font-bold">Taxa Oficial de Publicação: 150 MT</strong>
                  <span className="font-light">
                    Conforme a política do Grupo BNG, anúncios submetidos passam por conferência da taxa única de moderação de 150 MT via M-Pesa / e-Mola.
                  </span>
                </div>
              </div>
            )}

            {/* Título */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Anúncio *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Moradia T3 com Piscina no Bairro Triunfo"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
              />
            </div>

            {/* Tipo de Negócio e Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Negócio *</label>
                <select
                  value={transactionType}
                  onChange={(e: any) => setTransactionType(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
                >
                  <option value="sale">Venda</option>
                  <option value="rent">Arrendamento (Aluguer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={(c as any).slug || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preço e Província */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço em Meticais (MT) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 4500000"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Província *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
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
                  placeholder="Ex: KaMpfumo / Matola"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bairro / Zona</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Triunfo, Sommerchield, Fomento"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quartos</label>
                <input
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="Ex: 3"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">WCs</label>
                <input
                  type="number"
                  min={0}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="Ex: 2"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Área (m²)</label>
                <input
                  type="number"
                  min={0}
                  value={areaM2}
                  onChange={(e) => setAreaM2(e.target.value)}
                  placeholder="Ex: 250"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#C89B3C]"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Detalhada</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhes como água 24h, segurança, acabamentos, documentação..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none focus:border-[#C89B3C] resize-none"
              ></textarea>
            </div>

            {/* Upload de Fotografias */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fotografias do Imóvel ({photos.length} adicionadas) *
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {photos.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img src={url} alt="Foto imóvel" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#14181B]/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
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
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Botão de Submeter */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="bg-gradient-to-r from-[#D4AF37] to-[#C89B3C] text-slate-900 font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <span>A Publicar Imóvel...</span>
                ) : (
                  <span>{isAdmin ? 'Publicar Imediatamente' : 'Submeter Anúncio'}</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
