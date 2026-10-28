import React, { useState } from 'react';
import { Search, MapPin, Home, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Category, ListingFilters } from '../types';

interface HeroSearchProps {
  categories: Category[];
  onSearch: (filters: ListingFilters) => void;
}

const PROVINCES = [
  'Todas as Províncias',
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

export const HeroSearch: React.FC<HeroSearchProps> = ({ categories, onSearch }) => {
  const [transactionType, setTransactionType] = useState<'all' | 'sale' | 'rent'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas as Províncias');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      transactionType: transactionType === 'all' ? undefined : transactionType,
      province: selectedProvince === 'Todas as Províncias' ? undefined : selectedProvince,
      categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
      searchQuery: searchQuery.trim() || undefined
    });
  };

  const handleQuickTag = (tag: string, cat?: string, prov?: string) => {
    setSearchQuery(tag);
    if (cat) setSelectedCategory(cat);
    if (prov) setSelectedProvince(prov);
    onSearch({
      searchQuery: tag,
      categoryId: cat,
      province: prov
    });
  };

  return (
    <div className="relative bg-[#14181B] text-white overflow-hidden py-16 sm:py-24 border-b border-white/10">
      {/* Background decorativo com imagem nobre e overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80" 
          alt="Imóveis de Luxo Moçambique"
          className="w-full h-full object-cover opacity-20 filter brightness-75 scale-105 transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181B] via-[#14181B]/85 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C89B3C]/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 text-center">
        {/* Badge Institucional */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-[#C89B3C]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F3C35B] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span>Líder em Gestão Imobiliária & Soluções Corporativas</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Encontre o Seu Imóvel dos Sonhos em <span className="gold-gradient-text">Moçambique</span>
        </h1>
        <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Compre, venda e arrende casas, terrenos e escritórios com a transparência, segurança jurídica e assessoria especializada do Grupo BNG.
        </p>

        {/* Caixa de Busca Principal (Desktop Card) */}
        <div className="mt-10 bg-white rounded-3xl p-3 sm:p-5 shadow-2xl text-slate-800 border border-slate-100 max-w-5xl mx-auto">
          {/* Abas: Todos / Comprar / Arrendar */}
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setTransactionType('all')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transactionType === 'all'
                  ? 'bg-[#14181B] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos os Negócios
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transactionType === 'sale'
                  ? 'bg-[#C89B3C] text-[#14181B] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Comprar (Venda)
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('rent')}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transactionType === 'rent'
                  ? 'bg-[#C89B3C] text-[#14181B] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Arrendar (Aluguer)
            </button>
          </div>

          {/* Campos do Formulário */}
          <form onSubmit={handleApplySearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Campo 1: Texto livre / Palavra-chave */}
            <div className="sm:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:border-[#C89B3C] transition-colors">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">O que procura?</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Djonasse, Triunfo, T3, Piscina..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Campo 2: Província / Região */}
            <div className="sm:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:border-[#C89B3C] transition-colors">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Localização</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none cursor-pointer"
                >
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo 3: Categoria do Imóvel */}
            <div className="sm:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center space-x-2.5 focus-within:border-[#C89B3C] transition-colors">
              <Home className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Tipo de Imóvel</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botão de Pesquisa */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-full min-h-[50px] bg-[#C89B3C] hover:bg-[#B6882C] text-[#14181B] font-extrabold rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Pesquisar</span>
              </button>
            </div>
          </form>

          {/* Tags de Pesquisa Rápida */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500 text-left">
            <span className="font-semibold text-slate-700">Mais pesquisados:</span>
            <button 
              type="button"
              onClick={() => handleQuickTag('Djonasse', 'terrenos', 'Maputo Província')}
              className="bg-slate-100 hover:bg-[#C89B3C]/20 hover:text-[#C89B3C] px-2.5 py-1 rounded-lg transition-colors"
            >
              Terreno em Djonasse
            </button>
            <button 
              type="button"
              onClick={() => handleQuickTag('Triunfo', 'casas', 'Maputo Cidade')}
              className="bg-slate-100 hover:bg-[#C89B3C]/20 hover:text-[#C89B3C] px-2.5 py-1 rounded-lg transition-colors"
            >
              Moradia no Triunfo Velho
            </button>
            <button 
              type="button"
              onClick={() => handleQuickTag('Polana', 'apartamentos', 'Maputo Cidade')}
              className="bg-slate-100 hover:bg-[#C89B3C]/20 hover:text-[#C89B3C] px-2.5 py-1 rounded-lg transition-colors"
            >
              Apartamento na Polana
            </button>
            <button 
              type="button"
              onClick={() => handleQuickTag('Matola', undefined, 'Maputo Província')}
              className="bg-slate-100 hover:bg-[#C89B3C]/20 hover:text-[#C89B3C] px-2.5 py-1 rounded-lg transition-colors"
            >
              Imóveis na Matola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
