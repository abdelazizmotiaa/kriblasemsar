import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  MapPin,
  Upload,
  Plus,
  Home,
  Users,
  Phone,
  Clock,
  Sparkles,
  Wifi,
  Wind,
  Bath,
  Car
} from 'lucide-react';
import { Listing, ListingType, GenderPreference, OccupantTypePreference } from '../../types';
import { CITIES, MOCK_USERS } from '../../data/mockData';
import { InteractiveMap } from '../Map/InteractiveMap';

interface PublishWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishListing: (newListing: Listing) => void;
  defaultCity: string;
}

export const PublishWizardModal: React.FC<PublishWizardModalProps> = ({
  isOpen,
  onClose,
  onPublishListing,
  defaultCity,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Type, City, Neighborhood & GPS Pin-drop
  const [listingType, setListingType] = useState<ListingType>('colocation_room');
  const [city, setCity] = useState(defaultCity || 'Benguerir');
  const [neighborhood, setNeighborhood] = useState('');
  const [exactLocationHidden, setExactLocationHidden] = useState(false);
  const [droppedPin, setDroppedPin] = useState<[number, number] | null>(
    city === 'Benguerir' ? [32.2350, -7.9530] : [33.5731, -7.6498]
  );

  // Step 2: Surface, rooms, amenities, profile
  const [surfaceTotal, setSurfaceTotal] = useState<number>(95);
  const [roomSurface, setRoomSurface] = useState<number>(15);
  const [totalRooms, setTotalRooms] = useState<number>(3);
  const [furnished, setFurnished] = useState(true);
  const [amenities, setAmenities] = useState({
    wifi_fiber: true,
    washing_machine: true,
    ac: true,
    parking: false,
    elevator: true,
    security_24_7: true,
    kitchen_equipped: true,
    balcony: true,
    private_bathroom: false,
  });
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('mixed');
  const [occupantPreference, setOccupantPreference] = useState<OccupantTypePreference>('students');
  const [compatibilityTagsInput, setCompatibilityTagsInput] = useState('Calme, Travailleur, Non-fumeur, Fibre 100M');

  // Step 3: Rent, deposit, charges, availability
  const [price, setPrice] = useState<number>(2500);
  const [deposit, setDeposit] = useState<number>(2500);
  const [chargesIncluded, setChargesIncluded] = useState(true);
  const [chargesDetails, setChargesDetails] = useState('Eau, ONEE & Fibre Optique inclus');
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);

  // Step 4: Photos, title, description, contact & call conditions
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('+212671581167');
  const [phoneNumber, setPhoneNumber] = useState('+212671581167');
  const [callHours, setCallHours] = useState('18h30 - 21h00 — privilégiez WhatsApp en journée');
  const [callNote, setCallNote] = useState('En cours/bureau la journée. Merci d’envoyer un message WhatsApp de présentation.');
  const [advertiserRole, setAdvertiserRole] = useState<'owner' | 'flatmate' | 'authorized_representative'>('owner');
  const [honorDeclarationChecked, setHonorDeclarationChecked] = useState(false);

  if (!isOpen) return null;

  const currentCityConfig = CITIES[city] || CITIES.Benguerir;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTags = compatibilityTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newListing: Listing = {
      id: `new-${Date.now()}`,
      user_id: 'u-current',
      user: {
        id: 'u-current',
        full_name: 'Annonceur Certifié',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        role: listingType === 'full_apartment' ? 'owner' : 'flatmate',
        occupation: 'corporate_professional',
        verified_badge: true,
        country_code: 'MA',
        created_at: new Date().toISOString(),
      },
      listing_type: listingType,
      title: title || (listingType === 'colocation_room' ? 'Belle chambre en colocation sans semsar' : 'Logement direct propriétaire'),
      description: description || 'Logement très propre, sans aucun frais d’agence ni semsar. Visites faciles sur rendez-vous direct.',
      country_code: 'MA',
      city,
      neighborhood: neighborhood || currentCityConfig.neighborhoods[1] || 'Centre',
      latitude: droppedPin ? droppedPin[0] : currentCityConfig.center[0],
      longitude: droppedPin ? droppedPin[1] : currentCityConfig.center[1],
      exact_location_hidden: exactLocationHidden,
      price_amount: Number(price),
      currency: 'MAD',
      deposit_amount: Number(deposit),
      charges_included: chargesIncluded,
      charges_details: chargesDetails,
      surface_total: Number(surfaceTotal),
      room_surface: Number(roomSurface),
      total_rooms: Number(totalRooms),
      available_rooms: 1,
      furnished,
      gender_preference: genderPreference,
      occupant_type_preference: occupantPreference,
      amenities,
      contact_methods: {
        allow_whatsapp: true,
        allow_phone: true,
        allow_internal_chat: true,
      },
      call_conditions_hours: callHours,
      call_conditions_note: callNote,
      available_from: availableFrom,
      min_stay_months: 6,
      status: 'active',
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'],
      created_at: new Date().toISOString(),
      compatibility_tags: parsedTags.length > 0 ? parsedTags : ['Calme', 'Non-fumeur', 'Fibre 100M'],
    };

    onPublishListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md overflow-y-auto p-0 sm:p-4">
      <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col my-auto max-h-screen">
        
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
              Étape {step} sur {totalSteps} • KriblaSemsar
            </span>
            <h3 className="font-extrabold text-base sm:text-lg">
              {step === 1 && "1. Type de bien & Point GPS sur la Carte"}
              {step === 2 && "2. Surface, Pièces & Commodités"}
              {step === 3 && "3. Loyer en DH, Caution & Charges"}
              {step === 4 && "4. Photos, WhatsApp & Conditions d'appel"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-brand-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          
          {/* ÉTAPE 1 : Type de bien, Ville, Quartier & Pin-Drop GPS */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 block">Type d'annonce :</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'colocation_room', label: 'Chambre en coloc', icon: '🔵' },
                  { id: 'full_apartment', label: 'Logement entier', icon: '🟢' },
                  { id: 'roommate_search', label: 'Profil chercheur', icon: '🟠' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setListingType(opt.id as ListingType)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      listingType === opt.id
                        ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Ville & Quartier */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ville</label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const conf = CITIES[newCity];
                      if (conf) {
                        setDroppedPin(conf.center);
                        setNeighborhood(conf.neighborhoods[1] || 'Centre-Ville');
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {Object.entries(CITIES).map(([cKey, cConf]) => (
                      <option key={cKey} value={cKey}>
                        {cConf.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quartier</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {currentCityConfig.neighborhoods.slice(1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value="Autre quartier">Autre quartier</option>
                  </select>
                </div>
              </div>

              {/* Pin-Drop GPS sur Carte CARTO Voyager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  📍 Positionnez le repère GPS sur la carte (Cliquez pour déplacer) :
                </label>
                <div className="h-56 w-full rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                  <InteractiveMap
                    listings={[]}
                    selectedListingId={null}
                    hoveredListingId={null}
                    onSelectListing={() => {}}
                    selectedCity={city}
                    isPinDropMode={true}
                    droppedPin={droppedPin}
                    onPinDropped={(lat, lng) => setDroppedPin([lat, lng])}
                    exactLocationHidden={exactLocationHidden}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={exactLocationHidden}
                  onChange={(e) => setExactLocationHidden(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300"
                />
                <span>Masquer l'adresse exacte (Afficher un cercle de 200m pour préserver la vie privée)</span>
              </label>
            </div>
          )}

          {/* ÉTAPE 2 : Surface, pièces, commodités, profil */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Surface totale</label>
                  <input
                    type="number"
                    value={surfaceTotal}
                    onChange={(e) => setSurfaceTotal(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Surface chambre</label>
                  <input
                    type="number"
                    value={roomSurface}
                    onChange={(e) => setRoomSurface(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nb pièces</label>
                  <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Commodités */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Commodités incluses :</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.wifi_fiber}
                      onChange={(e) => setAmenities({ ...amenities, wifi_fiber: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>⚡ Fibre Optique</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={furnished}
                      onChange={(e) => setFurnished(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>🛋️ Meublé</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.ac}
                      onChange={(e) => setAmenities({ ...amenities, ac: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>❄️ Climatisation</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.private_bathroom}
                      onChange={(e) => setAmenities({ ...amenities, private_bathroom: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>🚿 SDB Privative</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.parking}
                      onChange={(e) => setAmenities({ ...amenities, parking: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>🚗 Parking</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.washing_machine}
                      onChange={(e) => setAmenities({ ...amenities, washing_machine: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>🧺 Machine à laver</span>
                  </label>
                </div>
              </div>

              {/* Profil & Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Préférence Genre</label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  >
                    <option value="mixed">Mixte / Indifférent</option>
                    <option value="female_only">Filles uniquement</option>
                    <option value="male_only">Garçons uniquement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profil recherché</label>
                  <select
                    value={occupantPreference}
                    onChange={(e) => setOccupantPreference(e.target.value as OccupantTypePreference)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  >
                    <option value="students">Étudiants / Doctorants</option>
                    <option value="professionals">Jeunes actifs / Corporate</option>
                    <option value="any">Tous profils bienvenus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags d'ambiance (séparés par virgules)</label>
                <input
                  type="text"
                  value={compatibilityTagsInput}
                  onChange={(e) => setCompatibilityTagsInput(e.target.value)}
                  placeholder="ex: Calme, Travailleur, Non-fumeur, Cuisine souvent"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Loyer en DH, caution, charges, disponibilité */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loyer mensuel (DH/mois)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Caution (DH)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Charges */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={chargesIncluded}
                    onChange={(e) => setChargesIncluded(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <span>Charges comprises (Eau, ONEE, Fibre optique)</span>
                </label>
                {chargesIncluded && (
                  <input
                    type="text"
                    value={chargesDetails}
                    onChange={(e) => setChargesDetails(e.target.value)}
                    placeholder="ex: Eau, électricité ONEE, syndic & Fibre Optique inclus"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-700"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de disponibilité</label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rappel : Zéro frais de dossier ou d'agence. 0 DH Semsar garanti.</span>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Photos, WhatsApp, conditions d'appel */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'annonce</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Chambre lumineuse avec bureau proche UM6P / Fibre optique"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ambiance, colocataires, proximité du Tramway ou campus..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              {/* Photos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Photos ({photos.length})</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Coller l'URL d'une photo..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Contacts & Conditions d'appel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp (+212)</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Numéro d'appel (+212)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Créneaux d'appel autorisés</span>
                </div>
                <input
                  type="text"
                  value={callHours}
                  onChange={(e) => setCallHours(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Rôle de l'Annonceur */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vous publiez cette annonce en tant que :
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'owner', label: 'Propriétaire (Moul Dar)' },
                    { id: 'flatmate', label: 'Colocataire actuel' },
                    { id: 'authorized_representative', label: 'Représentant sans frais' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setAdvertiserRole(r.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        advertiserRole === r.id
                          ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Déclaration sur l'honneur obligatoire (Anti-Semsar) */}
              <label className="flex items-start gap-3 p-3.5 bg-emerald-50/90 rounded-2xl border-2 border-emerald-500 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  required
                  checked={honorDeclarationChecked}
                  onChange={(e) => setHonorDeclarationChecked(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded mt-0.5 shrink-0"
                />
                <div className="text-xs text-emerald-950 font-medium space-y-1">
                  <p className="font-bold text-slate-900">
                    « Je certifie que cette annonce est authentique et qu'aucune commission de courtage n'est demandée. »
                  </p>
                  <p className="font-bold text-emerald-800" dir="rtl">
                    « أصرح أن هذا الإعلان حقيقي ولا أطلب أي عمولة سمسرة. »
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    KriblaSemsar est réservé aux particuliers directs. Tout intermédiaire réclamant des frais de visite ou commission sera banni.
                  </p>
                </div>
              </label>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>Continuer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!honorDeclarationChecked}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Publier gratuitement (0% Semsar)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
