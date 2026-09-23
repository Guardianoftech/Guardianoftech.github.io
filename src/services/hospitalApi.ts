const API_URL = import.meta.env.VITE_API_URL || '';
import { demoHospitals } from '../mocks/demoHospitals';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 25000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

/** Great-circle distance in km (Haversine). */
export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if ([lat1, lon1, lat2, lon2].some(v => v === null || v === undefined || Number.isNaN(v))) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
};

const asNameList = (items: any, key: string): string[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((i: any) => (typeof i === 'string' ? i : i?.[key]))
    .filter(Boolean);
};

/**
 * Convert backend hospital objects AND legacy demo data into one canonical
 * shape the UI can rely on: flat lat/lon, string specialty/facility lists,
 * rating, verification flag and a full address string.
 */
export const normalizeHospital = (h: any, userLat?: number, userLon?: number) => {
  const loc = h.location || {};
  const lat = h.lat ?? loc.latitude ?? null;
  const lon = h.lon ?? loc.longitude ?? null;
  const ver = (h.verifications || [])[0];
  const distance = haversineKm(userLat as number, userLon as number, lat, lon);

  return {
    ...h,
    id: h.id ?? h.external_id,
    lat,
    lon,
    distance_km: distance ?? h.distance_km ?? null,
    rating: h.rating ?? (ver?.verified ? 4.6 : 4.2),
    isVerified: h.isVerified ?? Boolean(ver?.verified),
    specialties: asNameList(h.specialties, 'specialty_name'),
    facilities: asNameList(h.facilities, 'facility_name'),
    address: h.address || [loc.address, loc.city, loc.state].filter(Boolean).join(', ') || null,
    city: h.city || loc.city || null,
    patientVolume:
      (h.patient_stats && h.patient_stats[0]?.volume) || h.patient_volume || null,
  };
};

export const fetchHospitals = async (lat: number, lon: number, radius = 50000, type = '', rating = '') => {
  try {
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString(), radius: radius.toString() });
    if (type) params.append('type', type);
    if (rating) params.append('rating', rating);

    const res = await fetchWithTimeout(`${API_URL}/api/v1/hospitals/nearby?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Unexpected response shape');
    return data.map((h: any) => normalizeHospital(h, lat, lon));
  } catch (error) {
    console.warn('Backend not available, using demo data');
    const radiusKm = radius / 1000;
    return demoHospitals
      .map((h: any) => normalizeHospital(h, lat, lon))
      .filter((h: any) => (h.distance_km ?? Infinity) <= radiusKm);
  }
};

export const fetchIntelligentSearch = async (query: string, lat?: number, lon?: number) => {
  try {
    const params = new URLSearchParams({ query });
    if (lat && lon) {
      params.append('lat', lat.toString());
      params.append('lon', lon.toString());
    }
    const res = await fetchWithTimeout(`${API_URL}/api/v1/hospitals/intelligent-search?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Unexpected response shape');
    return data.map((h: any) => normalizeHospital(h, lat, lon));
  } catch (error) {
    console.warn('Backend not available, using demo data');
    const lowerQuery = query.toLowerCase();
    
    // Simulate intelligent NLP by mapping layperson terms to medical specialties
    const synonymMap: Record<string, string[]> = {
      'liver': ['gastroenterology', 'hepatology', 'stomach', 'multi-specialty', 'general medicine'],
      'heart': ['cardiology', 'cardiac', 'multi-specialty'],
      'kidney': ['nephrology', 'urology', 'multi-specialty'],
      'brain': ['neurology', 'psychiatry', 'multi-specialty'],
      'bone': ['orthopedics', 'multi-specialty'],
      'eye': ['ophthalmology', 'multi-specialty'],
      'cancer': ['oncology', 'multi-specialty'],
      'fever': ['general medicine', 'multi-specialty', 'internal medicine', 'pediatrics']
    };

    let searchTerms = [lowerQuery];
    for (const [key, related] of Object.entries(synonymMap)) {
      if (lowerQuery.includes(key)) {
        searchTerms = [...searchTerms, ...related];
      }
    }

    return demoHospitals
      .map((h: any) => normalizeHospital(h, lat, lon))
      .filter((h: any) => {
        // Find if ANY mapped term matches the hospital's profile
        const matches = searchTerms.some(term => 
          (h.best_for && h.best_for.toLowerCase().includes(term)) ||
          h.specialties.some((s: string) => s.toLowerCase().includes(term)) ||
          h.name.toLowerCase().includes(term)
        );
        
        return matches;
      });
  }
};

export const fetchHospitalById = async (id: string | number, lat?: number, lon?: number) => {
  try {
    const params = new URLSearchParams();
    if (lat && lon) {
      params.append('lat', lat.toString());
      params.append('lon', lon.toString());
    }
    const res = await fetchWithTimeout(`${API_URL}/api/v1/hospitals/${id}?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return normalizeHospital(await res.json(), lat, lon);
  } catch (error) {
    console.warn('Backend not available, looking in demo data');
    const demo = demoHospitals
      .map((h: any) => normalizeHospital(h, lat, lon))
      .find((h: any) => String(h.id) === String(id) || h.external_id === id);
    return demo || null;
  }
};

/** Resolve a city / PIN code into coordinates via the backend geocoder. */
export const geocodeArea = async (query: string): Promise<{ lat: number; lon: number; display_name?: string } | null> => {
  if (!query.trim()) return null;
  try {
    const res = await fetchWithTimeout(
      `${API_URL}/api/v1/hospitals/geocode?q=${encodeURIComponent(query.trim())}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { lat: data.lat, lon: data.lon, display_name: data.display_name };
  } catch {
    return null;
  }
};
