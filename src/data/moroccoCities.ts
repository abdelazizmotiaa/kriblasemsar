import { CityConfig } from '../types';

export interface HubItem {
  name: string;
  type: 'university' | 'business_hub' | 'station' | 'landmark';
  query: string;
  coordinates?: [number, number];
}

export interface MoroccanCity extends CityConfig {
  id: string;
  name: string;
  arabicName: string;
  center: [number, number];
  zoom: number;
  neighborhoods: string[];
  hubs: HubItem[];
  isPopular?: boolean;
  region: string;
}

export const MOROCCO_CITIES: Record<string, MoroccanCity> = {
  Casablanca: {
    id: 'casablanca',
    name: 'Casablanca',
    arabicName: 'الدار البيضاء',
    country: 'Maroc',
    center: [33.5731, -7.6498],
    zoom: 13,
    isPopular: true,
    region: 'Casablanca-Settat',
    neighborhoods: [
      'Tous les quartiers',
      'Maârif & Extension',
      'Gauthier',
      'Bourgogne',
      'Racine / Triangle d’Or',
      'Casa Finance City (CFC)',
      'Sidi Maârouf (Casanearshore)',
      'Oasis',
      'Belvédère',
      'Ain Diab',
      'CIL',
      'Hay Hassani',
      'Centre-Ville'
    ],
    hubs: [
      { name: 'Casa Finance City (CFC)', type: 'business_hub', query: 'cfc', coordinates: [33.5562, -7.6601] },
      { name: 'Casanearshore (Sidi Maârouf)', type: 'business_hub', query: 'casanearshore', coordinates: [33.5285, -7.6420] },
      { name: 'Université Hassan II (Fac de Médecine & Sciences)', type: 'university', query: 'faculte medecine casablanca', coordinates: [33.5815, -7.6250] },
      { name: 'Gare Casa-Port & Marina', type: 'station', query: 'casa port', coordinates: [33.6015, -7.6150] },
      { name: 'Gare Casa-Voyageurs (TGV)', type: 'station', query: 'casa voyageurs', coordinates: [33.5895, -7.5890] }
    ]
  },

  Rabat: {
    id: 'rabat',
    name: 'Rabat',
    arabicName: 'الرباط',
    country: 'Maroc',
    center: [34.0209, -6.8416],
    zoom: 13,
    isPopular: true,
    region: 'Rabat-Salé-Kénitra',
    neighborhoods: [
      'Tous les quartiers',
      'Agdal',
      'Hay Riad',
      'Hassan',
      'Souissi',
      'Les Orangers',
      'Ocean',
      'Diour Jamaa',
      'Technopolis'
    ],
    hubs: [
      { name: 'Agdal Campus (UM5, ENS, EHTP, ENSIAS)', type: 'university', query: 'agdal universite', coordinates: [34.0045, -6.8490] },
      { name: 'Technopolis Rabat-Salé', type: 'business_hub', query: 'technopolis', coordinates: [33.9780, -6.7450] },
      { name: 'Mahaj Riad (Quartier d\'Affaires)', type: 'business_hub', query: 'mahaj riad', coordinates: [33.9680, -6.8770] },
      { name: 'Gare Rabat-Agdal (TGV)', type: 'station', query: 'gare rabat agdal', coordinates: [34.0020, -6.8520] },
      { name: 'Gare Rabat-Ville', type: 'station', query: 'gare rabat ville', coordinates: [34.0150, -6.8360] }
    ]
  },

  Benguerir: {
    id: 'benguerir',
    name: 'Benguerir',
    arabicName: 'ابن جرير',
    country: 'Maroc',
    center: [32.2350, -7.9530],
    zoom: 14,
    isPopular: true,
    region: 'Marrakech-Safi',
    neighborhoods: [
      'Tous les quartiers',
      'Ville Verte / Proche UM6P',
      'Hay Elassil',
      'Hay Al Majd',
      'Centre-Ville',
      'Proche Gare ONCF'
    ],
    hubs: [
      { name: 'Campus UM6P (Université Mohammed VI Polytechnique)', type: 'university', query: 'um6p', coordinates: [32.2215, -7.9395] },
      { name: 'École 1337 Coding School Benguerir', type: 'university', query: '1337 benguerir', coordinates: [32.2250, -7.9380] },
      { name: 'Green Energy Park (IRESEN)', type: 'business_hub', query: 'green energy park', coordinates: [32.2180, -7.9310] },
      { name: 'Gare ONCF Benguerir', type: 'station', query: 'gare benguerir', coordinates: [32.2410, -7.9580] }
    ]
  },

  Tanger: {
    id: 'tanger',
    name: 'Tanger',
    arabicName: 'طنجة',
    country: 'Maroc',
    center: [35.7767, -5.8039],
    zoom: 13,
    isPopular: true,
    region: 'Tanger-Tétouan-Al Hoceïma',
    neighborhoods: [
      'Tous les quartiers',
      'Malabata',
      'Iberia',
      'Centre-Ville',
      'Marshan',
      'Val Fleuri',
      'Tanger City Center',
      'Boukhalef / Proche Université & Free Zone'
    ],
    hubs: [
      { name: 'Boukhalef (Université Abdelmalek Essaâdi & ENSA)', type: 'university', query: 'boukhalef', coordinates: [35.7310, -5.8950] },
      { name: 'Tanger Automotive City & Free Zone', type: 'business_hub', query: 'tanger free zone', coordinates: [35.7150, -5.9120] },
      { name: 'Gare Tanger-Ville (TGV Al Boraq)', type: 'station', query: 'gare tanger ville', coordinates: [35.7725, -5.7920] },
      { name: 'Tanger City Center & Malabata', type: 'landmark', query: 'malabata', coordinates: [35.7790, -5.7850] }
    ]
  },

  Marrakech: {
    id: 'marrakech',
    name: 'Marrakech',
    arabicName: 'مراكش',
    country: 'Maroc',
    center: [31.6295, -7.9811],
    zoom: 13,
    isPopular: true,
    region: 'Marrakech-Safi',
    neighborhoods: [
      'Tous les quartiers',
      'Guéliz',
      'Hivernage',
      'Majorelle',
      'Semlalia',
      'Daoudiate / Proche Cadi Ayyad',
      'Targa',
      'Mhamid'
    ],
    hubs: [
      { name: 'Université Cadi Ayyad (UCA) & Faculté Semlalia', type: 'university', query: 'cadi ayyad semlalia', coordinates: [31.6520, -8.0160] },
      { name: 'Faculté de Médecine et de Pharmacie Marrakech', type: 'university', query: 'faculte medecine marrakech', coordinates: [31.6610, -8.0190] },
      { name: 'Gare ONCF Marrakech', type: 'station', query: 'gare marrakech', coordinates: [31.6310, -8.0180] },
      { name: 'Guéliz & Hivernage', type: 'landmark', query: 'gueliz', coordinates: [31.6360, -8.0120] }
    ]
  },

  Kénitra: {
    id: 'kenitra',
    name: 'Kénitra',
    arabicName: 'القنيطرة',
    country: 'Maroc',
    center: [34.2500, -6.5833],
    zoom: 13,
    isPopular: true,
    region: 'Rabat-Salé-Kénitra',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Mimosa',
      'Maâmora',
      'Bir Rami',
      'Alliance Darna / Proche Atlantic Free Zone & Campus'
    ],
    hubs: [
      { name: 'Campus Université Ibn Tofail (UIT)', type: 'university', query: 'universite ibn tofail', coordinates: [34.2480, -6.5780] },
      { name: 'Atlantic Free Zone (AFZ / Stellantis)', type: 'business_hub', query: 'atlantic free zone', coordinates: [34.3120, -6.5150] },
      { name: 'Gare Kénitra TGV', type: 'station', query: 'gare kenitra', coordinates: [34.2580, -6.5820] }
    ]
  },

  Agadir: {
    id: 'agadir',
    name: 'Agadir & Taghazout',
    arabicName: 'أكادير وتغازوت',
    country: 'Maroc',
    center: [30.4214, -9.5831],
    zoom: 13,
    isPopular: true,
    region: 'Souss-Massa',
    neighborhoods: [
      'Tous les quartiers',
      'Talborjt',
      'Dakhla / Proche Universités',
      'Nouveau Talborjt',
      'Charaf',
      'Taghazout Bay',
      'Hay Salam'
    ],
    hubs: [
      { name: 'Campus Université Ibn Zohr & ENCG Agadir', type: 'university', query: 'ibn zohr encg', coordinates: [30.4120, -9.5580] },
      { name: 'Taghazout Bay (Coliving & Surf Tech Hub)', type: 'landmark', query: 'taghazout bay', coordinates: [30.5450, -9.7080] },
      { name: 'Marina & Front de Mer Agadir', type: 'landmark', query: 'marina agadir', coordinates: [30.4260, -9.6120] }
    ]
  },

  Fès: {
    id: 'fes',
    name: 'Fès',
    arabicName: 'فاس',
    country: 'Maroc',
    center: [34.0333, -5.0000],
    zoom: 13,
    region: 'Fès-Meknès',
    neighborhoods: [
      'Tous les quartiers',
      'Ville Nouvelle',
      'Narjiss',
      'Champs de Course',
      'Route d\'Immouzzer / Proche Facultés',
      'Atlas'
    ],
    hubs: [
      { name: 'Campus Route d\'Immouzzer (USMBA & Fac Sciences)', type: 'university', query: 'usmba fes', coordinates: [33.9980, -4.9920] },
      { name: 'Université Euromed de Fès (UEMF)', type: 'university', query: 'euromed uemf fes', coordinates: [34.0720, -4.9580] },
      { name: 'Gare Fès-Ville', type: 'station', query: 'gare fes ville', coordinates: [34.0430, -5.0050] }
    ]
  },

  Meknès: {
    id: 'meknes',
    name: 'Meknès',
    arabicName: 'مكناس',
    country: 'Maroc',
    center: [33.8833, -5.5500],
    zoom: 13,
    region: 'Fès-Meknès',
    neighborhoods: [
      'Tous les quartiers',
      'Hamria',
      'Mansour',
      'Marjane',
      'Bassatine',
      'Zitoune'
    ],
    hubs: [
      { name: 'ENSAM Meknès & Faculté Moulay Ismail', type: 'university', query: 'ensam meknes', coordinates: [33.8780, -5.5410] },
      { name: 'Gare Meknès-Ville / Hamria', type: 'station', query: 'gare meknes', coordinates: [33.8960, -5.5450] }
    ]
  },

  Tetouan: {
    id: 'tetouan',
    name: 'Tétouan & Martil',
    arabicName: 'تطوان ومرتيل',
    country: 'Maroc',
    center: [35.5667, -5.3667],
    zoom: 13,
    region: 'Tanger-Tétouan-Al Hoceïma',
    neighborhoods: [
      'Tous les quartiers',
      'Martil Front de Mer / Campus Abdelmalek Essaâdi',
      'Wilaya',
      'Centre Tétouan',
      'Touabel',
      'Mirador (Martil)'
    ],
    hubs: [
      { name: 'Campus Abdelmalek Essaâdi (Martil)', type: 'university', query: 'campus martil', coordinates: [35.6180, -5.2750] },
      { name: 'Faculté des Sciences de Tétouan', type: 'university', query: 'faculte sciences tetouan', coordinates: [35.5780, -5.3520] },
      { name: 'Plage & Corniche Martil', type: 'landmark', query: 'martil plage', coordinates: [35.6167, -5.2667] }
    ]
  },

  Oujda: {
    id: 'oujda',
    name: 'Oujda',
    arabicName: 'وجدة',
    country: 'Maroc',
    center: [34.6867, -1.9114],
    zoom: 13,
    region: 'Oriental',
    neighborhoods: [
      'Tous les quartiers',
      'Al Qods',
      'Centre-Ville',
      'Lazaret / Proche Université Mohammed Ier',
      'Hay Al Hikma'
    ],
    hubs: [
      { name: 'Campus Université Mohammed Premier (UMP)', type: 'university', query: 'universite mohammed premier oujda', coordinates: [34.6540, -1.8950] },
      { name: 'Technopole Oujda', type: 'business_hub', query: 'technopole oujda', coordinates: [34.7210, -1.9320] },
      { name: 'Gare ONCF Oujda', type: 'station', query: 'gare oujda', coordinates: [34.6850, -1.9160] }
    ]
  },

  ElJadida: {
    id: 'el-jadida',
    name: 'El Jadida',
    arabicName: 'الجديدة',
    country: 'Maroc',
    center: [33.2566, -8.5025],
    zoom: 13,
    region: 'Casablanca-Settat',
    neighborhoods: [
      'Tous les quartiers',
      'Plateau',
      'Najmat Al Janoub',
      'Proche Université Chouaib Doukkali & Jorf Lasfar',
      'Centre-Ville'
    ],
    hubs: [
      { name: 'Campus Université Chouaib Doukkali & ENCG', type: 'university', query: 'chouaib doukkali', coordinates: [33.2380, -8.4980] },
      { name: 'Pôle Industriel & Port Jorf Lasfar (OCP)', type: 'business_hub', query: 'jorf lasfar', coordinates: [33.1250, -8.6250] }
    ]
  },

  Mohammedia: {
    id: 'mohammedia',
    name: 'Mohammedia',
    arabicName: 'المحمدية',
    country: 'Maroc',
    center: [33.6833, -7.3833],
    zoom: 13,
    region: 'Casablanca-Settat',
    neighborhoods: [
      'Tous les quartiers',
      'Parc',
      'Monica',
      'El Alia',
      'Kasbah / Proche Faculté de Droit & ENSET'
    ],
    hubs: [
      { name: 'ENSET Mohammedia & Faculté des Sciences Juridiques', type: 'university', query: 'enset mohammedia', coordinates: [33.7020, -7.3910] },
      { name: 'Gare Mohammedia ONCF', type: 'station', query: 'gare mohammedia', coordinates: [33.6890, -7.3880] }
    ]
  },

  Ifrane: {
    id: 'ifrane',
    name: 'Ifrane',
    arabicName: 'إفران',
    country: 'Maroc',
    center: [33.5228, -5.1100],
    zoom: 14,
    region: 'Fès-Meknès',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Quartier Atlas / Proche Al Akhawayn University',
      'Hay Riad'
    ],
    hubs: [
      { name: 'Al Akhawayn University in Ifrane (AUI)', type: 'university', query: 'al akhawayn aui', coordinates: [33.5385, -5.1050] }
    ]
  },

  SaleTemara: {
    id: 'sale-temara',
    name: 'Salé & Témara',
    arabicName: 'سلا وتمارة',
    country: 'Maroc',
    center: [34.0531, -6.7985],
    zoom: 13,
    region: 'Rabat-Salé-Kénitra',
    neighborhoods: [
      'Tous les quartiers',
      'Tabriquet (Salé)',
      'Bettana (Salé)',
      'Harhoura (Témara)',
      'Wifaq (Témara)',
      'Sala Al Jadida'
    ],
    hubs: [
      { name: 'Technopolis & Université Internationale de Rabat (UIR)', type: 'university', query: 'uir technopolis', coordinates: [33.9820, -6.7320] },
      { name: 'Gare Salé Tabriquet', type: 'station', query: 'gare sale tabriquet', coordinates: [34.0480, -6.8090] }
    ]
  },

  BeniMellal: {
    id: 'beni-mellal',
    name: 'Béni Mellal',
    arabicName: 'بني ملال',
    country: 'Maroc',
    center: [32.3394, -6.3608],
    zoom: 13,
    region: 'Béni Mellal-Khénifra',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Hay Al Qods',
      'Mghila / Proche Université Sultan Moulay Slimane'
    ],
    hubs: [
      { name: 'Université Sultan Moulay Slimane (Mghila)', type: 'university', query: 'universite sultan moulay slimane', coordinates: [32.3610, -6.3210] }
    ]
  },

  Safi: {
    id: 'safi',
    name: 'Safi',
    arabicName: 'آسفي',
    country: 'Maroc',
    center: [32.2994, -9.2372],
    zoom: 13,
    region: 'Marrakech-Safi',
    neighborhoods: [
      'Tous les quartiers',
      'Plateau',
      'Biadha',
      'Sidi Bouzid',
      'Proche Faculté Polydisciplinaire & Port OCP'
    ],
    hubs: [
      { name: 'Faculté Polydisciplinaire de Safi & ENSA', type: 'university', query: 'faculte safi', coordinates: [32.3210, -9.2450] }
    ]
  },

  Nador: {
    id: 'nador',
    name: 'Nador',
    arabicName: 'الناظور',
    country: 'Maroc',
    center: [35.1667, -2.9333],
    zoom: 13,
    region: 'Oriental',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Al Matar',
      'Hay Al Wahda',
      'Marchica'
    ],
    hubs: [
      { name: 'Faculté Pluridisciplinaire de Nador (Selouane)', type: 'university', query: 'faculte nador selouane', coordinates: [35.0820, -2.9510] }
    ]
  },

  Khouribga: {
    id: 'khouribga',
    name: 'Khouribga',
    arabicName: 'خريبكة',
    country: 'Maroc',
    center: [32.8811, -6.9063],
    zoom: 13,
    region: 'Béni Mellal-Khénifra',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Hay Al Hanaa',
      'Proche École Nationale des Sciences Appliquées (ENSA) & 1337 Khouribga'
    ],
    hubs: [
      { name: 'École 1337 Khouribga & ENSA', type: 'university', query: '1337 khouribga', coordinates: [32.8890, -6.9150] }
    ]
  },

  Settat: {
    id: 'settat',
    name: 'Settat',
    arabicName: 'سطات',
    country: 'Maroc',
    center: [33.0010, -7.6166],
    zoom: 13,
    region: 'Casablanca-Settat',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Hay Salam',
      'Proche Université Hassan 1er & ENCG Settat'
    ],
    hubs: [
      { name: 'Université Hassan 1er & ENCG Settat', type: 'university', query: 'encg settat', coordinates: [32.9890, -7.6020] }
    ]
  },

  Dakhla: {
    id: 'dakhla',
    name: 'Dakhla',
    arabicName: 'الداخلة',
    country: 'Maroc',
    center: [23.7136, -15.9355],
    zoom: 13,
    region: 'Dakhla-Oued Ed-Dahab',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Oum Labouir',
      'Baie de Dakhla (Kitesurf Hub)',
      'Al Wahda'
    ],
    hubs: [
      { name: 'Baie de Dakhla & Lagon (Hub Télétravail & Nomades)', type: 'landmark', query: 'baie dakhla', coordinates: [23.7500, -15.9100] },
      { name: 'ENCG Dakhla', type: 'university', query: 'encg dakhla', coordinates: [23.7220, -15.9410] }
    ]
  },

  Laayoune: {
    id: 'laayoune',
    name: 'Laâyoune',
    arabicName: 'العيون',
    country: 'Maroc',
    center: [27.1536, -13.2033],
    zoom: 13,
    region: 'Laâyoune-Sakia El Hamra',
    neighborhoods: [
      'Tous les quartiers',
      'Centre-Ville',
      'Al Wifaq',
      'Hay Al Qods',
      'Proche Cité des Métiers et des Compétences'
    ],
    hubs: [
      { name: 'Faculté de Médecine Laâyoune & CMC', type: 'university', query: 'faculte medecine laayoune', coordinates: [27.1650, -13.1950] }
    ]
  }
};

