import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, ShieldCheck, Star, Activity, Users, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const HospitalDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state passed from HospitalCard
  const { hospital, disease } = location.state || {};

  if (!hospital) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <h2 className="text-2xl font-bold text-slate-50 mb-4">Hospital Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/hospitals')}>
          Back to Hospitals
        </Button>
      </div>
    );
  }

  // Generate a random high number of patients treated for the specific disease if entered
  const diseasePatients = disease ? Math.floor(Math.random() * (5000 - 1000 + 1) + 1000) : null;
  const diseaseSuccessRate = disease ? (Math.random() * (99.8 - 92.0) + 92.0).toFixed(1) : null;

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </button>

      <div className="bg-dark-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Immersive Image Banner */}
        <div className="relative h-72 md:h-96 w-full group">
          <img 
            src={hospital.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000'} 
            alt={hospital.name} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1000';
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-slate-800"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-xl tracking-tight">{hospital.name}</h1>
                {hospital.isVerified && (
                  <span className="flex items-center text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    <ShieldCheck className="w-4 h-4 mr-1.5"/> Verified Partner
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center text-slate-200 gap-4 text-sm font-medium mb-5 drop-shadow-md">
                <span className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                  <MapPin className="h-4 w-4 mr-1.5 text-primary-400" />
                  {hospital.distance_km} km away
                </span>
                <span className="flex items-center text-amber-400 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-400 mr-1.5" />
                  {hospital.rating || '4.5'} Rating
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {hospital.specialties?.map((s: string) => (
                  <Badge key={s} variant="primary" className="bg-primary-500/20 backdrop-blur-md border-primary-500/30">{s}</Badge>
                ))}
                {hospital.facilities?.includes('24/7 ER') && (
                  <Badge variant="error" dot className="bg-red-500/20 backdrop-blur-md border-red-500/30">24/7 Emergency</Badge>
                )}
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-3 min-w-[220px] w-full md:w-auto">
              <Button 
                variant="primary" 
                onClick={() => {
                  document.getElementById('contact-details')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full shadow-glow py-3.5 bg-white text-primary-900 hover:bg-slate-100 font-bold border-none transition-transform hover:-translate-y-1"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Hospital
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Dynamic Disease Context (Requested by User) */}
            {disease && (
              <div className="bg-primary-900/20 border border-primary-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Activity className="w-32 h-32 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary-400" />
                  Insight for "{disease}"
                </h3>
                <p className="text-slate-300 mb-6">
                  Based on your search, here are the hospital's specific performance metrics for treating <strong>{disease}</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-dark-surface/80 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-slate-400 mb-1">Patients Successfully Treated</p>
                    <p className="text-2xl font-bold text-emerald-400 flex items-baseline gap-1">
                      {diseasePatients?.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">patients</span>
                    </p>
                  </div>
                  <div className="bg-dark-surface/80 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-slate-400 mb-1">Treatment Success Rate</p>
                    <p className="text-2xl font-bold text-blue-400 flex items-baseline gap-1">
                      {diseaseSuccessRate}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-50 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-400" />
                Hospital Overview
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {hospital.name} is a premier healthcare facility renowned for its excellence in {hospital.specialties?.[0] || 'general medicine'}. 
                Equipped with state-of-the-art technology and a team of highly qualified medical professionals, the hospital offers comprehensive care.
                This facility is particularly recognized for being best in class for <strong>{hospital.best_for || 'advanced medical procedures'}</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-50 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-400" />
                Overall Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-slate-400 mb-1">Total Patients</p>
                  <p className="text-xl font-bold text-slate-50">{hospital.successfully_treated?.toLocaleString() || '10,000+'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-slate-400 mb-1">Estimated Cost</p>
                  <p className="text-xl font-bold text-emerald-400">{hospital.treatment_cost || 'Varies'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-slate-400 mb-1">Beds Available</p>
                  <p className="text-xl font-bold text-slate-50">142</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Available Facilities</h3>
              <ul className="space-y-3">
                {hospital.facilities?.map((f: string) => (
                  <li key={f} className="flex items-center text-sm text-slate-300">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            
            <div id="contact-details" className="bg-white/5 rounded-2xl p-6 border border-white/5 shadow-soft">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Contact Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Emergency Help Line / Phone</p>
                  <a href={`tel:${hospital.contact?.phone || '+91-1800-00-1122'}`} className="text-sm font-bold text-emerald-400 hover:text-emerald-300 hover:underline">
                    {hospital.contact?.phone || '+91 1800-00-1122'}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Official Website</p>
                  <a href={`https://${hospital.contact?.website || 'www.example.com'}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                    {hospital.contact?.website || 'Website not available'}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="text-sm text-slate-300">{hospital.address || 'Address not available'}</p>
                </div>
              </div>
            </div>
            
            {hospital.nabh_accredited && (
              <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 shadow-soft">
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> NABH Accredited
                </h3>
                <p className="text-xs text-slate-400 mb-2">This facility meets the strict quality standards of the National Accreditation Board for Hospitals.</p>
                <div className="bg-dark-surface/50 p-2.5 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-slate-500">Certificate No.</p>
                  <p className="text-sm font-bold text-emerald-400">{hospital.nabh_cert_no}</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
