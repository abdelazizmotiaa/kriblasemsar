export type ListingType = 'colocation_room' | 'full_apartment' | 'roommate_search';

export type GenderPreference = 'female_only' | 'male_only' | 'mixed';

export type OccupantTypePreference = 'students' | 'professionals' | 'any';

export type UserRole = 'tenant' | 'flatmate' | 'owner' | 'admin';

export type OccupationType = 'student' | 'phd_researcher' | 'corporate_professional' | 'other';

export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  phone_number: string;
  whatsapp_number: string;
  role: UserRole;
  occupation: OccupationType;
  verified_badge: boolean;
  country_code: string;
  created_at: string;
}

export interface Amenities {
  wifi_fiber: boolean;
  washing_machine: boolean;
  ac: boolean;
  parking: boolean;
  elevator: boolean;
  security_24_7: boolean;
  kitchen_equipped: boolean;
  balcony?: boolean;
  private_bathroom?: boolean;
}

export interface ContactMethods {
  allow_whatsapp: boolean;
  allow_phone: boolean;
  allow_internal_chat: boolean;
}

export interface FlatmateMember {
  name: string;
  age: number;
  occupation: string;
  avatar: string;
}

export interface Listing {
  id: string;
  user_id: string;
  user: User;
  listing_type: ListingType;
  title: string;
  description: string;
  country_code: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  exact_location_hidden: boolean;
  price_amount: number;
  currency: string;
  deposit_amount: number;
  charges_included: boolean;
  charges_details?: string;
  surface_total: number;
  room_surface?: number;
  total_rooms: number;
  available_rooms: number;
  furnished: boolean;
  gender_preference: GenderPreference;
  occupant_type_preference: OccupantTypePreference;
  amenities: Amenities;
  contact_methods: ContactMethods;
  call_conditions_hours: string; // e.g. "18h30 - 21h00"
  call_conditions_note: string; // e.g. "Travail en journée, merci de privilégier WhatsApp"
  available_from: string;
  min_stay_months: number;
  status: 'active' | 'rented' | 'flagged_semsar';
  is_demo?: boolean;
  photos: string[];
  created_at: string;
  views_count?: number;
  current_flatmates_description?: string;
  flatmates_list?: FlatmateMember[];
  compatibility_tags?: string[];
  house_rules?: {
    non_smoker: boolean;
    pets_allowed: boolean;
    quiet_hours: boolean;
    overnight_guests: boolean;
  };
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterState {
  city: string;
  listing_type: ListingType | 'all';
  max_price: number;
  min_price: number;
  gender_preference: GenderPreference | 'all';
  occupant_preference: OccupantTypePreference | 'all';
  furnished: boolean | null;
  fiber_only: boolean;
  charges_included_only: boolean;
  neighborhood: string;
  search_query: string;
  // Plus de filtres (Modal Drawer)
  private_bathroom_only: boolean;
  ac_only: boolean;
  washing_machine_only: boolean;
  elevator_only: boolean;
  parking_only: boolean;
  balcony_only: boolean;
  pets_allowed_only: boolean;
  non_smoker_only: boolean;
  search_as_move: boolean;
}

export interface CityConfig {
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  neighborhoods: string[];
}
