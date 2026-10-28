import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchCategories } from '../services/supabase';
import { Category } from '../types';
import { MOZAMBIQUE_PROVINCES } from '../data/mockData';
import { ArrowLeft, Search, RotateCcw, MapPin, DollarSign, Home, Sliders } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { navigateTo, searchFilters, setSearchFilters } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Estados do formulário de pesquisa
  const [query, setQuery] = useState(searchFilters.searchQuery || '');
  const [selectedCat, setSelectedCat] = useState(searchFilters.categoryId || '');
  const [selectedProvince, setSelectedProvince] = useState(searchFilters.province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchFilters.district || '');
  const [transactionType, setTransactionType] = useState<string>(searchFilters.transactionType || '');
  const [minPrice, setMinPrice] = useState<string>(searchFilters.minPrice ? String(searchFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(searchFilters.maxPrice ? String(searchFilters.maxPrice) : '');
  const [bedrooms, setBedrooms] = useState<number | undefined>(searchFilters.bedrooms);
  const [planType, setPlanType] = useState<string>(searchFilters.planType || '');

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedDistrict(''); // Reseta distrito se mudar província
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCat('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setTransactionType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms(undefined);
    setPlanType('');
  };

  const handleApply = () => {
    const filters = {
      searchQuery: query.trim() || undefined,
      categoryId: selectedCat || undefined,
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      transactionType: transactionType || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms,
      planType: planType || undefined,
    };
    setSearchFilters(filters);
    navigateTo('search-results', { filters });
  };

  const availableDistricts = selectedProvince ? (MOZAMBIQUE_PROVINCES[selectedProvince] || []) : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 sm:pb-12">
      {/* Top Header */}
      <div className="bg-[#14181B] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-base tracking-tight text-white">
              Pesquisar Imóveis
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-[#C89B3C] hover:underline font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-5">
        {/* Campo de Palavra-chave */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Palavra-chave ou Referência
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: T3 Triunfo, Terreno Marracuene, Prado..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Tipo de Transação */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '', label: 'Todos' },
              { id: 'sale', label: 'Comprar' },
              { id: 'rent', label: 'Arrendar' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTransactionType(t.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  transactionType === t.id
                    ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C] shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categoria */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Categoria do Imóvel ou Bem
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCat('')}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all ${
                selectedCat === ''
                  ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C]'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todas as categorias
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold text-left flex items-center space-x-1.5 transition-all ${
                  selectedCat === cat.id
                    ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Localização Estruturada em Moçambique */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-1.5 mb-2">
            <MapPin className="w-4 h-4 text-[#C89B3C]" />
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Localização em Moçambique
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Província</label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#C89B3C]"
              >
                <option value="">Todas as Províncias</option>
                {Object.keys(MOZAMBIQUE_PROVINCES).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {selectedProvince && (
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Distrito / Município</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#C89B3C]"
                >
                  <option value="">Todos os Distritos de {selectedProvince}</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Faixa de Preço em Meticais (MT) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-1.5 mb-2">
            <DollarSign className="w-4 h-4 text-[#C89B3C]" />
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Intervalo de Preço (Meticais MT)
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] text-slate-500 mb-1">Mínimo (MT)</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Ex: 50.000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 mb-1">Máximo (MT)</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Ex: 5.000.000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
          </div>
        </div>

        {/* Quartos & Condição de Pagamento */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Quartos (Mínimo)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[undefined, 1, 2, 3, 4].map((num) => (
                <button
                  key={num === undefined ? 'all' : num}
                  type="button"
                  onClick={() => setBedrooms(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    bedrooms === num
                      ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {num === undefined ? 'Qualquer' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Condição de Pagamento do Imóvel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '', label: 'Qualquer' },
                { id: 'full', label: 'Integral' },
                { id: 'installments', label: 'Prestações' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanType(p.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    planType === p.id
                      ? 'bg-[#14181B] text-[#C89B3C] border border-[#C89B3C]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Aplicação */}
        <button
          type="button"
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-[#C89B3C] to-[#E5B95C] text-[#14181B] py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Ver Resultados</span>
        </button>
      </div>
    </div>
  );
};
