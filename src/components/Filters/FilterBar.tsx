import React, { useState } from 'react';
import { SlidersHorizontal, Check, RotateCcw, MapPin } from 'lucide-react';
import { FilterState, ListingType } from '../../types';
import { CITIES } from '../../data/mockData';
import { MoreFiltersModal } from './MoreFiltersModal';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (partial: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalResults,
}) => {
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const currentCityConfig = CITIES[filters.city] || CITIES.Casablanca;

  const typeOptions: { id: ListingType | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tous', icon: '🏠' },
    { id: 'colocation_room', label: 'Chambres en Coloc', icon: '🔵' },
    { id: 'full_apartment', label: 'Logements Entiers', icon: '🟢' },
    { id: 'roommate_search', label: 'Recherche Coloc', icon: '🟠' },
  ];

  const budgetOptions = [
    { label: 'Tous les prix', value: 15000 },
    { label: '< 2 000 DH', value: 2000 },
    { label: '< 3 000 DH', value: 3000 },
    { label: '< 4 000 DH', value: 4000 },
    { label: '< 5 000 DH', value: 5000 },
    { label: '< 7 000 DH', value: 7000 },
  ];

  // Count active extra filters
  const extraFiltersCount = [
    filters.private_bathroom_only,
    filters.ac_only,
    filters.washing_machine_only,
    filters.elevator_only,
    filters.parking_only,
    filters.balcony_only,
    filters.pets_allowed_only,
    filters.non_smoker_only,
    filters.occupant_preference !== 'all' && filters.occupant_preference !== 'any',
  ].filter(Boolean).length;

  const hasActiveFilters =
    filters.listing_type !== 'all' ||
    filters.max_price < 15000 ||
    filters.neighborhood !== 'Tous les quartiers' ||
    filters.gender_preference !== 'all' ||
    filters.fiber_only ||
    filters.charges_included_only ||
    filters.furnished !== null ||
    extraFiltersCount > 0;

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-sm space-y-2">
      
      {/* Row 1: Type Selection, Neighborhood Dropdown & More Filters */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        
        {/* Listing Type Segmented Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onUpdateFilters({ listing_type: opt.id })}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filters.listing_type === opt.id
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-xs">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Neighborhood, Budget & More Filters */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Neighborhood Selector */}
          <select
            value={filters.neighborhood}
            onChange={(e) => onUpdateFilters({ neighborhood: e.target.value })}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {currentCityConfig.neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Budget dropdown */}
          <select
            value={filters.max_price}
            onChange={(e) => onUpdateFilters({ max_price: Number(e.target.value) })}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {budgetOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>

          {/* More Filters Modal Trigger Button */}
          <button
            onClick={() => setIsMoreFiltersOpen(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all relative ${
              extraFiltersCount > 0
                ? 'bg-brand-50 text-brand-800 border-brand-500 ring-2 ring-brand-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
            <span>Filtres</span>
            {extraFiltersCount > 0 && (
              <span className="w-4 h-4 bg-brand-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {extraFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Moroccan-Specific Quick Filter Chips & Bounding Box Checkbox */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pt-0.5">
        <div className="flex items-center gap-1.5 text-xs">
          
          {/* Fibre Optique Chip */}
          <button
            onClick={() => onUpdateFilters({ fiber_only: !filters.fiber_only })}
            className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap font-medium ${
              filters.fiber_only
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>⚡ Fibre Optique</span>
            {filters.fiber_only && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Charges Comprises Chip */}
          <button
            onClick={() => onUpdateFilters({ charges_included_only: !filters.charges_included_only })}
            className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap font-medium ${
              filters.charges_included_only
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>💡 Charges incluses</span>
            {filters.charges_included_only && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Filles uniquement Chip */}
          <button
            onClick={() =>
              onUpdateFilters({
                gender_preference:
                  filters.gender_preference === 'female_only' ? 'all' : 'female_only',
              })
            }
            className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap font-medium ${
              filters.gender_preference === 'female_only'
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>👩 Filles uniquement</span>
            {filters.gender_preference === 'female_only' && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Meublé Chip */}
          <button
            onClick={() => onUpdateFilters({ furnished: filters.furnished === true ? null : true })}
            className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap font-medium ${
              filters.furnished === true
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>🛋️ Meublé</span>
            {filters.furnished === true && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Dynamic Bounding Box Checkbox */}
          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium cursor-pointer whitespace-nowrap hover:bg-slate-100">
            <input
              type="checkbox"
              checked={filters.search_as_move}
              onChange={(e) => onUpdateFilters({ search_as_move: e.target.checked })}
              className="w-3.5 h-3.5 text-brand-600 rounded"
            />
            <span className="text-[11px]">Rechercher quand je déplace la carte</span>
          </label>

        </div>

        {/* Results Counter & Reset Filter */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
          <span className="hidden sm:inline">
            <strong className="text-slate-800">{totalResults}</strong> annonce{totalResults > 1 ? 's' : ''} sans semsar
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* More Filters Modal Drawer */}
      <MoreFiltersModal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
        filters={filters}
        onUpdateFilters={onUpdateFilters}
        onResetFilters={onResetFilters}
        totalResults={totalResults}
      />

    </div>
  );
};
