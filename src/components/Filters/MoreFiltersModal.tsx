import React from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { FilterState, GenderPreference, OccupantTypePreference } from '../../types';

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (partial: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const MoreFiltersModal: React.FC<MoreFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">Plus de Filtres de Recherche</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 text-xs">
          
          {/* Budget Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span>Budget Maximum :</span>
              <span className="text-emerald-700 text-sm font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {filters.max_price >= 10000 ? '10 000+ DH/mois' : `${filters.max_price.toLocaleString('fr-FR')} DH/mois`}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="200"
              value={filters.max_price}
              onChange={(e) => onUpdateFilters({ max_price: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>1 000 DH</span>
              <span>5 000 DH</span>
              <span>10 000+ DH</span>
            </div>
          </div>

          {/* Sexe souhaité */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Sexe souhaité dans la coloc :</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'Indifférent / Mixte' },
                { id: 'female_only', label: '👩 Filles uniq.' },
                { id: 'male_only', label: '👨 Garçons uniq.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ gender_preference: opt.id as GenderPreference | 'all' })}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    filters.gender_preference === opt.id
                      ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profil recherché */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Profil d'occupant :</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Tous profils' },
                { id: 'students', label: '🎓 Étudiants / PhD' },
                { id: 'professionals', label: '💼 Jeunes Actifs' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ occupant_preference: opt.id as OccupantTypePreference | 'all' })}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    filters.occupant_preference === opt.id
                      ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ameublement */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Ameublement :</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: null, label: 'Indifférent' },
                { value: true, label: '🛋️ Meublé' },
                { value: false, label: '📦 Non meublé' },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onUpdateFilters({ furnished: opt.value })}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    filters.furnished === opt.value
                      ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commodités & Critères détaillés */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">Équipements & Règles :</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fiber_only}
                  onChange={(e) => onUpdateFilters({ fiber_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">⚡ Fibre Optique / WiFi</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.private_bathroom_only}
                  onChange={(e) => onUpdateFilters({ private_bathroom_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🚿 SDB Privative</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ac_only}
                  onChange={(e) => onUpdateFilters({ ac_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">❄️ Climatisation</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.washing_machine_only}
                  onChange={(e) => onUpdateFilters({ washing_machine_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🧺 Machine à laver</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.parking_only}
                  onChange={(e) => onUpdateFilters({ parking_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🚗 Parking</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.balcony_only}
                  onChange={(e) => onUpdateFilters({ balcony_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🌿 Balcon / Terrasse</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.non_smoker_only}
                  onChange={(e) => onUpdateFilters({ non_smoker_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🚭 Non-fumeurs</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.pets_allowed_only}
                  onChange={(e) => onUpdateFilters({ pets_allowed_only: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-medium">🐾 Animaux bienvenus</span>
              </label>
            </div>
          </div>

          {/* Dynamic Bounding Box toggle */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={filters.search_as_move}
                onChange={(e) => onUpdateFilters({ search_as_move: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>🗺️ Rechercher quand je déplace la carte</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1 pl-6">
              Filtre automatiquement les annonces visibles dans le champ de la carte GPS.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            onClick={onClose}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            <span>Afficher {totalResults} annonce{totalResults > 1 ? 's' : ''}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
