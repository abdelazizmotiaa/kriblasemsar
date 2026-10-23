import React, { useState, useMemo } from 'react';
import {
  Map as MapIcon,
  List as ListIcon,
  Search,
  Heart,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { Listing, FilterState, MapBounds } from './types';
import { INITIAL_LISTINGS, CITIES } from './data/mockData';
import { SearchSuggestion } from './data/moroccoCities';
import { Header } from './components/Navigation/Header';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { FilterBar } from './components/Filters/FilterBar';
import { ListingCard } from './components/Listings/ListingCard';
import { InteractiveMap } from './components/Map/InteractiveMap';
import { ListingDetailModal } from './components/Modals/ListingDetailModal';
import { CallConditionsModal } from './components/Modals/CallConditionsModal';
import { PublishWizardModal } from './components/Modals/PublishWizardModal';

export const App: React.FC = () => {
  // Master State with LocalStorage Persistence
  const [selectedCity, setSelectedCity] = useState<string>('Benguerir');
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('kriblasemsar_user_listings');
      if (saved) {
        const userListings: Listing[] = JSON.parse(saved);
        return [...userListings, ...INITIAL_LISTINGS];
      }
    } catch {}
    return INITIAL_LISTINGS;
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('kriblasemsar_favs') || localStorage.getItem('kriblasemsa_favs');
      return saved ? new Set(JSON.parse(saved)) : new Set(['bg-1', 'cb-1']);
    } catch {
      return new Set(['bg-1', 'cb-1']);
    }
  });

  // Mobile navigation state
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'explore' | 'favorites' | 'alerts' | 'profile'>('explore');

  // Selected & Hovered listings for Map Sync
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  // Map Bounds for dynamic "Search as I move the map"
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [targetFlyTo, setTargetFlyTo] = useState<{
    center: [number, number];
    zoom: number;
    timestamp: number;
  } | null>(null);

  // Modals state
  const [callModalListing, setCallModalListing] = useState<Listing | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const defaultFilters: FilterState = {
    city: 'Benguerir',
    listing_type: 'all',
    max_price: 15000,
    min_price: 0,
    gender_preference: 'all',
    occupant_preference: 'all',
    furnished: null,
    fiber_only: false,
    charges_included_only: false,
    neighborhood: 'Tous les quartiers',
    search_query: '',
    private_bathroom_only: false,
    ac_only: false,
    washing_machine_only: false,
    elevator_only: false,
    parking_only: false,
    balcony_only: false,
    pets_allowed_only: false,
    non_smoker_only: false,
    search_as_move: true,
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Keep city in sync with filters
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setMapBounds(null); // reset bounds on city jump
    setFilters((prev) => ({
      ...prev,
      city,
      neighborhood: 'Tous les quartiers',
    }));
  };

  // Autocomplete selection handler (fly directly to city, campus, or neighborhood)
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSelectedCity(suggestion.cityKey);
    setMapBounds(null);
    setFilters((prev) => ({
      ...prev,
      city: suggestion.cityKey,
      neighborhood: suggestion.neighborhood || 'Tous les quartiers',
    }));
    setTargetFlyTo({
      center: suggestion.coordinates,
      zoom: suggestion.zoom,
      timestamp: Date.now(),
    });
    showToast(`📍 ${suggestion.title}`);
  };

  // Update favorites in localStorage
  const handleToggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
        showToast('Retiré des favoris');
      } else {
        next.add(listingId);
        showToast('Ajouté à vos favoris ❤️');
      }
      try {
        localStorage.setItem('kriblasemsar_favs', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Tab favorites filter
      if (activeTab === 'favorites' && !favorites.has(item.id)) {
        return false;
      }

      // City filter
      if (item.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Neighborhood filter
      if (filters.neighborhood !== 'Tous les quartiers' && item.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Type filter
      if (filters.listing_type !== 'all' && item.listing_type !== filters.listing_type) {
        return false;
      }

      // Price filter
      if (item.price_amount > filters.max_price || item.price_amount < filters.min_price) {
        return false;
      }

      // Gender filter
      if (filters.gender_preference !== 'all' && item.gender_preference !== filters.gender_preference && item.gender_preference !== 'mixed') {
        return false;
      }

      // Occupant preference
      if (filters.occupant_preference !== 'all' && filters.occupant_preference !== 'any') {
        if (item.occupant_type_preference !== filters.occupant_preference && item.occupant_type_preference !== 'any') {
          return false;
        }
      }

      // Fiber only
      if (filters.fiber_only && !item.amenities.wifi_fiber) {
        return false;
      }

      // Charges included only
      if (filters.charges_included_only && !item.charges_included) {
        return false;
      }

      // Furnished
      if (filters.furnished !== null && item.furnished !== filters.furnished) {
        return false;
      }

      // Extra Amenities Filters
      if (filters.private_bathroom_only && !item.amenities.private_bathroom) return false;
      if (filters.ac_only && !item.amenities.ac) return false;
      if (filters.washing_machine_only && !item.amenities.washing_machine) return false;
      if (filters.elevator_only && !item.amenities.elevator) return false;
      if (filters.parking_only && !item.amenities.parking) return false;
      if (filters.balcony_only && !item.amenities.balcony) return false;
      if (filters.non_smoker_only && !item.house_rules?.non_smoker) return false;
      if (filters.pets_allowed_only && !item.house_rules?.pets_allowed) return false;

      // Dynamic Bounding Box filter (when enabled and bounds active)
      if (filters.search_as_move && mapBounds) {
        const inLat = item.latitude <= mapBounds.north && item.latitude >= mapBounds.south;
        const inLng = item.longitude <= mapBounds.east && item.longitude >= mapBounds.west;
        if (!inLat || !inLng) return false;
      }

      // Search query
      if (filters.search_query.trim()) {
        const q = filters.search_query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesNeigh = item.neighborhood.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesNeigh) return false;
      }

      return true;
    });
  }, [listings, selectedCity, filters, activeTab, favorites, mapBounds]);

  // Handle New Listing from Wizard with Persistence
  const handlePublishListing = (newListing: Listing) => {
    setListings((prev) => {
      const updated = [newListing, ...prev];
      try {
        const userCreated = updated.filter((l) => l.id.startsWith('new-'));
        localStorage.setItem('kriblasemsar_user_listings', JSON.stringify(userCreated));
      } catch {}
      return updated;
    });
    setSelectedCity(newListing.city);
    setMapBounds(null);
    setFilters((prev) => ({
      ...prev,
      city: newListing.city,
      neighborhood: 'Tous les quartiers',
    }));
    showToast('🎉 Annonce publiée avec succès sans frais de semsar !');
  };

  // Handle Reporting Semsar
  const handleReportSemsar = (listingId: string, reason: string) => {
    showToast(`Signalement transmis. Merci de protéger la communauté KriblaSemsar !`);
  };

  const handleSelectFromMap = (listing: Listing) => {
    setSelectedListing(listing);
    // Smooth scroll corresponding card into view on desktop
    const cardEl = document.getElementById(`listing-card-${listing.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Hero Autocomplete & Quick-Jump Destinations */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={handleCityChange}
        onSelectSuggestion={handleSelectSuggestion}
        favoritesCount={favorites.size}
        onOpenFavorites={() => setActiveTab('favorites')}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        activeListingCount={filteredListings.length}
      />

      {/* Filter Bar with Search Barrel & More Filters */}
      <FilterBar
        filters={filters}
        onUpdateFilters={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        onResetFilters={() =>
          setFilters({
            ...defaultFilters,
            city: selectedCity,
          })
        }
        totalResults={filteredListings.length}
      />

      {/* Body: Split View (List + Interactive Map) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Scrollable Listing Cards Feed (50% on Desktop) */}
        <div
          className={`w-full md:w-[50%] lg:w-[46%] xl:w-[42%] h-full overflow-y-auto p-3 sm:p-5 flex flex-col gap-4 pb-24 md:pb-6 ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Tab indicator (when viewing favorites) */}
          {activeTab === 'favorites' && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>Mes annonces favorites ({favorites.size})</span>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs font-bold text-rose-700 underline"
              >
                Tout afficher
              </button>
            </div>
          )}

          {/* Feed Title & Context Badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Colocations & Logements à {selectedCity}</span>
              {selectedCity === 'Benguerir' && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Campus UM6P
                </span>
              )}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredListings.length} bien{filteredListings.length > 1 ? 's' : ''} direct
            </span>
          </div>

          {/* Cards Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={favorites.has(listing.id)}
                  isSelected={selectedListing?.id === listing.id}
                  onSelect={(item) => setSelectedListing(item)}
                  onToggleFavorite={handleToggleFavorite}
                  onHover={(id) => setHoveredListingId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 my-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-3">
                🔍
              </div>
              <h3 className="font-bold text-slate-800 text-base">Aucune annonce trouvée dans cette zone</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                {filters.search_as_move
                  ? 'Déplacez la carte ou dézoomez pour afficher plus de logements sans semsar.'
                  : 'Essayez d’élargir vos filtres ou de sélectionner « Tous les quartiers ».'}
              </p>
              <button
                onClick={() =>
                  setFilters({
                    ...defaultFilters,
                    city: selectedCity,
                  })
                }
                className="mt-4 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Bottom Security Note */}
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Rappel de sécurité KriblaSemsar :</strong>
              <span>
                Ne versez jamais d'argent à l'avance sans visite physique et signature de contrat légalisé (Moul Dar direct).
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Full-Height Interactive Map */}
        <div
          className={`flex-1 h-full relative ${
            mobileView === 'list' ? 'hidden md:block' : 'block w-full'
          }`}
        >
          <InteractiveMap
            listings={filteredListings}
            selectedListingId={selectedListing?.id || null}
            hoveredListingId={hoveredListingId}
            onSelectListing={handleSelectFromMap}
            onOpenDetailModal={(item) => setSelectedListing(item)}
            selectedCity={selectedCity}
            onSelectCity={handleCityChange}
            targetFlyTo={targetFlyTo}
            onBoundsChange={(bounds) => setMapBounds(bounds)}
            searchAsMove={filters.search_as_move}
          />
        </div>

      </div>

      {/* Mobile Floating Pill Toggle [ 🗺️ Carte | 📋 Liste (X) ] */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 md:hidden">
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 active:scale-95 transition-all"
        >
          {mobileView === 'list' ? (
            <>
              <MapIcon className="w-4 h-4 text-emerald-400" />
              <span>Afficher la Carte</span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4 text-emerald-400" />
              <span>Afficher la Liste ({filteredListings.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'favorites') setMobileView('list');
          if (tab === 'explore') setMobileView('list');
          if (tab === 'alerts') showToast('🔔 Alertes configurées pour vos villes préférées !');
          if (tab === 'profile') showToast('👤 Espace profil Mehdi B. (Certifié)');
        }}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        favoritesCount={favorites.size}
      />

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        isFavorite={selectedListing ? favorites.has(selectedListing.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenCallConditions={(item) => setCallModalListing(item)}
      />

      {/* Anti-Semsar Call Conditions Modal */}
      {callModalListing && (
        <CallConditionsModal
          listing={callModalListing}
          isOpen={!!callModalListing}
          onClose={() => setCallModalListing(null)}
          onReportSemsar={handleReportSemsar}
        />
      )}

      {/* Publish Listing Multi-Step Wizard */}
      <PublishWizardModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublishListing={handlePublishListing}
        defaultCity={selectedCity}
      />

    </div>
  );
};
