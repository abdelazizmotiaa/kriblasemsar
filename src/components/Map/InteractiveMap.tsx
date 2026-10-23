import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ChevronLeft, ChevronRight, X, ExternalLink, ShieldCheck, Wifi, Home } from 'lucide-react';
import { Listing, MapBounds } from '../../types';
import { MOROCCO_CITIES } from '../../data/moroccoCities';

interface TargetFlyTo {
  center: [number, number];
  zoom: number;
  timestamp: number;
}

interface InteractiveMapProps {
  listings: Listing[];
  selectedListingId: string | null;
  hoveredListingId: string | null;
  onSelectListing: (listing: Listing) => void;
  onOpenDetailModal?: (listing: Listing) => void;
  selectedCity: string;
  onSelectCity?: (city: string) => void;
  targetFlyTo?: TargetFlyTo | null;
  isPinDropMode?: boolean;
  droppedPin?: [number, number] | null;
  onPinDropped?: (lat: number, lng: number) => void;
  exactLocationHidden?: boolean;
  onBoundsChange?: (bounds: MapBounds) => void;
  searchAsMove?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  listings,
  selectedListingId,
  hoveredListingId,
  onSelectListing,
  onOpenDetailModal,
  selectedCity,
  onSelectCity,
  targetFlyTo,
  isPinDropMode = false,
  droppedPin = null,
  onPinDropped,
  exactLocationHidden = false,
  onBoundsChange,
  searchAsMove = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const clusterMarkersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<Map<string, L.Circle>>(new Map());
  const dropMarkerRef = useRef<L.Marker | null>(null);
  const dropCircleRef = useRef<L.Circle | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(13);
  // Mobile Tap-to-Preview state
  const [previewListing, setPreviewListing] = useState<Listing | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const cityConfig = MOROCCO_CITIES[selectedCity] || MOROCCO_CITIES.Casablanca;

    // Use CartoDB Voyager tiles with authenticated API key from environment
    const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
    const tileUrl = cartoApiKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // Morocco Strict Bounds
    const moroccoBounds: L.LatLngBoundsLiteral = [
      [21.0, -18.0],
      [36.0, -1.0]
    ];

    const map = L.map(mapContainerRef.current, {
      center: cityConfig.center,
      zoom: cityConfig.zoom,
      minZoom: 5,
      maxBounds: moroccoBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Zoom controls bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    setCurrentZoom(map.getZoom());

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Dismiss preview when clicking empty map area
    map.on('click', (e) => {
      const target = e.originalEvent?.target as HTMLElement;
      if (!target?.closest('.leaflet-price-marker') && !target?.closest('.city-cluster-badge')) {
        setPreviewListing(null);
      }
    });

    // Handle bounds change on move/zoom
    map.on('moveend', () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const cityConfig = MOROCCO_CITIES[selectedCity];
    if (cityConfig) {
      setPreviewListing(null);
      mapInstanceRef.current.flyTo(cityConfig.center, cityConfig.zoom, {
        duration: 1.2,
      });
    }
  }, [selectedCity]);

  // Handle Target FlyTo (e.g. from Autocomplete selection)
  useEffect(() => {
    if (!mapInstanceRef.current || !targetFlyTo) return;
    setPreviewListing(null);
    mapInstanceRef.current.flyTo(targetFlyTo.center, targetFlyTo.zoom, {
      duration: 1.4,
    });
  }, [targetFlyTo]);

  // Handle Pin Drop Mode (Wizard)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isPinDropMode) {
      if (dropMarkerRef.current) {
        dropMarkerRef.current.remove();
        dropMarkerRef.current = null;
      }
      if (dropCircleRef.current) {
        dropCircleRef.current.remove();
        dropCircleRef.current = null;
      }
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (onPinDropped) {
        onPinDropped(e.latlng.lat, e.latlng.lng);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPinDropMode, onPinDropped]);

