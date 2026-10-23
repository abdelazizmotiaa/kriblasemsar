import { Listing, User } from '../types';
import { MOROCCO_CITIES } from './moroccoCities';

export const CITIES = MOROCCO_CITIES;

export const MOCK_USERS: Record<string, User> = {
  mehdi: {
    id: 'u-1',
    full_name: 'Mehdi Benkaddour',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212671581167',
    whatsapp_number: '+212671581167',
    role: 'flatmate',
    occupation: 'phd_researcher',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2024-01-15'
  },
  soufiane: {
    id: 'u-2',
    full_name: 'Soufiane El Alami',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212661882233',
    whatsapp_number: '+212661882233',
    role: 'owner',
    occupation: 'corporate_professional',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2023-11-20'
  },
  yasmine: {
    id: 'u-3',
    full_name: 'Yasmine Berrada',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212662994411',
    whatsapp_number: '+212662994411',
    role: 'flatmate',
    occupation: 'student',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2024-02-01'
  },
  karim: {
    id: 'u-4',
    full_name: 'Karim Tazi',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212671581167',
    whatsapp_number: '+212671581167',
    role: 'flatmate',
    occupation: 'corporate_professional',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2023-09-10'
  },
  aya: {
    id: 'u-5',
    full_name: 'Aya Mansouri',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212663112233',
    whatsapp_number: '+212663112233',
    role: 'tenant',
    occupation: 'student',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2024-03-01'
  },
  omar: {
    id: 'u-6',
    full_name: 'Omar Filali',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    phone_number: '+212661445566',
    whatsapp_number: '+212661445566',
    role: 'owner',
    occupation: 'corporate_professional',
    verified_badge: true,
    country_code: 'MA',
    created_at: '2023-08-14'
  }
};

