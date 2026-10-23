// ====================================================================
// KRIBLASEMSAR DATABASE TYPES (TypeScript Definitions)
// Platform: https://kriblasemsar.com
// ====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserType = 'tenant' | 'owner' | 'flatmate' | 'authorized_representative';
export type ListingType = 'private_room' | 'shared_room' | 'entire_property';
export type PropertyType = 'apartment' | 'studio' | 'house' | 'villa' | 'student_residence' | 'other';
export type ListingStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'suspended' | 'rented' | 'expired';
export type VerificationStatus = 'unverified' | 'phone_verified' | 'document_submitted' | 'fully_verified';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          display_name: string | null;
          email: string;
          phone_e164: string | null;
          phone_verified_at: string | null;
          user_type: UserType;
          preferred_language: 'fr' | 'ar' | 'en';
          avatar_path: string | null;
          account_status: 'active' | 'suspended' | 'pending_verification' | 'banned';
          trust_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          display_name?: string | null;
          email: string;
          phone_e164?: string | null;
          phone_verified_at?: string | null;
          user_type?: UserType;
          preferred_language?: 'fr' | 'ar' | 'en';
          avatar_path?: string | null;
          account_status?: 'active' | 'suspended' | 'pending_verification' | 'banned';
          trust_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          display_name?: string | null;
          email?: string;
          phone_e164?: string | null;
          preferred_language?: 'fr' | 'ar' | 'en';
          avatar_path?: string | null;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name_fr: string;
          name_ar: string;
          slug: string;
          region: string;
          latitude: number;
          longitude: number;
          popular: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_fr: string;
          name_ar: string;
          slug: string;
          region: string;
          latitude: number;
          longitude: number;
          popular?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cities']['Insert']>;
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          city_id: string;
          title: string;
          description: string;
          listing_type: ListingType;
          property_type: PropertyType;
          monthly_price_mad: number;
          deposit_mad: number;
          additional_charges_mad: number;
          charges_included: boolean;
          charges_details: string | null;
          number_of_rooms: number;
          bedrooms: number;
          bathrooms: number;
          surface_m2: number;
          furnished: boolean;
          available_from: string;
          minimum_stay_months: number;
          neighborhood: string;
          private_address: string | null;
          latitude: number;
          longitude: number;
          exact_location_hidden: boolean;
          status: ListingStatus;
          verification_status: VerificationStatus;
          views_count: number;
          gender_preference: 'mixed' | 'female_only' | 'male_only';
          occupant_type_preference: 'any' | 'students' | 'professionals';
          call_conditions_hours: string;
          call_conditions_note: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          city_id: string;
          title: string;
          description: string;
          listing_type: ListingType;
          property_type: PropertyType;
          monthly_price_mad: number;
          deposit_mad?: number;
          additional_charges_mad?: number;
          charges_included?: boolean;
          charges_details?: string | null;
          number_of_rooms?: number;
          bedrooms?: number;
          bathrooms?: number;
          surface_m2: number;
          furnished?: boolean;
          available_from?: string;
          minimum_stay_months?: number;
          neighborhood: string;
          private_address?: string | null;
          latitude: number;
          longitude: number;
          exact_location_hidden?: boolean;
          status?: ListingStatus;
          verification_status?: VerificationStatus;
          views_count?: number;
          gender_preference?: 'mixed' | 'female_only' | 'male_only';
          occupant_type_preference?: 'any' | 'students' | 'professionals';
          call_conditions_hours?: string;
          call_conditions_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };
      listing_photos: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          sort_order: number;
          width: number | null;
          height: number | null;
          mime_type: string;
          file_size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          storage_path: string;
          sort_order?: number;
          width?: number | null;
          height?: number | null;
          mime_type?: string;
          file_size?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['listing_photos']['Insert']>;
      };
      listing_amenities: {
        Row: {
          listing_id: string;
          wifi_fiber: boolean;
          washing_machine: boolean;
          ac: boolean;
          parking: boolean;
          elevator: boolean;
          security_24_7: boolean;
          kitchen_equipped: boolean;
          balcony: boolean;
          private_bathroom: boolean;
        };
        Insert: {
          listing_id: string;
          wifi_fiber?: boolean;
          washing_machine?: boolean;
          ac?: boolean;
          parking?: boolean;
          elevator?: boolean;
          security_24_7?: boolean;
          kitchen_equipped?: boolean;
          balcony?: boolean;
          private_bathroom?: boolean;
        };
        Update: Partial<Database['public']['Tables']['listing_amenities']['Insert']>;
      };
      seeker_profiles: {
        Row: {
          id: string;
          user_id: string;
          preferred_city_id: string;
          preferred_neighborhoods: string[];
          min_budget_mad: number;
          max_budget_mad: number;
          desired_move_in_date: string;
          preferred_housing_type: ListingType;
          gender_preference: string;
          short_introduction: string | null;
          profile_visibility: 'public' | 'verified_only' | 'hidden';
          contact_preference: 'whatsapp' | 'phone' | 'platform';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferred_city_id: string;
          preferred_neighborhoods?: string[];
          min_budget_mad?: number;
          max_budget_mad?: number;
          desired_move_in_date?: string;
          preferred_housing_type?: ListingType;
          gender_preference?: string;
          short_introduction?: string | null;
          profile_visibility?: 'public' | 'verified_only' | 'hidden';
          contact_preference?: 'whatsapp' | 'phone' | 'platform';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['seeker_profiles']['Insert']>;
      };
      favorites: {
        Row: {
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
      listing_reports: {
        Row: {
          id: string;
          listing_id: string;
          reporter_id: string;
          reason: string;
          evidence_notes: string | null;
          status: 'pending' | 'investigating' | 'resolved_action_taken' | 'dismissed';
          reviewed_by: string | null;
          reviewed_at: string | null;
          resolution_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          reporter_id: string;
          reason: string;
          evidence_notes?: string | null;
          status?: 'pending' | 'investigating' | 'resolved_action_taken' | 'dismissed';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['listing_reports']['Insert']>;
      };
      contact_events: {
        Row: {
          id: string;
          listing_id: string;
          requester_id: string;
          owner_id: string;
          contact_type: 'whatsapp_click' | 'phone_call_reveal' | 'internal_message';
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          requester_id: string;
          owner_id: string;
          contact_type: 'whatsapp_click' | 'phone_call_reveal' | 'internal_message';
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: never;
      };
      phone_verifications: {
        Row: {
          id: string;
          user_id: string;
          phone_e164: string;
          channel: 'whatsapp' | 'sms';
          attempts: number;
          max_attempts: number;
          expires_at: string;
          verified_at: string | null;
          cost_estimate_mad: number;
          created_at: string;
        };
        Insert: never;
        Update: never;
      };
      admin_roles: {
        Row: {
          id: string;
          user_id: string;
          role_name: 'super_admin' | 'moderator' | 'support';
          granted_at: string;
        };
        Insert: {
          user_id: string;
          role_name: 'super_admin' | 'moderator' | 'support';
        };
        Update: never;
      };
    };
    Functions: {
      get_listings_in_bbox: {
        Args: {
          min_lng: number;
          min_lat: number;
          max_lng: number;
          max_lat: number;
          filter_city_id?: string;
          filter_listing_type?: string;
          filter_max_price?: number;
          filter_min_price?: number;
          filter_gender?: string;
          filter_furnished?: boolean;
          filter_wifi_fiber?: boolean;
          filter_charges_included?: boolean;
          limit_count?: number;
          offset_count?: number;
        };
        Returns: {
          id: string;
          owner_id: string;
          city_id: string;
          title: string;
          description: string;
          listing_type: ListingType;
          property_type: PropertyType;
          monthly_price_mad: number;
          deposit_mad: number;
          additional_charges_mad: number;
          charges_included: boolean;
          charges_details: string | null;
          surface_total: number;
          number_of_rooms: number;
          bedrooms: number;
          bathrooms: number;
          furnished: boolean;
          available_from: string;
          neighborhood: string;
          latitude: number;
          longitude: number;
          exact_location_hidden: boolean;
          status: ListingStatus;
          gender_preference: string;
          occupant_type_preference: string;
          call_conditions_hours: string;
          call_conditions_note: string | null;
          photos: string[];
          created_at: string;
          owner_full_name: string;
          owner_avatar: string | null;
          owner_verified: boolean;
        }[];
      };
      reveal_contact_info: {
        Args: {
          target_listing_id: string;
          user_ip_str?: string;
          user_agent_str?: string;
        };
        Returns: {
          success: boolean;
          owner_name: string;
          phone_e164: string;
          whatsapp_url: string;
          call_hours: string;
          call_note: string | null;
          remaining_reveals_today: number;
        };
      };
      submit_listing_for_review: {
        Args: {
          target_listing_id: string;
        };
        Returns: {
          success: boolean;
          status: string;
        };
      };
      moderate_listing: {
        Args: {
          target_listing_id: string;
          new_status: string;
          reason_text?: string;
        };
        Returns: {
          success: boolean;
          status: string;
        };
      };
    };
  };
}
