import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, Navigation, Heart, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const HospitalCard = ({ 
  hospital, 
  searchQuery = '',
  isComparing = false,
  onToggleCompare,
  disabledCompare = false
}: { 
  hospital: any;
  searchQuery?: string;
  isComparing?: boolean;
  onToggleCompare?: (hospital: any) => void;
  disabledCompare?: boolean;
}) => {
  const navigate = useNavigate();
  const hospitalId = hospital.id || hospital.external_id || 'unknown';
  
  return (
    <Card className="overflow-hidden flex flex-col p-0 border-white/5">

      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-50 group-hover:text-primary-400 transition-colors line-clamp-2">{hospital.name}</h3>
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md text-sm font-semibold border border-amber-500/20 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {hospital.rating || '4.5'}
          </div>
        </div>
      
      <div className="flex items-center text-slate-400 mb-4 text-sm font-medium">
        <MapPin className="h-4 w-4 mr-1 text-slate-500" />
        {hospital.distance_km} km away
        {hospital.isVerified && (
          <span className="ml-3 flex items-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs">
            <ShieldCheck className="w-3 h-3 mr-1"/> Verified
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hospital.specialties && hospital.specialties.length > 0 ? (
            hospital.specialties.slice(0, 4).map((s: any, idx: number) => {
              const label = typeof s === 'string' ? s : s?.specialty_name || 'General Care';
              return <Badge key={idx} variant="neutral">{label}</Badge>;
            })
          ) : (
            <Badge variant="neutral">General Care</Badge>
          )}
          {hospital.facilities?.some((f: any) => (typeof f === 'string' ? f : f?.facility_name || '').toLowerCase().includes('emergency')) && (
            <Badge variant="error" dot>24/7 ER</Badge>
          )}
        </div>

        {hospital.match_score !== undefined && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-400 font-bold text-sm">Smart Match</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-lg text-sm">{hospital.match_score}%</span>
            </div>
            {hospital.why_recommended && hospital.why_recommended.length > 0 && (
              <ul className="space-y-1">
                {hospital.why_recommended.slice(0, 3).map((reason: string, idx: number) => (
                  <li key={idx} className={`text-xs ${reason.startsWith('✓') ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="bg-white/5 rounded-xl p-3 space-y-2.5 border border-white/5">
          {hospital.best_for && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-primary-400 font-semibold min-w-[70px]">Best For:</span>
              <span className="text-slate-200">{hospital.best_for}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm">
            <span className="text-emerald-400 font-semibold min-w-[70px]">Est. Cost:</span>
            <span className="text-slate-200">
              {hospital.costs && hospital.costs.length > 0 
                ? `${hospital.costs[0].currency} ${hospital.costs[0].cost_min?.toLocaleString()} - ${hospital.costs[0].cost_max?.toLocaleString()} (${hospital.costs[0].treatment})`
                : 'Cost data unavailable'}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-blue-400 font-semibold min-w-[70px]">Patients:</span>
            <span className="text-slate-200">
              {hospital.patient_stats && hospital.patient_stats.length > 0
                ? `${hospital.patient_stats[0].volume.toLocaleString()}+ (${hospital.patient_stats[0].period})`
                : 'Patient volume data unavailable'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
        <Button variant="primary" className="flex-1 text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-none shadow-md" onClick={() => navigate(`/hospitals/${hospitalId}`, { state: { disease: searchQuery, hospital } })}>
          View Details
        </Button>
        {onToggleCompare && (
          <label className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer font-semibold transition-colors border text-sm ${isComparing ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'}`}>
            <input type="checkbox" className="w-3.5 h-3.5 text-emerald-500 rounded border-slate-600 focus:ring-emerald-500 bg-slate-800"
              checked={isComparing}
              onChange={() => onToggleCompare(hospital)}
              disabled={disabledCompare && !isComparing}
            />
            Compare
          </label>
        )}
        <Button variant="outline" className="px-3" title="Directions">
          <Navigation className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="px-3" title="Call">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="px-3" title="Save">
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      </div>
    </Card>
  );
};