  // Update Dropped Pin for Wizard
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isPinDropMode) return;

    if (droppedPin) {
      const [lat, lng] = droppedPin;

      if (!dropMarkerRef.current) {
        const dropIcon = L.divIcon({
          className: 'custom-drop-pin',
          html: `
            <div style="
              width: 38px;
              height: 38px;
              background: #10B981;
              color: white;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: grab;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });

        const marker = L.marker([lat, lng], { icon: dropIcon, draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const newPos = marker.getLatLng();
          if (onPinDropped) onPinDropped(newPos.lat, newPos.lng);
        });
        dropMarkerRef.current = marker;
      } else {
        dropMarkerRef.current.setLatLng([lat, lng]);
      }

      // If exact location hidden, draw 200m circle
      if (exactLocationHidden) {
        if (!dropCircleRef.current) {
          dropCircleRef.current = L.circle([lat, lng], {
            radius: 200,
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '4, 4',
          }).addTo(map);
        } else {
          dropCircleRef.current.setLatLng([lat, lng]);
        }
      } else if (dropCircleRef.current) {
        dropCircleRef.current.remove();
        dropCircleRef.current = null;
      }
    }
  }, [droppedPin, isPinDropMode, exactLocationHidden, onPinDropped]);

  // Render & Update Listings Pins & Spiderfier / Clusters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isPinDropMode) return;

    // Clear existing cluster badges
    clusterMarkersRef.current.forEach((m) => m.remove());
    clusterMarkersRef.current = [];

    // 1. Zoomed-out Nationwide Clustering (zoom <= 8)
    if (currentZoom <= 8) {
      // Clear individual listing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      circlesRef.current.forEach((c) => c.remove());
      circlesRef.current.clear();

      // Aggregate listings by city
      const cityCounts: Record<string, number> = {};
      listings.forEach((l) => {
        cityCounts[l.city] = (cityCounts[l.city] || 0) + 1;
      });

      Object.entries(cityCounts).forEach(([cityName, count]) => {
        const cityConfig = MOROCCO_CITIES[cityName];
        if (!cityConfig) return;

        const clusterHtml = `
          <div class="city-cluster-badge">
            <span>📍 ${cityName}</span>
            <span class="cluster-count">${count}</span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'city-cluster-marker',
          html: clusterHtml,
          iconSize: [120, 34],
          iconAnchor: [60, 17],
        });

        const marker = L.marker(cityConfig.center, { icon, zIndexOffset: 2000 }).addTo(map);
        marker.on('click', () => {
          if (onSelectCity) onSelectCity(cityName);
          map.flyTo(cityConfig.center, cityConfig.zoom, { duration: 1.2 });
        });

        clusterMarkersRef.current.push(marker);
      });

      return;
    }

    // 2. Normal / Zoomed-in View (> 8): Individual Pins with Spiderfier Offset
    const currentListingIds = new Set(listings.map((l) => l.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentListingIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
    circlesRef.current.forEach((circle, id) => {
      if (!currentListingIds.has(id)) {
        circle.remove();
        circlesRef.current.delete(id);
      }
    });

    // Group near-identical coordinates to apply Spiderfier radial offset
    const coordinateGroups: Record<string, Listing[]> = {};
    listings.forEach((l) => {
      const key = `${l.latitude.toFixed(3)}_${l.longitude.toFixed(3)}`;
      if (!coordinateGroups[key]) coordinateGroups[key] = [];
      coordinateGroups[key].push(l);
    });

    listings.forEach((listing) => {
      const key = `${listing.latitude.toFixed(3)}_${listing.longitude.toFixed(3)}`;
      const group = coordinateGroups[key] || [listing];
      let displayLat = listing.latitude;
      let displayLng = listing.longitude;

      if (group.length > 1) {
        const index = group.findIndex((item) => item.id === listing.id);
        const angle = (index / group.length) * 2 * Math.PI;
        const radius = 0.00032; // ~35m radial spread
        displayLat += Math.sin(angle) * radius;
        displayLng += Math.cos(angle) * (radius / Math.cos((listing.latitude * Math.PI) / 180));
      }

      const isSelected = selectedListingId === listing.id || previewListing?.id === listing.id;
      const isHovered = hoveredListingId === listing.id;
      const activeClass = isSelected || isHovered ? 'active' : '';

      // Determine pin type color
      let typeClass = 'price-pin-colocation';
      if (listing.listing_type === 'full_apartment') {
        typeClass = 'price-pin-apartment';
      } else if (listing.listing_type === 'roommate_search') {
        typeClass = 'price-pin-roommate';
      }

      const formattedPrice = listing.price_amount.toLocaleString('fr-FR');
      const html = `
        <div class="price-pin ${typeClass} ${activeClass}" id="marker-${listing.id}">
          <span>${formattedPrice} DH</span>
        </div>
      `;

      const icon = L.divIcon({
        className: 'leaflet-price-marker',
        html: html,
        iconSize: [84, 32],
        iconAnchor: [42, 32],
      });

      let marker = markersRef.current.get(listing.id);
      if (!marker) {
        marker = L.marker([displayLat, displayLng], {
          icon,
          zIndexOffset: isSelected || isHovered ? 1000 : 10,
        }).addTo(map);

        marker.on('click', () => {
          setPreviewListing(listing);
          onSelectListing(listing);
          map.panTo([displayLat, displayLng], { animate: true, duration: 0.4 });
        });

        markersRef.current.set(listing.id, marker);
      } else {
        marker.setLatLng([displayLat, displayLng]);
        marker.setIcon(icon);
        marker.setZIndexOffset(isSelected || isHovered ? 1000 : 10);
      }

      // Handle Privacy Circle for listings with exact_location_hidden
      if (listing.exact_location_hidden) {
        let circle = circlesRef.current.get(listing.id);
        if (!circle) {
          circle = L.circle([displayLat, displayLng], {
            radius: 180,
            color: listing.listing_type === 'full_apartment' ? '#10B981' : '#3B82F6',
            fillColor: listing.listing_type === 'full_apartment' ? '#10B981' : '#3B82F6',
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '3, 4',
          }).addTo(map);
          circlesRef.current.set(listing.id, circle);
        } else {
          circle.setLatLng([displayLat, displayLng]);
        }
      } else {
        const existingCircle = circlesRef.current.get(listing.id);
        if (existingCircle) {
          existingCircle.remove();
          circlesRef.current.delete(listing.id);
        }
      }
    });
  }, [listings, selectedListingId, hoveredListingId, previewListing, onSelectListing, isPinDropMode, currentZoom, onSelectCity]);

  // Center on selected listing from props
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedListingId) return;
    const selected = listings.find((l) => l.id === selectedListingId);
    if (selected) {
      mapInstanceRef.current.panTo([selected.latitude, selected.longitude], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedListingId, listings]);

  // Cycle to next / prev listing in preview
  const handleNextPreview = () => {
    if (!previewListing || listings.length === 0) return;
    const currentIndex = listings.findIndex((l) => l.id === previewListing.id);
    const nextIndex = (currentIndex + 1) % listings.length;
    const nextListing = listings[nextIndex];
    setPreviewListing(nextListing);
    onSelectListing(nextListing);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([nextListing.latitude, nextListing.longitude], {
        animate: true,
        duration: 0.4,
      });
    }
  };

  const handlePrevPreview = () => {
    if (!previewListing || listings.length === 0) return;
    const currentIndex = listings.findIndex((l) => l.id === previewListing.id);
    const prevIndex = (currentIndex - 1 + listings.length) % listings.length;
    const prevListing = listings[prevIndex];
    setPreviewListing(prevListing);
    onSelectListing(prevListing);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([prevListing.latitude, prevListing.longitude], {
        animate: true,
        duration: 0.4,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend Overlay (Top Left) */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 px-3 py-2 text-xs hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-sm"></span>
          <span>Chambre Coloc</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
          <span>Logement Entier</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
          <span>Recherche Coloc</span>
        </div>
      </div>

      {/* Floating Mobile Tap-to-Preview Card (Bottom Center) */}
      {previewListing && (
        <div className="absolute bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-[500] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col p-3 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setPreviewListing(null)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center text-xs z-20 backdrop-blur-sm"
              title="Fermer la prévisualisation"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thumbnail and Details Row */}
            <div className="flex gap-3">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={previewListing.photos[0]}
                  alt={previewListing.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  📷 {previewListing.photos.length}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        previewListing.listing_type === 'colocation_room'
                          ? 'bg-blue-100 text-blue-800'
                          : previewListing.listing_type === 'full_apartment'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {previewListing.listing_type === 'colocation_room'
                        ? 'Coloc'
                        : previewListing.listing_type === 'full_apartment'
                        ? 'Entier'
                        : 'Recherche'}
                    </span>
                    <span className="text-emerald-700 flex items-center gap-0.5 text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      0% Semsar
                    </span>
                  </div>

                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    {previewListing.price_amount.toLocaleString('fr-FR')}{' '}
                    <span className="text-xs font-semibold text-slate-500">DH/mois</span>
                  </p>

                  <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                    {previewListing.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    📍 {previewListing.neighborhood} ({previewListing.city})
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities and Action Footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                  {previewListing.surface_total} m²
                </span>
                {previewListing.furnished && (
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                    <Home className="w-2.5 h-2.5 text-slate-500" /> Meublé
                  </span>
                )}
                {previewListing.amenities.wifi_fiber && (
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                    <Wifi className="w-2.5 h-2.5" /> Fibre
                  </span>
                )}
              </div>

              {/* Prev / Next & View Button */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPreview}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Annonce précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPreview}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Annonce suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (onOpenDetailModal) onOpenDetailModal(previewListing);
                  }}
                  className="ml-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
                >
                  <span>Voir</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