const RAW_INITIAL_LISTINGS: Listing[] = [
  // ==========================================
  // BENGUERIR (4 ANNONCES)
  // ==========================================
  {
    id: 'bg-1',
    user_id: 'u-1',
    user: MOCK_USERS.mehdi,
    listing_type: 'colocation_room',
    title: 'Chambre meublée haut standing - Proche UM6P / Ville Verte',
    description: 'Chambre privative dans une colocation calme et studieuse au sein de la Ville Verte. Idéal pour doctorant(e), chercheur ou étudiant UM6P. Climatisation réversible, bureau ergonomique, grand placard intégré. Salon partagé lumineux avec balcon.',
    country_code: 'MA',
    city: 'Benguerir',
    neighborhood: 'Ville Verte / Proche UM6P',
    latitude: 32.2215,
    longitude: -7.9395,
    exact_location_hidden: false,
    price_amount: 2200,
    currency: 'MAD',
    deposit_amount: 2200,
    charges_included: true,
    charges_details: 'Eau, ONEE & Fibre Optique 100M inclus',
    surface_total: 95,
    room_surface: 16,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'students',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h30 - 21h00',
    call_conditions_note: 'En labo de recherche UM6P la journée. Envoyez un message WhatsApp avec votre profil.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-10',
    views_count: 142,
    current_flatmates_description: '2 doctorants en énergies renouvelables à l’UM6P. Ambiance calme, respectueuse et studieuse.',
    flatmates_list: [
      {
        name: 'Mehdi',
        age: 26,
        occupation: 'Doctorant Matériaux (UM6P)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Amine',
        age: 24,
        occupation: 'Étudiant Master AI (UM6P)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Calme', 'Travailleur', 'Non-fumeur', 'Fibre 100M', 'Cuisine saine'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'bg-2',
    user_id: 'u-2',
    user: MOCK_USERS.soufiane,
    listing_type: 'full_apartment',
    title: 'Appartement entier 2 chambres sans semsar - Hay Elassil',
    description: 'Direct propriétaire (Moul Dar direct, aucun intermédiaire). Appartement 75m² meublé avec goût dans un immeuble familial calme avec ascenseur. Salon marocain contemporain, cuisine séparée équipée, 2 chambres avec literie neuve.',
    country_code: 'MA',
    city: 'Benguerir',
    neighborhood: 'Hay Elassil',
    latitude: 32.2350,
    longitude: -7.9520,
    exact_location_hidden: true,
    price_amount: 3500,
    currency: 'MAD',
    deposit_amount: 3500,
    charges_included: false,
    charges_details: 'Syndic 150 DH/mois, compteurs ONEE & Eau individuels',
    surface_total: 75,
    room_surface: 14,
    total_rooms: 2,
    available_rooms: 2,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: false,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: false
    },
    call_conditions_hours: '12h00 - 14h00 et 18h00 - 20h30',
    call_conditions_note: 'Propriétaire particulier. Visites possibles le weekend et en fin de journée.',
    available_from: '2024-08-15',
    min_stay_months: 12,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-08',
    views_count: 88,
    compatibility_tags: ['Direct Propriétaire', 'Calme', 'Immeuble sécurisé', 'Proche commerces'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'bg-3',
    user_id: 'u-4',
    user: MOCK_USERS.karim,
    listing_type: 'colocation_room',
    title: 'Colocation Ingénieurs/Chercheurs - Proche Gare ONCF',
    description: 'Chambre individuelle dans grand appartement moderne à 3 minutes à pied de la gare ONCF de Benguerir. Navette UM6P accessible immédiatement. Grand salon, cuisine toute équipée avec lave-vaisselle, balcon terrasse ensoleillé.',
    country_code: 'MA',
    city: 'Benguerir',
    neighborhood: 'Proche Gare ONCF',
    latitude: 32.2410,
    longitude: -7.9580,
    exact_location_hidden: false,
    price_amount: 1800,
    currency: 'MAD',
    deposit_amount: 1800,
    charges_included: true,
    charges_details: 'Fibre Optique Orange 100M et charges incluses',
    surface_total: 110,
    room_surface: 14,
    total_rooms: 4,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'male_only',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: false,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '19h00 - 21h30',
    call_conditions_note: 'Merci d’envoyer un court message WhatsApp pour vous présenter avant d’appeler.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-05',
    views_count: 94,
    current_flatmates_description: '2 ingénieurs Green Energy Park et 1 chercheur OCP. Ambiance conviviale et sportive.',
    flatmates_list: [
      {
        name: 'Karim',
        age: 27,
        occupation: 'Ingénieur R&D Green Energy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Saad',
        age: 26,
        occupation: 'Data Scientist',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Ingénieurs', 'Sportif', 'Non-fumeur', 'Gare TGV/TNR', 'Fibre Optique'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'bg-4',
    user_id: 'u-5',
    user: MOCK_USERS.aya,
    listing_type: 'full_apartment',
    title: 'Studio meublé moderne - Hay Al Majd',
    description: 'Joli studio indépendant 42m² refait à neuf dans le quartier calme de Hay Al Majd. Proche de toutes commodités, supermarché et station de taxi. Équipé d’une kitchenette moderne, TV connectée, lit 2 places avec matelas orthopédique.',
    country_code: 'MA',
    city: 'Benguerir',
    neighborhood: 'Hay Al Majd',
    latitude: 32.2380,
    longitude: -7.9450,
    exact_location_hidden: true,
    price_amount: 2600,
    currency: 'MAD',
    deposit_amount: 2600,
    charges_included: true,
    charges_details: 'Eau et WiFi inclus',
    surface_total: 42,
    room_surface: 28,
    total_rooms: 1,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: false,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: false,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: false,
      allow_internal_chat: true
    },
    call_conditions_hours: 'WhatsApp 24/7',
    call_conditions_note: 'Contact par WhatsApp uniquement.',
    available_from: '2024-08-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-02',
    views_count: 110,
    compatibility_tags: ['Studio Indépendant', 'Meublé Moderne', 'Climatisé', '0% Semsar'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },

  // ==========================================
  // CASABLANCA (5 ANNONCES)
  // ==========================================
  {
    id: 'cb-1',
    user_id: 'u-3',
    user: MOCK_USERS.yasmine,
    listing_type: 'colocation_room',
    title: 'Chambre Master SDB privée - Maârif Extension',
    description: 'Grande chambre privative avec salle de bain et dressing dans un splendide appartement de 125m². À 5 min à pied du Bd Roudani et des commerces. Colocation 100% féminine, propre et harmonieuse.',
    country_code: 'MA',
    city: 'Casablanca',
    neighborhood: 'Maârif & Extension',
    latitude: 33.5786,
    longitude: -7.6366,
    exact_location_hidden: false,
    price_amount: 3200,
    currency: 'MAD',
    deposit_amount: 3200,
    charges_included: false,
    charges_details: 'Charges partagées (~200 DH/mois pour eau, ONEE, Fibre)',
    surface_total: 125,
    room_surface: 20,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'female_only',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '19h00 - 21h30',
    call_conditions_note: 'En journée merci d’écrire sur WhatsApp. Je réponds rapidement dès 18h30.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-11',
    views_count: 210,
    current_flatmates_description: '2 jeunes femmes actives (avocate stagiaire et consultante marketing). Calmes, bienveillantes.',
    flatmates_list: [
      {
        name: 'Yasmine',
        age: 26,
        occupation: 'Consultante Digitale',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Salma',
        age: 25,
        occupation: 'Auditeur Financier',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Filles uniquement', 'SDB Privative', 'Calme', 'Non-fumeur', 'Maârif'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'cb-2',
    user_id: 'u-4',
    user: MOCK_USERS.karim,
    listing_type: 'colocation_room',
    title: 'Coloc standing proche Casa Finance City (CFC) & Tram',
    description: 'Chambre avec grand lit et baie vitrée dans une résidence de très haut standing face au parc de CFC. Accès immédiat Tramway T2. Salle de sport dans l’immeuble, conciergerie 24/7, fibre 200M.',
    country_code: 'MA',
    city: 'Casablanca',
    neighborhood: 'Casa Finance City (CFC)',
    latitude: 33.5562,
    longitude: -7.6601,
    exact_location_hidden: false,
    price_amount: 3800,
    currency: 'MAD',
    deposit_amount: 3800,
    charges_included: true,
    charges_details: 'Syndic, Fibre 200 Mbps et ménage hebdo des parties communes inclus',
    surface_total: 135,
    room_surface: 18,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h30 - 21h00',
    call_conditions_note: 'Banque d’affaires CFC la journée. Envoyez WhatsApp avec vos coordonnées professionnelles.',
    available_from: '2024-08-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-09',
    views_count: 280,
    current_flatmates_description: '1 consultant en stratégie et 1 ingénieur financier chez CFC. Respectueux du repos de chacun.',
    flatmates_list: [
      {
        name: 'Karim',
        age: 28,
        occupation: 'Analyste Financier CFC',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Hassan',
        age: 29,
        occupation: 'Consultant BCG',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['CFC', 'Cadres', 'Haut standing', 'Fibre 200M', 'Salle de sport'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'cb-3',
    user_id: 'u-2',
    user: MOCK_USERS.soufiane,
    listing_type: 'full_apartment',
    title: 'Studio meublé direct propriétaire - Bourgogne',
    description: 'Charmant studio 50m² à Bourgogne Ouest, à deux pas de la corniche et du Phare d’El Hank. Direct propriétaire (aucun frais d’agence). Très clair, salon avec cuisine américaine, chambre fermée, balcon vue dégagée.',
    country_code: 'MA',
    city: 'Casablanca',
    neighborhood: 'Bourgogne',
    latitude: 33.5952,
    longitude: -7.6485,
    exact_location_hidden: true,
    price_amount: 4500,
    currency: 'MAD',
    deposit_amount: 4500,
    charges_included: false,
    charges_details: 'Syndic 200 DH/mois',
    surface_total: 50,
    room_surface: 16,
    total_rooms: 1,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: false
    },
    call_conditions_hours: '14h00 - 20h00',
    call_conditions_note: 'Direct propriétaire. Visite sur rendez-vous le samedi après-midi.',
    available_from: '2024-08-01',
    min_stay_months: 12,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-04',
    views_count: 175,
    compatibility_tags: ['Direct Propriétaire', 'Bourgogne', 'Proche Mer', 'Balcon', '0% Semsar'],
    house_rules: {
      non_smoker: false,
      pets_allowed: true,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'cb-4',
    user_id: 'u-1',
    user: MOCK_USERS.mehdi,
    listing_type: 'colocation_room',
    title: 'Chambre lumineuse - Sidi Maârouf (Casanearshore)',
    description: 'Chambre en colocation à 5 min à pied du parc d’affaires Casanearshore. Parfait pour employé de multinationale ou tech. Résidence fermée avec gardiennage 24/7. Cuisine neuve, terrasse pour étendre le linge, salon convivial.',
    country_code: 'MA',
    city: 'Casablanca',
    neighborhood: 'Sidi Maârouf (Casanearshore)',
    latitude: 33.5285,
    longitude: -7.6420,
    exact_location_hidden: false,
    price_amount: 2500,
    currency: 'MAD',
    deposit_amount: 2500,
    charges_included: true,
    charges_details: 'Toutes charges comprises (Fibre, Eau, Électricité)',
    surface_total: 105,
    room_surface: 15,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h00 - 21h00',
    call_conditions_note: 'Privilégier WhatsApp pendant les heures de bureau.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-06',
    views_count: 160,
    current_flatmates_description: '2 développeurs travaillant chez Casanearshore. Ambiance tech, détendue et respectueuse.',
    flatmates_list: [
      {
        name: 'Tariq',
        age: 25,
        occupation: 'Software Engineer (Capgemini)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Othmane',
        age: 26,
        occupation: 'Cloud Engineer',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Casanearshore', 'Tech', 'Fibre 100M', 'Proche Tramway', 'Calme'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'cb-5',
    user_id: 'u-6',
    user: MOCK_USERS.omar,
    listing_type: 'colocation_room',
    title: 'Appartement 2 chambres - Gauthier',
    description: 'Chambre spacieuse avec balcon privé dans un appartement haussmannien plein de cachet au coeur du quartier branché de Gauthier. Parquet, hauts plafonds, cuisine équipée moderne, proche des meilleurs cafés et galeries.',
    country_code: 'MA',
    city: 'Casablanca',
    neighborhood: 'Gauthier',
    latitude: 33.5880,
    longitude: -7.6310,
    exact_location_hidden: false,
    price_amount: 3600,
    currency: 'MAD',
    deposit_amount: 3600,
    charges_included: false,
    charges_details: 'Syndic inclus, eau/électricité partagées',
    surface_total: 110,
    room_surface: 18,
    total_rooms: 2,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: false,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '19h00 - 21h00',
    call_conditions_note: 'Écrivez d\'abord un WhatsApp avant d\'appeler.',
    available_from: '2024-08-15',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-03',
    views_count: 230,
    current_flatmates_description: 'Architecte d’intérieur de 29 ans. Soigné, amateur d’art et de gastronomie.',
    flatmates_list: [
      {
        name: 'Omar',
        age: 29,
        occupation: 'Architecte d\'Intérieur',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Gauthier', 'Design', 'Balcon Privé', 'Fibre', 'Art & Cuisine'],
    house_rules: {
      non_smoker: true,
      pets_allowed: true,
      quiet_hours: true,
      overnight_guests: true
    }
  },

  // ==========================================
  // RABAT (4 ANNONCES)
  // ==========================================
  {
    id: 'rb-1',
    user_id: 'u-5',
    user: MOCK_USERS.aya,
    listing_type: 'colocation_room',
    title: 'Grande chambre en colocation - Agdal (proche Tram & Facultés)',
    description: 'Chambre lumineuse de 18m² avec placard et bureau dans un grand appartement au cœur de l’Agdal, à 2 min à pied de la station Tramway Place Al Joulane / Avenue de France. Quartier vivant, sécurisé, toutes commodités.',
    country_code: 'MA',
    city: 'Rabat',
    neighborhood: 'Agdal',
    latitude: 34.0045,
    longitude: -6.8490,
    exact_location_hidden: false,
    price_amount: 2800,
    currency: 'MAD',
    deposit_amount: 2800,
    charges_included: true,
    charges_details: 'Eau, ONEE & Fibre Optique 100M compris',
    surface_total: 120,
    room_surface: 18,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'female_only',
    occupant_type_preference: 'students',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: false,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h30 - 21h00',
    call_conditions_note: 'Étudiantes en cours la journée. Envoyez WhatsApp avec présentation.',
    available_from: '2024-09-01',
    min_stay_months: 9,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-12',
    views_count: 310,
    current_flatmates_description: '2 étudiantes sérieuses en pharmacie et ingénierie à Rabat. Ambiance calme et studieuse.',
    flatmates_list: [
      {
        name: 'Aya',
        age: 22,
        occupation: 'Étudiante Pharmacie (UM5)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Nour',
        age: 23,
        occupation: 'Élève Ingénieur (EHTP)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Filles uniquement', 'Agdal', 'Proche Tram', 'Fibre', 'Calme & Sérieux'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'rb-2',
    user_id: 'u-4',
    user: MOCK_USERS.karim,
    listing_type: 'colocation_room',
    title: 'Coloc jeunes cadres - Hay Riad (proche Mahaj Riad)',
    description: 'Chambre haut standing dans villa contemporaine avec jardin partagé au coeur de Hay Riad. À deux minutes à pied de l\'avenue Annakhil et du complexe Mahaj Riad. Espace coworking, fibre 200M, climatisation générale.',
    country_code: 'MA',
    city: 'Rabat',
    neighborhood: 'Hay Riad',
    latitude: 33.9680,
    longitude: -6.8770,
    exact_location_hidden: false,
    price_amount: 3700,
    currency: 'MAD',
    deposit_amount: 3700,
    charges_included: true,
    charges_details: 'Fibre 200 Mbps, eau, électricité et jardinier inclus',
    surface_total: 160,
    room_surface: 20,
    total_rooms: 4,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: false,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '19h00 - 21h30',
    call_conditions_note: 'Merci d’envoyer votre profil LinkedIn ou présentation par WhatsApp.',
    available_from: '2024-08-15',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-08',
    views_count: 195,
    current_flatmates_description: '3 cadres et consultants travaillant à Technopolis et Hay Riad. Profils sérieux et conviviaux.',
    flatmates_list: [
      {
        name: 'Reda',
        age: 28,
        occupation: 'Chef de Projet IT',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Ghita',
        age: 27,
        occupation: 'Chargée de Mission RSE',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Hay Riad', 'Jardin', 'Haut Standing', 'Fibre 200M', 'Cadres'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'rb-3',
    user_id: 'u-2',
    user: MOCK_USERS.soufiane,
    listing_type: 'full_apartment',
    title: 'Studio meublé sans semsar - Hassan',
    description: 'Direct propriétaire particulier. Studio cosy 48m² idéalement situé dans le quartier historique de Hassan, à proximité immédiate de la Tour Hassan, de la gare Rabat-Ville et du tramway. Très calme, donnant sur cour arborée.',
    country_code: 'MA',
    city: 'Rabat',
    neighborhood: 'Hassan',
    latitude: 34.0190,
    longitude: -6.8280,
    exact_location_hidden: true,
    price_amount: 3900,
    currency: 'MAD',
    deposit_amount: 3900,
    charges_included: false,
    charges_details: 'Syndic 150 DH/mois, compteurs individuels',
    surface_total: 48,
    room_surface: 24,
    total_rooms: 1,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: false,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: false,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: false
    },
    call_conditions_hours: '14h00 - 19h30',
    call_conditions_note: 'Propriétaire joignable l’après-midi. Visites organisées le weekend.',
    available_from: '2024-08-01',
    min_stay_months: 12,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-06',
    views_count: 160,
    compatibility_tags: ['Direct Propriétaire', 'Hassan', 'Gare Rabat-Ville', '0% Semsar', 'Calme'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'rb-4',
    user_id: 'u-3',
    user: MOCK_USERS.yasmine,
    listing_type: 'colocation_room',
    title: 'Chambre étudiante calme - Les Orangers',
    description: 'Chambre pour étudiant(e) dans un appartement chaleureux aux Orangers, à deux pas des facultés de droit et des sciences de Rabat. Quartier très agréable et verdoyant, à mi-chemin entre Agdal et Hassan. Fibre optique rapide.',
    country_code: 'MA',
    city: 'Rabat',
    neighborhood: 'Les Orangers',
    latitude: 34.0110,
    longitude: -6.8420,
    exact_location_hidden: false,
    price_amount: 2200,
    currency: 'MAD',
    deposit_amount: 2200,
    charges_included: true,
    charges_details: 'Toutes charges comprises (Fibre, Eau, Électricité)',
    surface_total: 90,
    room_surface: 14,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'students',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: false,
      elevator: false,
      security_24_7: false,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h00 - 21h00',
    call_conditions_note: 'WhatsApp en priorité.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-04',
    views_count: 145,
    current_flatmates_description: '2 étudiants en Master à Rabat. Calmes, travailleurs et passionnés de lecture.',
    flatmates_list: [
      {
        name: 'Hamza',
        age: 23,
        occupation: 'Master Économie',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Les Orangers', 'Étudiants', 'Calme', 'Fibre', 'Économique'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },

  // ==========================================
  // TANGER (3 ANNONCES)
  // ==========================================
  {
    id: 'tg-1',
    user_id: 'u-4',
    user: MOCK_USERS.karim,
    listing_type: 'colocation_room',
    title: 'Chambre vue mer en colocation - Malabata',
    description: 'Superbe chambre avec vue imprenable sur la baie de Tanger et le détroit de Gibraltar. Située sur la corniche de Malabata, à 5 min de la gare TGV Tanger-Ville et du Tanger City Center. Terrasse filante, grand salon panoramique.',
    country_code: 'MA',
    city: 'Tanger',
    neighborhood: 'Malabata',
    latitude: 35.7790,
    longitude: -5.7850,
    exact_location_hidden: false,
    price_amount: 2700,
    currency: 'MAD',
    deposit_amount: 2700,
    charges_included: true,
    charges_details: 'Syndic et Fibre inclus, eau/élec au réel',
    surface_total: 130,
    room_surface: 16,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h30 - 21h30',
    call_conditions_note: 'Écrire par WhatsApp pour convenir d’une visite.',
    available_from: '2024-08-15',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-10',
    views_count: 240,
    current_flatmates_description: '2 jeunes actifs travaillant dans l’import-export et l’architecture. Ambiance internationale et accueillante.',
    flatmates_list: [
      {
        name: 'Ilyas',
        age: 27,
        occupation: 'Architecte Naval',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Sofia',
        age: 26,
        occupation: 'Logistics Coordinator',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Vue Mer', 'Malabata', 'TGV Proche', 'Terrasse', 'Fibre Optique'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'tg-2',
    user_id: 'u-2',
    user: MOCK_USERS.soufiane,
    listing_type: 'full_apartment',
    title: 'Appartement direct propriétaire - Iberia / Centre-Ville',
    description: 'Grand appartement 85m² meublé avec soin dans le quartier résidentiel d’Iberia à Tanger. Immeuble sécurisé avec concierge, salon spacieux, 2 grandes chambres, cuisine indépendante avec buanderie. Zéro frais d’intermédiaire.',
    country_code: 'MA',
    city: 'Tanger',
    neighborhood: 'Iberia',
    latitude: 35.7720,
    longitude: -5.8150,
    exact_location_hidden: true,
    price_amount: 4200,
    currency: 'MAD',
    deposit_amount: 4200,
    charges_included: false,
    charges_details: 'Syndic 200 DH/mois',
    surface_total: 85,
    room_surface: 16,
    total_rooms: 2,
    available_rooms: 2,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: false
    },
    call_conditions_hours: '15h00 - 20h00',
    call_conditions_note: 'Propriétaire direct. Pas de semsar.',
    available_from: '2024-08-01',
    min_stay_months: 12,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-07',
    views_count: 180,
    compatibility_tags: ['Direct Propriétaire', 'Iberia', 'Centre-Ville', 'Familial', '0% Semsar'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: true
    }
  },
  {
    id: 'tg-3',
    user_id: 'u-1',
    user: MOCK_USERS.mehdi,
    listing_type: 'colocation_room',
    title: 'Coloc étudiants - Boukhalef (proche Université & Free Zone)',
    description: 'Chambre très abordable dans une colocation étudiante à Boukhalef, à 5 min à pied de l’Université Abdelmalek Essaâdi (Faculté des Sciences et Techniques / ENSA). Idéal pour petit budget. Fibre installée.',
    country_code: 'MA',
    city: 'Tanger',
    neighborhood: 'Boukhalef / Proche Université & Free Zone',
    latitude: 35.7310,
    longitude: -5.8950,
    exact_location_hidden: false,
    price_amount: 1400,
    currency: 'MAD',
    deposit_amount: 1400,
    charges_included: true,
    charges_details: 'Eau, électricité et WiFi inclus',
    surface_total: 80,
    room_surface: 12,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'male_only',
    occupant_type_preference: 'students',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: false,
      elevator: false,
      security_24_7: false,
      kitchen_equipped: true,
      balcony: false,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '17h00 - 21h00',
    call_conditions_note: 'WhatsApp recommandé.',
    available_from: '2024-09-01',
    min_stay_months: 9,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-02',
    views_count: 165,
    current_flatmates_description: '2 étudiants ENSA Tanger. Ambiance calme, révisions et entraide en programmation.',
    flatmates_list: [
      {
        name: 'Yassir',
        age: 21,
        occupation: 'Élève Ingénieur ENSA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Boukhalef', 'ENSA', 'Petit Prix', 'Fibre', 'Étudiants'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },

  // ==========================================
  // MARRAKECH (2 ANNONCES)
  // ==========================================
  {
    id: 'mr-1',
    user_id: 'u-3',
    user: MOCK_USERS.yasmine,
    listing_type: 'colocation_room',
    title: 'Chambre avec terrasse en colocation - Guéliz',
    description: 'Superbe chambre climatisée donnant directement sur une grande terrasse privative en plein cœur de Guéliz, à proximité de la Plaza et du Carré Eden. Appartement rénové au style arabo-andalou épuré. Fibre optique rapide pour télétravail.',
    country_code: 'MA',
    city: 'Marrakech',
    neighborhood: 'Guéliz',
    latitude: 31.6360,
    longitude: -8.0120,
    exact_location_hidden: false,
    price_amount: 2900,
    currency: 'MAD',
    deposit_amount: 2900,
    charges_included: true,
    charges_details: 'Fibre Optique, eau et électricité inclus',
    surface_total: 115,
    room_surface: 16,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'female_only',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '19h00 - 21h00',
    call_conditions_note: 'WhatsApp en journée.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-09',
    views_count: 220,
    current_flatmates_description: '2 jeunes femmes actives (hôtellerie de luxe et digital nomad). Calmes, propres et chaleureuses.',
    flatmates_list: [
      {
        name: 'Meryem',
        age: 26,
        occupation: 'Guest Relations Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Guéliz', 'Terrasse', 'Filles uniquement', 'Climatisé', 'Télétravail'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'mr-2',
    user_id: 'u-6',
    user: MOCK_USERS.omar,
    listing_type: 'full_apartment',
    title: 'Studio meublé sans intermédiaire - Majorelle / Semlalia',
    description: 'Studio direct propriétaire 45m² climatisé dans une résidence avec piscine à proximité du Jardin Majorelle et de la faculté des sciences Semlalia. Finitions soignées, cuisine américaine équipée, balcon ensoleillé.',
    country_code: 'MA',
    city: 'Marrakech',
    neighborhood: 'Majorelle',
    latitude: 31.6450,
    longitude: -8.0050,
    exact_location_hidden: true,
    price_amount: 3400,
    currency: 'MAD',
    deposit_amount: 3400,
    charges_included: false,
    charges_details: 'Syndic avec piscine 250 DH/mois',
    surface_total: 45,
    room_surface: 20,
    total_rooms: 1,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'any',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: false
    },
    call_conditions_hours: '12h00 - 18h00',
    call_conditions_note: 'Direct propriétaire. 0 DH Semsar garanti.',
    available_from: '2024-08-01',
    min_stay_months: 12,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-05',
    views_count: 170,
    compatibility_tags: ['Majorelle', 'Piscine', 'Direct Propriétaire', 'Clim', '0% Semsar'],
    house_rules: {
      non_smoker: true,
      pets_allowed: true,
      quiet_hours: true,
      overnight_guests: true
    }
  },

  // ==========================================
  // KÉNITRA & AGADIR (2 ANNONCES)
  // ==========================================
  {
    id: 'kn-1',
    user_id: 'u-1',
    user: MOCK_USERS.mehdi,
    listing_type: 'colocation_room',
    title: 'Coloc ingénieurs - Kénitra Centre / proche Gare TGV',
    description: 'Chambre privative dans bel appartement moderne à 4 minutes à pied de la gare Kénitra TGV et des navettes pour l\'Atlantic Free Zone (Stellantis). Appartement tout équipé, salon spacieux, fibre optique 100M.',
    country_code: 'MA',
    city: 'Kénitra',
    neighborhood: 'Centre-Ville',
    latitude: 34.2580,
    longitude: -6.5820,
    exact_location_hidden: false,
    price_amount: 1600,
    currency: 'MAD',
    deposit_amount: 1600,
    charges_included: true,
    charges_details: 'Toutes charges comprises (Fibre 100M, Eau, Électricité)',
    surface_total: 100,
    room_surface: 15,
    total_rooms: 3,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'male_only',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: false,
      parking: true,
      elevator: true,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: false
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '18h30 - 21h00',
    call_conditions_note: 'WhatsApp en journée.',
    available_from: '2024-09-01',
    min_stay_months: 6,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-09',
    views_count: 150,
    current_flatmates_description: '2 ingénieurs chez Stellantis et équipementiers automobiles. Calmes et organisés.',
    flatmates_list: [
      {
        name: 'Anas',
        age: 26,
        occupation: 'Ingénieur Qualité Auto',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Kénitra TGV', 'Atlantic Free Zone', 'Ingénieurs', 'Fibre 100M', 'Calme'],
    house_rules: {
      non_smoker: true,
      pets_allowed: false,
      quiet_hours: true,
      overnight_guests: false
    }
  },
  {
    id: 'ag-1',
    user_id: 'u-4',
    user: MOCK_USERS.karim,
    listing_type: 'colocation_room',
    title: 'Chambre coliving surf & télétravail - Taghazout Bay / Agadir',
    description: 'Chambre en coliving haut standing à Taghazout Bay face à l’océan. Conçu spécialement pour le télétravail et les passionnés de surf. Espace coworking avec fibre très haut débit, cuisine de chef, rooftop avec cours de yoga le weekend.',
    country_code: 'MA',
    city: 'Agadir',
    neighborhood: 'Taghazout Bay',
    latitude: 30.5450,
    longitude: -9.7080,
    exact_location_hidden: false,
    price_amount: 3000,
    currency: 'MAD',
    deposit_amount: 3000,
    charges_included: true,
    charges_details: 'Fibre 200 Mbps, ménage 2x par semaine et toutes charges incluses',
    surface_total: 180,
    room_surface: 18,
    total_rooms: 4,
    available_rooms: 1,
    furnished: true,
    gender_preference: 'mixed',
    occupant_type_preference: 'professionals',
    amenities: {
      wifi_fiber: true,
      washing_machine: true,
      ac: true,
      parking: true,
      elevator: false,
      security_24_7: true,
      kitchen_equipped: true,
      balcony: true,
      private_bathroom: true
    },
    contact_methods: {
      allow_whatsapp: true,
      allow_phone: true,
      allow_internal_chat: true
    },
    call_conditions_hours: '10h00 - 19h00',
    call_conditions_note: 'WhatsApp en anglais ou français bienvenu.',
    available_from: '2024-08-01',
    min_stay_months: 1,
    status: 'active',
    photos: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    created_at: '2024-07-11',
    views_count: 320,
    current_flatmates_description: '3 nomades digitaux et entrepreneurs (freelances tech, design, marketing). Ambiance surf, sport et travail.',
    flatmates_list: [
      {
        name: 'Lucas',
        age: 28,
        occupation: 'Full-Stack Developer (Remote)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
      },
      {
        name: 'Imane',
        age: 27,
        occupation: 'Product Designer (Remote)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
      }
    ],
    compatibility_tags: ['Coliving', 'Taghazout Bay', 'Télétravail', 'Fibre 200M', 'Surf & Océan'],
    house_rules: {
      non_smoker: true,
      pets_allowed: true,
      quiet_hours: true,
      overnight_guests: true,
    }
  }
];

export const INITIAL_LISTINGS: Listing[] = RAW_INITIAL_LISTINGS.map((item) => ({
  ...item,
  is_demo: true,
}));
