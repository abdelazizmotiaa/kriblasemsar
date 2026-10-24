import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Wifi,
  Wind,
  Car,
  Home,
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  Bath,
  Phone,
  MessageCircle,
  Building,
  Check,
  Info
} from 'lucide-react';
import { Listing } from '../../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenCallConditions: (listing: Listing) => void;
  onOpenReportModal?: (listingId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenCallConditions,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !listing) return null;

  const isColoc = listing.listing_type === 'colocation_room';
  const isApartment = listing.listing_type === 'full_apartment';
  const isRoommate = listing.listing_type === 'roommate_search';

  // Format polite WhatsApp prefilled message in Moroccan context
  const whatsappMessage = encodeURIComponent(
    isRoommate
      ? `Salam / Bonjour ${listing.user.full_name}, j'ai vu votre profil de recherche de colocation sur KriblaSemsar.com pour ${listing.city}. Êtes-vous toujours en recherche d'une colocation ?`
      : `Salam / Bonjour, je vous contacte via KriblaSemsar.com concernant votre annonce "${listing.title}" à ${listing.neighborhood}, ${listing.city}. Est-elle toujours disponible pour une visite ?`
  );

  // Clean WhatsApp phone number for link
  const rawPhone = listing.user.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${listing.title} | KriblaSemsar`,
        text: `Découvre ce logement sans semsar à ${listing.neighborhood}, ${listing.city} :`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md overflow-y-auto p-0 sm:p-4">
      <div className="relative w-full sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col my-auto max-h-screen">
        
        {/* Sticky Mobile Modal Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isColoc
                  ? 'bg-blue-100 text-blue-800'
                  : isApartment
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isColoc ? 'Chambre en coloc' : isApartment ? 'Logement entier' : 'Recherche coloc'}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              📍 {listing.neighborhood}, {listing.city}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Partager"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className="p-2 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-full transition-colors"
              title="Favoris"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 pb-24 sm:pb-8">
          
          {/* Photo Gallery Carousel */}
          <div className="relative bg-slate-900 aspect-[16/10] sm:aspect-[21/10] w-full overflow-hidden">
            <img
              src={listing.photos[activePhotoIdx]}
              alt={listing.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Photo Counter Pill */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {activePhotoIdx + 1} / {listing.photos.length} photos
            </div>

            {/* Thumbnail dots selector */}
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {listing.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activePhotoIdx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Demo Listing Disclaimers */}
            {listing.is_demo && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl flex items-start gap-2.5 text-xs">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <span className="font-extrabold uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded mr-1.5">
                    Annonce d'Exemple / Démonstration
                  </span>
                  <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                    Cette annonce est un exemple illustratif créé pour la phase de test de la plateforme. Elle ne constitue pas une offre locative réelle.
                  </p>
                </div>
              </div>
            )}

            {/* Zero Semsar Guarantee Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-brand-700 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight">🛡️ 0 DH Frais de Semsar / Direct Propriétaire ou Coloc</h4>
                  <p className="text-xs text-emerald-100">
                    Contrat direct entre locataire et bailleur ou colocataires. Zéro intermédiaire.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block bg-white/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                Garanti KriblaSemsar
              </span>
            </div>

            {/* Title & Pricing Overview */}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {listing.title}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{listing.neighborhood}, {listing.city}</span>
                {listing.exact_location_hidden && (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    (Périmètre 200m)
                  </span>
                )}
              </p>

              {/* Financial Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 font-medium">
                    {isRoommate ? 'Budget maximum souhaité' : 'Loyer mensuel'}
                  </span>
                  <p className="text-2xl font-black text-slate-900">
                    {listing.price_amount.toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-600">DH/mois</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Charges mensuelles</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {listing.charges_included ? (
                      <span className="text-emerald-700 font-extrabold">Comprises (Eau, ONEE, Fibre)</span>
                    ) : (
                      <span className="text-slate-600">Non comprises</span>
                    )}
                  </p>
                  {listing.charges_details && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{listing.charges_details}</p>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-medium">
                    {isRoommate ? 'Budget caution prévu' : 'Dépôt de garantie (Caution)'}
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {listing.deposit_amount.toLocaleString('fr-FR')} DH
                  </p>
                </div>
              </div>
            </div>

            {/* Property Key Specs */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Caractéristiques du logement
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold text-slate-700">
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>{listing.surface_total} m² au total</span>
                </div>
                {listing.room_surface && (
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2">
                    <Home className="w-4 h-4 text-slate-500" />
                    <span>Chambre : {listing.room_surface} m²</span>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Dispo : {listing.available_from}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Bail min : {listing.min_stay_months} mois</span>
                </div>
              </div>
            </div>

            {/* Moroccan Amenities (Fibre Optique, Climatisation, etc.) */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Équipements & Confort
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {listing.amenities.wifi_fiber && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 font-semibold">
                    <Wifi className="w-4 h-4 text-blue-600" />
                    <span>Fibre Optique Haut Débit</span>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Meublé & Équipé</span>
                  </div>
                )}
                {listing.amenities.ac && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    <Wind className="w-4 h-4 text-slate-500" />
                    <span>Climatisation</span>
                  </div>
                )}
                {listing.amenities.private_bathroom && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold">
                    <Bath className="w-4 h-4 text-indigo-600" />
                    <span>Salle de bain privative</span>
                  </div>
                )}
                {listing.amenities.parking && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    <Car className="w-4 h-4 text-slate-500" />
                    <span>Place de Parking</span>
                  </div>
                )}
                {listing.amenities.washing_machine && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Machine à laver</span>
                  </div>
                )}
                {listing.amenities.kitchen_equipped && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cuisine équipée</span>
                  </div>
                )}
                {listing.amenities.security_24_7 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Résidence sécurisée 24/7</span>
                  </div>
                )}
              </div>
            </div>

            {/* Roommate & Flat Vibe Section (For Colocations) */}
            {(listing.flatmates_list || listing.current_flatmates_description || isColoc) && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Ambiance & Colocataires actuels (Flat Vibe)</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Communauté vérifiée
                  </span>
                </div>

                {/* Flatmates Cards */}
                {listing.flatmates_list && listing.flatmates_list.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {listing.flatmates_list.map((mate, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-xs"
                      >
                        <img
                          src={mate.avatar}
                          alt={mate.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {mate.name}, {mate.age} ans
                          </p>
                          <p className="text-[11px] text-slate-600 truncate">{mate.occupation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compatibility Tags */}
                {listing.compatibility_tags && listing.compatibility_tags.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-amber-900 block">
                      Tags de compatibilité :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.compatibility_tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-amber-300 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          ✨ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {listing.current_flatmates_description && (
                  <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-100">
                    <strong>Mot des colocataires :</strong> "{listing.current_flatmates_description}"
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-white border border-amber-300 px-2.5 py-1 rounded-lg text-amber-900">
                    Préférence genre :{' '}
                    {listing.gender_preference === 'female_only'
                      ? 'Filles uniquement'
                      : listing.gender_preference === 'male_only'
                      ? 'Garçons uniquement'
                      : 'Mixte'}
                  </span>
                  <span className="bg-white border border-amber-300 px-2.5 py-1 rounded-lg text-amber-900">
                    Profil :{' '}
                    {listing.occupant_type_preference === 'students'
                      ? 'Étudiants / Doctorants'
                      : listing.occupant_type_preference === 'professionals'
                      ? 'Jeunes actifs / Corporate'
                      : 'Tous profils bienvenus'}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Description de l'annonceur
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                {listing.description}
              </p>
            </div>

            {/* Poster Identity Card */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={listing.user.avatar_url}
                  alt={listing.user.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{listing.user.full_name}</h4>
                    {listing.user.verified_badge && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {listing.user.role === 'owner'
                      ? 'Propriétaire Direct'
                      : isRoommate
                      ? 'En recherche de colocation'
                      : 'Colocataire occupant'}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <span>Membre KriblaSemsar</span>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Mobile & Desktop Action Bar */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-3 sm:px-6 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              {isRoommate ? 'Budget max' : 'Loyer mensuel'}
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
              {listing.price_amount.toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-600">DH</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Protected Button */}
            {listing.contact_methods.allow_whatsapp && (
              <button
                type="button"
                onClick={() => onOpenCallConditions(listing)}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{isRoommate ? `Contacter ${listing.user.full_name.split(' ')[0]}` : 'WhatsApp'}</span>
              </button>
            )}

            {/* Call Button with conditions modal */}
            {listing.contact_methods.allow_phone && (
              <button
                onClick={() => onOpenCallConditions(listing)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
