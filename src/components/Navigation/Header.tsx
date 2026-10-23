import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  GraduationCap,
  Building2,
  Train,
  ChevronDown,
  X,
  PlusCircle,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MOROCCO_CITIES, SearchSuggestion, searchMoroccoLocations } from '../../data/moroccoCities';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenPublish: () => void;
  activeListingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  onSelectSuggestion,
  favoritesCount,
  onOpenFavorites,
  onOpenPublish,
  activeListingCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOtherCitiesOpen, setIsOtherCitiesOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Top destination chips as requested in spec
  const topDestinations = [
    { key: 'Casablanca', label: 'Casablanca', badge: null },
    { key: 'Rabat', label: 'Rabat', badge: null },
    { key: 'Benguerir', label: 'Benguerir', badge: 'UM6P' },
    { key: 'Tanger', label: 'Tanger', badge: 'TGV' },
    { key: 'Marrakech', label: 'Marrakech', badge: null },
    { key: 'Kénitra', label: 'Kénitra', badge: 'AFZ' },
  ];

  // Other cities for dropdown
  const otherCities = Object.keys(MOROCCO_CITIES).filter(
    (key) => !topDestinations.some((d) => d.key === key)
  );

  // Handle autocomplete query input
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 1) {
      const results = searchMoroccoLocations(val);
      setSuggestions(results);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOtherCitiesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onSelectSuggestion(suggestion);
    setSearchQuery(suggestion.title);
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
  };

  const getSuggestionIcon = (type: string, title: string) => {
    if (type === 'city') return <MapPin className="w-4 h-4 text-brand-600" />;
    if (type === 'neighborhood') return <MapPin className="w-4 h-4 text-emerald-500" />;
    if (title.toLowerCase().includes('gare') || title.toLowerCase().includes('tgv')) {
      return <Train className="w-4 h-4 text-purple-600" />;
    }
    if (
      title.toLowerCase().includes('université') ||
      title.toLowerCase().includes('um6p') ||
      title.toLowerCase().includes('faculté') ||
      title.toLowerCase().includes('1337') ||
      title.toLowerCase().includes('campus')
    ) {
      return <GraduationCap className="w-4 h-4 text-amber-500" />;
    }
    return <Building2 className="w-4 h-4 text-blue-500" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar: Brand, Search Bar & Main CTAs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => onSelectCity('Benguerir')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 p-0.5 shadow-md flex items-center justify-center text-white font-extrabold text-xl tracking-tight">
            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <path d="M50 16 C36.2 16 25 27.2 25 41 C25 57 46 78 48.5 80.5 C49.3 81.3 50.7 81.3 51.5 80.5 C54 78 75 57 75 41 C75 27.2 63.8 16 50 16 Z" fill="white"/>
              <path d="M50 28 L37 38 L37 54 L63 54 L63 38 Z" fill="#13855a"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                Kribla<span className="text-brand-600">Semsar</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                0% Semsar
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block -mt-0.5">
              Toute colocation sans intermédiaire au Maroc • <span className="font-semibold text-slate-700" dir="rtl">كْري بلا سمسار</span>
            </p>
          </div>
        </div>

        {/* Desktop Global Hero Search Input with Instant Autocomplete */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-lg mx-3 relative">
          <div className="w-full relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 1) setIsDropdownOpen(true);
              }}
              placeholder="🔍 Ville, quartier, université ou gare..."
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200/90 focus:border-brand-500 rounded-full pl-10 pr-9 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setIsDropdownOpen(false);
                }}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] font-bold text-slate-500 px-3">
                <span>Suggestions ({suggestions.length})</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Toutes villes du Maroc</span>
              </div>
              <div className="py-1">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getSuggestionIcon(item.type, item.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-600 shrink-0 bg-brand-50 px-2 py-0.5 rounded-full">
                      Aller
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            title="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex items-center justify-center"
            title="Mes favoris"
          >
            <Heart className="w-5 h-5 text-slate-600" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Post Listing CTA (Direct Moul Dar / Coloc) */}
          <button
            onClick={onOpenPublish}
            className="bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Déposer une annonce</span>
          </button>

          {/* User profile avatar */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profil"
              className="w-8 h-8 rounded-full border border-slate-300 object-cover"
            />
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-800 leading-none">Mehdi B.</p>
              <p className="text-[10px] text-emerald-600 font-medium">Particulier certifié</p>
            </div>
          </div>

        </div>

      </div>

      {/* Row 2: Nationwide Quick-Jump Chips (Casablanca, Rabat, Benguerir UM6P, Tanger, Marrakech, Kénitra, Autres Villes ▾) */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-none flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline mr-1">
            Destinations :
          </span>

          {topDestinations.map((dest) => {
            const isSelected = selectedCity.toLowerCase() === dest.key.toLowerCase();
            return (
              <button
                key={dest.key}
                onClick={() => onSelectCity(dest.key)}
                className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold scale-[1.02] shadow-sm'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-emerald-400' : 'text-brand-600'}`} />
                <span>{dest.label}</span>
                {dest.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {dest.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Autres Villes Dropdown */}
          <div ref={dropdownRef} className="relative inline-block text-left">
            <button
              onClick={() => setIsOtherCitiesOpen(!isOtherCitiesOpen)}
              className="px-3 py-1 rounded-full text-xs bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 font-semibold transition-all flex items-center gap-1 whitespace-nowrap"
            >
              <span>Autres villes ({otherCities.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isOtherCitiesOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-72 overflow-y-auto animate-in fade-in duration-100">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Toutes les villes du Maroc
                </div>
                {otherCities.map((cKey) => {
                  const city = MOROCCO_CITIES[cKey];
                  return (
                    <button
                      key={cKey}
                      onClick={() => {
                        onSelectCity(cKey);
                        setIsOtherCitiesOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{city.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400" dir="rtl">
                        {city.arabicName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live Active Moroccan Listings Pill */}
        <div className="text-[11px] font-semibold text-slate-500 hidden lg:flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>
            <strong className="text-slate-800">{activeListingCount}</strong> logements directs à {selectedCity}
          </span>
        </div>
      </div>

      {/* Mobile Search Overlay Drawer */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 p-4 flex flex-col md:hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Ville, campus (UM6P...), quartier..."
                className="w-full text-sm font-bold text-slate-900 focus:outline-none"
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions list */}
            <div className="overflow-y-auto flex-1 mt-2 space-y-1">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getSuggestionIcon(item.type, item.title)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Recherchez dans tout le Maroc :</p>
                  <p className="text-[11px] mt-1 text-slate-400">
                    ex: "Benguerir", "UM6P", "Agdal", "Casa Finance City", "Tanger Malabata", "Guéliz"...
                  </p>
                </div>
              )}
            </div>

            {/* Quick Cities Grid in Mobile Search */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Villes populaires :
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {topDestinations.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => {
                      onSelectCity(d.key);
                      setIsMobileSearchOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
