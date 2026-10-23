import React from 'react';
import { Heart, Wifi, ShieldCheck, Users, Bath, Home, UserCheck, Sparkles } from 'lucide-react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  isSelected: boolean;
  onSelect: (listing: Listing) => void;
  onToggleFavorite: (listingId: string) => void;
  onHover: (listingId: string | null) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorite,
  isSelected,
  onSelect,
  onToggleFavorite,
  onHover,
}) => {
  const isColoc = listing.listing_type === 'colocation_room';
  const isApartment = listing.listing_type === 'full_apartment';
  const isRoommate = listing.listing_type === 'roommate_search';

  const typeBadgeColor = isColoc
    ? 'bg-blue-600 text-white'
    : isApartment
    ? 'bg-emerald-600 text-white'
    : 'bg-amber-500 text-white';

  const typeLabel = isColoc
    ? 'Chambre en coloc'
    : isApartment
    ? 'Logement entier'
    : 'Profil colocataire';

  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing)}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col ${
        isSelected
          ? 'border-brand-500 ring-2 ring-brand-500/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Photo Gallery Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.photos[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm ${typeBadgeColor}`}>
            {typeLabel}
          </span>
          <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 shadow-sm flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            0% Semsar
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(listing.id);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/85 backdrop-blur-md hover:bg-white text-slate-700 transition-transform active:scale-90 shadow-sm z-10"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Bottom Photo Count & Verified Owner */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium z-10 drop-shadow">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
            <img
              src={listing.user.avatar_url}
              alt={listing.user.full_name}
              className="w-3.5 h-3.5 rounded-full object-cover"
            />
            <span className="truncate max-w-[120px]">{listing.user.full_name.split(' ')[0]}</span>
            {listing.user.verified_badge && (
              <UserCheck className="w-3 h-3 text-emerald-400" />
            )}
          </div>

          <span className="bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px]">
            📷 {listing.photos.length}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
        {/* Price & Charges */}
        <div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {listing.price_amount.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {listing.currency} / mois
              </span>
            </div>
            {listing.charges_included ? (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Charges incluses
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500">
                + charges
              </span>
            )}
          </div>

          {/* Location & Title */}
          <div className="mt-1">
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-brand-600 transition-colors">
              {listing.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <span>📍 {listing.neighborhood}</span>
              <span>•</span>
              <span>{listing.city}</span>
            </p>
          </div>
        </div>

        {/* Specs & Amenities Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
            {listing.surface_total} m²
          </span>

          {listing.furnished && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
              <Home className="w-3 h-3 text-slate-500" />
              Meublé
            </span>
          )}

          {listing.amenities.wifi_fiber && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border border-blue-200/60">
              <Wifi className="w-3 h-3 text-blue-600" />
              Fibre
            </span>
          )}

          {listing.amenities.private_bathroom && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border border-indigo-200/60">
              <Bath className="w-3 h-3 text-indigo-600" />
              SDB Privée
            </span>
          )}

          {listing.gender_preference === 'female_only' && (
            <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-medium border border-pink-200/60">
              Filles uniquement
            </span>
          )}
          {listing.gender_preference === 'male_only' && (
            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-medium border border-blue-200/60">
              Garçons uniquement
            </span>
          )}
        </div>

        {/* Existing Flatmates or Note */}
        {listing.current_flatmates_description && (
          <div className="mt-1 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.current_flatmates_description}</span>
          </div>
        )}
      </div>
    </div>
  );
};
