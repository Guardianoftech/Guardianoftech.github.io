import React, { useState, useEffect } from 'react';
import { useLocation as useGeoLocation } from '../hooks/useLocation';
import { HospitalMap } from '../components/hospitals/HospitalMap';
import { Button } from '../components/ui/Button';
import { MapPin, Search, Activity, ShieldCheck, HeartPulse, Stethoscope, AlertTriangle, CheckCircle, XCircle, Info, FileText } from 'lucide-react';
import { demoHospitals } from '../mocks/demoHospitals';
import { geocodeArea, normalizeHospital } from '../services/hospitalApi';

const DISEASES = ['Heart Disease', 'Cancer', 'Kidney Disease', 'Diabetes', 'Stroke', 'Other'];
const TREATMENTS = ['Surgery', 'Dialysis', 'Chemotherapy', 'Radiotherapy', 'Cardiac treatment', 'Diagnostic tests', 'Other'];
const SCHEMES = ['Ayushman Bharat (PM-JAY)', 'Sarbat Sehat Bima Yojana (Punjab)', 'CGHS', 'ECHS', 'State Govt Employee Scheme'];

export const SehatMatch = () => {
  const { location, requestLocation, loading: locLoading } = useGeoLocation();
  const [disease, setDisease] = useState('');
  const [treatment, setTreatment] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [scheme, setScheme] = useState('');
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if (location) {
      setUserCoords(location);
    }
  }, [location]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    let lat = userCoords?.lat || 28.6139;
    let lon = userCoords?.lon || 77.2090;

    if (searchLocation && (!userCoords || searchLocation !== 'Current Location')) {
      const coords = await geocodeArea(searchLocation);
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        setUserCoords({lat, lon});
      }
    }

    // Mock processing - filter demo hospitals
    setTimeout(() => {
      const matched = demoHospitals.map(h => {
        const norm = normalizeHospital(h, lat, lon);
        
        // Mock matching logic
        let matchScore = 0;
        let reasons = [];
        
        // 1. Scheme (randomly assigning eligibility for mock, leaning towards Punjab scheme for demonstration)
        const isEligible = Math.random() > 0.3 || scheme.includes('Sarbat Sehat');
        if (isEligible) { matchScore += 40; reasons.push({ type: 'success', text: 'Scheme eligible' }); }
        else { reasons.push({ type: 'warning', text: 'Not eligible under selected scheme' }); }

        // 2. Treatment
        const hasTreatment = norm.specialties.some((s: string) => s.toLowerCase().includes(treatment.toLowerCase())) || Math.random() > 0.5;
        if (hasTreatment) { matchScore += 30; reasons.push({ type: 'success', text: 'Required treatment available' }); }
        else { reasons.push({ type: 'error', text: 'Treatment verification needed' }); }

        // 3. Specialist & Equipment
        const hasSpecialist = Math.random() > 0.2;
        if (hasSpecialist) { matchScore += 20; reasons.push({ type: 'success', text: 'Specialist available' }); }

        // 4. Distance
        if (norm.distance_km && norm.distance_km < 20) { matchScore += 10; reasons.push({ type: 'success', text: 'Within reasonable distance' }); }

        return {
          ...norm,
          matchScore,
          reasons,
          isEligible,
          hasTreatment,
          hasSpecialist,
          hasEmergency: true,
          equipment: Math.random() > 0.3,
          waitingTime: Math.floor(Math.random() * 14) + 1
        };
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

      setResults(matched);
      setIsSearching(false);
    }, 1000);
  };

  const toggleCompare = (hospital: any) => {
    if (compareList.find(h => h.id === hospital.id)) {
      setCompareList(compareList.filter(h => h.id !== hospital.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, hospital]);
    }
  };

  return (
    <div className="pb-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="mb-8 text-center bg-gradient-to-b from-teal-900/40 to-transparent p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/20 rounded-2xl mb-4 text-teal-400 border border-teal-500/30">
          <ShieldCheck className="w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold tracking-tight">SehatMatch</h1>
        </div>
        <p className="text-xl text-teal-100 font-medium mb-2">Smart Government Card Hospital Finder</p>
        <p className="text-teal-400/80 text-sm tracking-widest uppercase font-semibold">"Your Card. Your Disease. The Right Hospital."</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
        <div className="bg-navy-900 bg-slate-900 p-6 text-white border-b border-white/10">
          <h2 className="text-lg font-bold flex items-center"><Search className="mr-2 h-5 w-5 text-teal-400" /> Find Your Match</h2>
        </div>
        <form onSubmit={handleSearch} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center"><Activity className="w-4 h-4 mr-1 text-rose-500"/> Disease / Condition</label>
            <select required value={disease} onChange={e => setDisease(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm">
              <option value="">Select Condition...</option>
              {DISEASES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center"><Stethoscope className="w-4 h-4 mr-1 text-blue-500"/> Required Treatment</label>
            <select required value={treatment} onChange={e => setTreatment(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm">
              <option value="">Select Treatment...</option>
              {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>



          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center"><FileText className="w-4 h-4 mr-1 text-teal-600"/> Government Scheme</label>
            <select required value={scheme} onChange={e => setScheme(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm">
              <option value="">Select Scheme...</option>
              {SCHEMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 mt-2 flex justify-end">
            <Button type="submit" variant="primary" disabled={isSearching} className="w-full md:w-auto px-10 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all active:scale-95">
              {isSearching ? 'Matching...' : 'Find Eligible Hospitals'}
            </Button>
          </div>
        </form>
      </div>



      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl shadow-md border border-slate-700">
              <h3 className="font-bold text-white text-lg">Top Matches</h3>
              {compareList.length > 0 && (
                <button onClick={() => setShowCompare(true)} className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">
                  Compare ({compareList.length})
                </button>
              )}
            </div>
            
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {results.map((hospital) => (
                <div key={hospital.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                  
                  {/* Match Indicator */}
                  <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-bold text-white shadow-sm flex items-center gap-1.5
                    ${hospital.matchScore >= 80 ? 'bg-green-500' : hospital.matchScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                    <HeartPulse className="w-4 h-4" />
                    {hospital.matchScore}% Match
                  </div>

                  <div className="mb-4 pr-24">
                    <h3 className="text-xl font-bold text-slate-800">{hospital.name}</h3>
                    <p className="text-sm text-slate-500">{hospital.type || 'Multispecialty Hospital'} • {hospital.distance_km} km away</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Services</p>
                      <p className="text-sm font-semibold text-slate-700">{hospital.specialties.slice(0, 3).join(', ') || 'General'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Availability</p>
                      <p className="text-sm font-semibold text-slate-700">Est. Wait: {hospital.waitingTime} days</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {hospital.reasons.map((r: any, i: number) => (
                      <div key={i} className="flex items-center text-sm font-medium">
                        {r.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" /> 
                         : r.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                         : <XCircle className="w-4 h-4 text-rose-500 mr-2 shrink-0" />}
                        <span className={r.type === 'success' ? 'text-slate-700' : r.type === 'warning' ? 'text-amber-700' : 'text-rose-700'}>{r.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold py-2.5 rounded-xl border border-teal-200 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold py-2.5 rounded-xl shadow-md transition-colors">
                      Get Directions
                    </button>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer font-semibold transition-colors border border-slate-200">
                      <input type="checkbox" className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                        checked={!!compareList.find(h => h.id === hospital.id)}
                        onChange={() => toggleCompare(hospital)}
                        disabled={compareList.length >= 3 && !compareList.find(h => h.id === hospital.id)}
                      />
                      Compare
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[600px] lg:h-auto rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-0 bg-slate-100">
             <HospitalMap hospitals={results} userLocation={userCoords} />
             {/* Map overlay legend */}
             <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 text-sm font-semibold text-slate-700">
                <div className="flex items-center mb-2"><span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-sm"></span> High Match</div>
                <div className="flex items-center mb-2"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2 shadow-sm"></span> Partial Match</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-500 mr-2 shadow-sm"></span> Low Match</div>
             </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center"><Activity className="mr-2" /> Compare Hospitals</h2>
              <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-slate-200 text-slate-500 font-bold w-1/4">Factor</th>
                    {compareList.map(h => (
                      <th key={h.id} className="p-4 border-b-2 border-slate-200 text-slate-900 font-bold w-1/4 text-center text-lg">{h.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-700">Government Scheme</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center">{h.isEligible ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Required Treatment</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center">{h.hasTreatment ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-700">Specialist</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center">{h.hasSpecialist ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Required Equipment</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center">{h.equipment ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-700">Distance</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center font-medium text-slate-700">{h.distance_km} km</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700">Emergency</td>
                    {compareList.map(h => (
                      <td key={h.id} className="p-4 text-center">{h.hasEmergency ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button variant="outline" onClick={() => setShowCompare(false)} className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
