import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HospitalMap } from '../components/hospitals/HospitalMap';
import { HospitalCard } from '../components/hospitals/HospitalCard';
import { fetchHospitals, fetchIntelligentSearch, geocodeArea } from '../services/hospitalApi';
import { useLocation } from '../hooks/useLocation';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { MapPin, Search, Globe, Navigation, AlertCircle, Loader2, ChevronUp, ChevronDown, Map, List, X, CheckCircle, Star } from 'lucide-react';

export const Hospitals = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const { location, requestLocation, loading: locLoading, error: locError, permissionState, applyExternalLocation } = useLocation();
  const [mode, setMode] = useState<'nearby' | 'india'>('nearby');

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [usingFallbackArea, setUsingFallbackArea] = useState<string | null>(null);

  // Compare states
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showCompareView, setShowCompareView] = useState(false);

  const toggleCompare = (hospital: any) => {
    setCompareList(prev => {
      const exists = prev.find(h => h.id === hospital.id || h.external_id === hospital.external_id);
      if (exists) {
        const next = prev.filter(h => h.id !== hospital.id && h.external_id !== hospital.external_id);
        if (next.length === 0) setShowCompareView(false);
        return next;
      }
      if (prev.length >= 3) return prev;
      setShowCompareView(true);
      return [...prev, hospital];
    });
  };

  // Sync search state from URL search parameters on mount or change
  useEffect(() => {
    const urlQuery = searchParams.get('search') || searchParams.get('q') || searchParams.get('disease');
    if (urlQuery && urlQuery.trim()) {
      setSearch(urlQuery.trim());
      setMode('india');
    }
  }, [searchParams]);

  // Filters
  const [radius, setRadius] = useState(25000);
  const [type, setType] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('smart');

  // Fallback location states
  const [fallbackCity, setFallbackCity] = useState('');
  const [fallbackError, setFallbackError] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let data: any[] = [];

      const lat = location?.lat;
      const lon = location?.lon;

      if (mode === 'nearby') {
        if (lat == null || lon == null) {
          // No position yet (no permission / before search): show nothing honestly.
          setHospitals([]);
          return;
        }
        data = await fetchHospitals(lat, lon, radius, type, rating);
      } else {
        if (search.trim().length >= 2) {
          data = await fetchIntelligentSearch(search, lat, lon);
        } else {
          data = await fetchHospitals(lat ?? 28.6139, lon ?? 77.2090, 5000000, type, rating);
        }
      }
      setHospitals(data);
    } catch (err) {
      console.error(err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [mode, location, radius, type, rating, search]);

  useEffect(() => {
    if (mode === 'india' || location) {
      loadData();
    } else {
      setHospitals([]);
    }
  }, [mode, location?.lat, location?.lon, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchArea = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!fallbackCity.trim()) {
      setFallbackError('Please enter a city name or PIN code first.');
      return;
    }
    setIsGeocoding(true);
    setFallbackError('');
    const coords = await geocodeArea(fallbackCity);
    setIsGeocoding(false);

    if (!coords) {
      setFallbackError(`Could not find "${fallbackCity}". Try a city name like "Mumbai" or a 6-digit PIN code.`);
      return;
    }
    const rawName = coords.display_name ? coords.display_name.split(',')[0].trim() : fallbackCity.trim();
    const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : fallbackCity.trim();
    setUsingFallbackArea(formattedName);
    // Reuse the location pipeline so map + distance + list all update
    applyExternalLocation(coords.lat, coords.lon);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const sortedHospitals = [...hospitals].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity);
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'patients':
        return (b.patientVolume ?? 0) - (a.patientVolume ?? 0);
      case 'smart':
      default:
        return (b.match_score ?? 0) - (a.match_score ?? 0) ||
               (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity);
    }
  });

  const showLocationWarning = mode === 'nearby' && !location && !usingFallbackArea && (locError || permissionState === 'denied');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 -mt-2 lg:-mt-4">

      {/* Header and Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-1 tracking-tight drop-shadow-sm">
            Hospital Discovery
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">Find premium healthcare facilities intelligently.</p>
        </div>

        <div className="flex bg-slate-900/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-inner">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'nearby' ? 'bg-primary-500/20 text-primary-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            onClick={() => { setMode('nearby'); setSearch(''); }}
          >
            <Navigation className="w-4 h-4 inline-block mr-2 mb-0.5" />
            Nearby Hospitals
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'india' ? 'bg-emerald-500/20 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            onClick={() => setMode('india')}
          >
            <Globe className="w-4 h-4 inline-block mr-2 mb-0.5" />
            Find Best in India
          </button>
        </div>
      </div>

      {/* Controls Area */}
      <div className="bg-slate-800/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-lg mb-5 flex flex-col md:flex-row gap-4 shrink-0">

        {mode === 'india' ? (
          <form onSubmit={handleSearch} className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400/70 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Enter your disease, condition, or medical requirement (e.g. Cancer, Heart disease)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-base focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none text-slate-50 placeholder:text-slate-500 transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="primary" className="absolute right-2 top-1/2 -translate-y-1/2 !py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-none shadow-md shadow-emerald-900/20">
              Search
            </Button>
          </form>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearchArea} className="flex-1 relative flex gap-2 group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400/70 group-focus-within:text-primary-400 transition-colors" />
              <input
                type="text"
                placeholder="Enter your location (City or PIN code)..."
                className="w-full pl-10 pr-4 py-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 outline-none text-slate-50 placeholder:text-slate-500 transition-all shadow-inner"
                value={fallbackCity}
                onChange={e => setFallbackCity(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={isGeocoding} className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 border-none shrink-0 shadow-md shadow-primary-900/20">
                {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </form>
          </div>
        )}
      </div>

      {showLocationWarning && !usingFallbackArea && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-400 font-semibold mb-1">Location access is disabled.</p>
            <p className="text-slate-400 text-sm mb-3">Please use the search bar above to enter your location manually.</p>
            {fallbackError && <p className="text-red-400 text-xs mt-2">{fallbackError}</p>}
          </div>
        </div>
      )}

      {usingFallbackArea && (
        <div className="mb-4 bg-primary-500/10 border border-primary-500/20 rounded-xl px-4 py-2.5 text-sm text-slate-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-400" />
          Showing results near <strong className="text-slate-100">{usingFallbackArea}</strong>
          <button onClick={() => { setUsingFallbackArea(null); requestLocation(); }} className="ml-auto text-primary-400 hover:text-primary-300 text-xs font-semibold">
            Use my location instead
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left: List */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-shrink-0 gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-50">
                {loading ? 'Searching...' : `${sortedHospitals.length} ${sortedHospitals.length === 1 ? 'facility' : 'facilities'} found`}
              </h2>
              {search && mode === 'india' && !loading && (
                <p className="text-sm font-medium mt-1 text-slate-300">
                  Specialized in treating: <strong className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{search}</strong>
                </p>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-500 whitespace-nowrap shrink-0">Sorted by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-white/10 bg-dark-surface text-primary-400 font-semibold rounded-lg px-2 py-1.5 outline-none focus:border-primary-500"
              >
                <option value="smart">Most Relevant</option>
                <option value="distance">Nearest</option>
                <option value="rating">Highest Rated</option>
                <option value="cost">Lowest Estimated Cost</option>
                <option value="emergency">Emergency Available</option>
              </select>

              <div className="flex gap-1 bg-slate-800/50 border border-white/10 rounded-lg p-0.5 shadow-inner ml-1">
                <button onClick={() => scrollContainerRef.current?.scrollBy({ top: -400, behavior: 'smooth' })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Scroll Up">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => scrollContainerRef.current?.scrollBy({ top: 400, behavior: 'smooth' })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors" title="Scroll Down">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompareView(!showCompareView)}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${showCompareView ? 'bg-primary-500 text-white' : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 border border-primary-500/30'}`}
                >
                  {showCompareView ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  {showCompareView ? 'Show Map' : `Compare (${compareList.length})`}
                </button>
              )}
            </div>
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-dark-surface rounded-2xl border border-white/5 p-5 space-y-4">
                  <div className="flex justify-between"><Skeleton className="h-6 w-1/2 bg-white/5" /><Skeleton className="h-6 w-16 bg-white/5" /></div>
                  <Skeleton className="h-4 w-1/3 bg-white/5" />
                  <Skeleton className="h-16 w-full bg-white/5" />
                  <div className="flex gap-2"><Skeleton className="h-10 w-full bg-white/5" /><Skeleton className="h-10 w-full bg-white/5" /></div>
                </div>
              ))
            ) : sortedHospitals.length > 0 ? (
              sortedHospitals.map(h => (
                <HospitalCard 
                  key={String(h.id || h.external_id)} 
                  hospital={h} 
                  searchQuery={search} 
                  isComparing={compareList.some(ch => ch.id === h.id || ch.external_id === h.external_id)}
                  onToggleCompare={toggleCompare}
                  disabledCompare={compareList.length >= 3}
                />
              ))
            ) : (
              <div className="bg-dark-surface rounded-2xl border border-white/5 p-8 text-center flex flex-col items-center justify-center h-48">
                <Search className="h-8 w-8 text-slate-600 mb-3" />
                <p className="text-slate-200 font-bold">
                  {mode === 'nearby' && !location && !usingFallbackArea
                    ? 'Enable location or search an area to begin'
                    : mode === 'nearby' 
                      ? `No hospitals found within ${radius/1000} km` 
                      : 'No hospitals matching your criteria'}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  {mode === 'nearby' && !location && !usingFallbackArea
                    ? 'Click "Use Location" above, or search by city / PIN code.'
                    : mode === 'nearby'
                      ? 'Try expanding your search radius to find more facilities.'
                      : 'Try expanding your search criteria.'}
                </p>
                {(mode === 'nearby' && (location || usingFallbackArea)) && radius < 100000 && (
                  <Button variant="outline" className="mt-4" onClick={() => { 
                    const nextRadius = radius === 5000 ? 10000 : radius === 10000 ? 25000 : radius === 25000 ? 50000 : 100000;
                    setRadius(nextRadius); 
                  }}>
                    Expand Search to {radius === 5000 ? 10 : radius === 10000 ? 25 : radius === 25000 ? 50 : 100} km
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Map or Compare Column */}
        <div className="w-full lg:w-1/2 xl:w-7/12 h-[400px] lg:h-auto rounded-2xl overflow-hidden border border-white/5 shadow-soft relative z-0 flex flex-col">
          {showCompareView && compareList.length > 0 ? (
            <div className="flex-1 bg-dark-surface overflow-auto custom-scrollbar flex flex-col p-6 h-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <List className="w-5 h-5 text-primary-400" />
                  Hospital Comparison
                </h3>
                <button onClick={() => setCompareList([])} className="text-sm text-red-400 hover:text-red-300 font-medium px-3 py-1 rounded bg-red-400/10 transition-colors">
                  Clear All
                </button>
              </div>
              
              <div className="flex-1 overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-4 bg-slate-900/80 text-slate-400 font-bold border-b border-white/10 w-32 sticky left-0 z-10 backdrop-blur-md">Feature</th>
                      {compareList.map(h => (
                        <th key={h.id || h.external_id} className="p-4 bg-slate-900/50 text-slate-100 font-bold border-b border-white/10 min-w-[200px] align-top relative">
                          <div className="flex justify-between items-start gap-2">
                            <span className="line-clamp-2">{h.name}</span>
                            <button onClick={() => toggleCompare(h)} className="text-slate-500 hover:text-red-400 p-1 -mt-1 -mr-1 transition-colors bg-dark-surface rounded-md">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 font-semibold sticky left-0 bg-dark-surface z-10">Rating</td>
                      {compareList.map(h => (
                        <td key={h.id || h.external_id} className="p-4">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <Star className="w-4 h-4 fill-amber-400" /> {h.rating || 'N/A'}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 font-semibold sticky left-0 bg-dark-surface z-10">Distance</td>
                      {compareList.map(h => (
                        <td key={h.id || h.external_id} className="p-4 text-slate-200">
                          {h.distance_km ? `${h.distance_km} km` : 'Unknown'}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 font-semibold sticky left-0 bg-dark-surface z-10">Best For</td>
                      {compareList.map(h => (
                        <td key={h.id || h.external_id} className="p-4 text-primary-300 font-medium text-sm">
                          {h.best_for || 'General Care'}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 font-semibold sticky left-0 bg-dark-surface z-10">Est. Cost</td>
                      {compareList.map(h => (
                        <td key={h.id || h.external_id} className="p-4 text-emerald-400 font-medium">
                          {h.costs && h.costs.length > 0 
                            ? `${h.costs[0].currency} ${h.costs[0].cost_min?.toLocaleString()} - ${h.costs[0].cost_max?.toLocaleString()}`
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-slate-400 font-semibold sticky left-0 bg-dark-surface z-10">Facilities</td>
                      {compareList.map(h => (
                        <td key={h.id || h.external_id} className="p-4 align-top">
                          {h.facilities && h.facilities.length > 0 ? (
                            <ul className="space-y-1.5">
                              {h.facilities.slice(0, 5).map((f: any, idx: number) => {
                                const fname = typeof f === 'string' ? f : f?.facility_name;
                                return (
                                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    {fname}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : <span className="text-slate-500 text-sm">Not specified</span>}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {!loading && <HospitalMap hospitals={sortedHospitals} userLocation={location} />}
              {loading && <Skeleton className="w-full h-full rounded-none bg-white/5" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
