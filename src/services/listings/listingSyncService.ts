// ====================================================================
// KRIBLASEMSAR — LISTING SYNC & PERSISTENCE SERVICE
// Platform: https://kriblasemsar.com
// Manages real Supabase persistence and strict separation from demo data
// ====================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Listing } from '../../types';
import { INITIAL_LISTINGS } from '../../data/mockData';

export interface ListingSyncResult {
  isLiveBackend: boolean;
  listings: Listing[];
  realCount: number;
  demoCount: number;
  error?: string;
}

export class ListingSyncService {
  /**
   * Loads listings from Supabase if configured, or falls back to local storage + demo data
   */
  async fetchListings(cityFilter?: string): Promise<ListingSyncResult> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('listings')
          .select(`
            *,
            listing_photos (*),
            profiles:owner_id (
              full_name,
              avatar_path,
              phone_verified_at
            )
          `)
          .eq('status', 'published');

        if (cityFilter) {
          // Join or filter by city
        }

        const { data, error } = await query;
        if (error) {
          console.warn('[ListingSyncService] Supabase fetch error, fallback to local:', error.message);
          return this.getLocalFallback();
        }

        if (data && data.length > 0) {
          const realListings: Listing[] = data.map((row: any) => ({
            id: row.id,
            user_id: row.owner_id,
            user: {
              id: row.owner_id,
              full_name: row.profiles?.full_name || 'Propriétaire',
              avatar_url: row.profiles?.avatar_path || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              phone_number: '', // Protected: never leaked here
              whatsapp_number: '',
              role: 'owner',
              occupation: 'corporate_professional',
              verified_badge: Boolean(row.profiles?.phone_verified_at),
              country_code: 'MA',
              created_at: row.created_at
            },
            listing_type: row.listing_type === 'entire_property' ? 'full_apartment' : 'colocation_room',
            title: row.title,
            description: row.description,
            country_code: 'MA',
            city: row.city_name || 'Maroc',
            neighborhood: row.neighborhood,
            latitude: row.latitude,
            longitude: row.longitude,
            exact_location_hidden: row.exact_location_hidden || true,
            price_amount: Number(row.monthly_price_mad),
            currency: 'MAD',
            deposit_amount: Number(row.deposit_mad || 0),
            charges_included: row.charges_included,
            surface_total: row.surface_m2,
            total_rooms: row.number_of_rooms,
            available_rooms: row.bedrooms,
            furnished: row.furnished,
            gender_preference: row.gender_preference || 'mixed',
            occupant_type_preference: row.occupant_type_preference || 'any',
            amenities: {
              wifi_fiber: true,
              washing_machine: true,
              ac: false,
              parking: false,
              elevator: false,
              security_24_7: false,
              kitchen_equipped: true
            },
            contact_methods: {
              allow_whatsapp: true,
              allow_phone: true,
              allow_internal_chat: false
            },
            call_conditions_hours: row.call_conditions_hours || '18h30 - 21h00',
            call_conditions_note: row.call_conditions_note || 'WhatsApp privilégié',
            available_from: row.available_from,
            min_stay_months: row.minimum_stay_months || 1,
            status: 'active',
            is_demo: false, // REAL LISTING
            photos: row.listing_photos?.map((p: any) => p.storage_path) || [],
            created_at: row.created_at
          }));

          return {
            isLiveBackend: true,
            listings: realListings,
            realCount: realListings.length,
            demoCount: 0
          };
        }
      } catch (err: any) {
        console.warn('[ListingSyncService] Remote connection failed:', err);
      }
    }

    // Fallback: Local storage real user listings + Tagged demo data
    return this.getLocalFallback();
  }

  private getLocalFallback(): ListingSyncResult {
    let localRealListings: Listing[] = [];
    try {
      const saved = localStorage.getItem('kriblasemsar_user_listings');
      if (saved) {
        const parsed: Listing[] = JSON.parse(saved);
        localRealListings = parsed.map((l) => ({ ...l, is_demo: false }));
      }
    } catch {}

    const allListings = [...localRealListings, ...INITIAL_LISTINGS];

    return {
      isLiveBackend: false,
      listings: allListings,
      realCount: localRealListings.length,
      demoCount: INITIAL_LISTINGS.length,
      error: isSupabaseConfigured ? undefined : 'Supabase non configuré (VITE_SUPABASE_URL manquante).'
    };
  }

  /**
   * Persists a newly created listing to Supabase and/or localStorage
   */
  async saveListing(listing: Listing): Promise<{ success: boolean; id: string; persistedRemote: boolean }> {
    let persistedRemote = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('listings').insert({
          title: listing.title,
          description: listing.description,
          listing_type: listing.listing_type === 'full_apartment' ? 'entire_property' : 'private_room',
          property_type: 'apartment',
          monthly_price_mad: listing.price_amount,
          deposit_mad: listing.deposit_amount,
          surface_m2: listing.surface_total,
          number_of_rooms: listing.total_rooms,
          bedrooms: listing.available_rooms,
          bathrooms: 1,
          furnished: listing.furnished,
          neighborhood: listing.neighborhood,
          latitude: listing.latitude,
          longitude: listing.longitude,
          status: 'pending_review' // Must go through moderation!
        }).select().single();

        if (!error && data) {
          persistedRemote = true;
          return { success: true, id: data.id, persistedRemote: true };
        }
      } catch (e) {
        console.warn('[ListingSyncService] Failed to persist to remote Supabase:', e);
      }
    }

    // LocalStorage fallback for offline / prototype resilience
    try {
      const saved = localStorage.getItem('kriblasemsar_user_listings');
      const existing: Listing[] = saved ? JSON.parse(saved) : [];
      const updated = [{ ...listing, is_demo: false }, ...existing];
      localStorage.setItem('kriblasemsar_user_listings', JSON.stringify(updated));
    } catch {}

    return { success: true, id: listing.id, persistedRemote };
  }
}

export const listingSyncService = new ListingSyncService();