// Autocomplete suggestion item
export interface SearchSuggestion {
  id: string;
  type: 'city' | 'neighborhood' | 'hub';
  title: string;
  subtitle: string;
  cityKey: string;
  neighborhood?: string;
  coordinates: [number, number];
  zoom: number;
}

// Global search / autocomplete function
export function searchMoroccoLocations(query: string): SearchSuggestion[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: SearchSuggestion[] = [];

  Object.entries(MOROCCO_CITIES).forEach(([cityKey, city]) => {
    // 1. Match City Name
    if (
      city.name.toLowerCase().includes(clean) ||
      city.arabicName.includes(clean) ||
      cityKey.toLowerCase().includes(clean)
    ) {
      results.push({
        id: `city-${cityKey}`,
        type: 'city',
        title: city.name,
        subtitle: `${city.arabicName} • Région ${city.region}`,
        cityKey: cityKey,
        coordinates: city.center,
        zoom: city.zoom
      });
    }

    // 2. Match Neighborhoods
    city.neighborhoods.forEach((neigh) => {
      if (neigh === 'Tous les quartiers') return;
      if (neigh.toLowerCase().includes(clean)) {
        results.push({
          id: `neigh-${cityKey}-${neigh}`,
          type: 'neighborhood',
          title: neigh,
          subtitle: `Quartier à ${city.name}`,
          cityKey: cityKey,
          neighborhood: neigh,
          coordinates: city.center,
          zoom: Math.min(city.zoom + 1, 15)
        });
      }
    });

    // 3. Match Hubs (universities, corporate centers, stations)
    city.hubs.forEach((hub) => {
      if (
        hub.name.toLowerCase().includes(clean) ||
        hub.query.toLowerCase().includes(clean)
      ) {
        results.push({
          id: `hub-${cityKey}-${hub.name}`,
          type: 'hub',
          title: hub.name,
          subtitle: `${hub.type === 'university' ? '🎓 Campus / Université' : hub.type === 'business_hub' ? '🏢 Pôle économique' : hub.type === 'station' ? '🚆 Gare' : '📍 Point d\'intérêt'} • ${city.name}`,
          cityKey: cityKey,
          coordinates: hub.coordinates || city.center,
          zoom: hub.coordinates ? 15 : city.zoom
        });
      }
    });
  });

  return results.slice(0, 8);
}
