import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Apple, Activity, Droplets, Moon, Heart, Stethoscope, AlertTriangle, Loader2, MapPin, Phone } from 'lucide-react';
import { api } from '../services/api';

const iconMap: Record<string, React.ElementType> = {
  'Nutrition': Apple,
  'Hydration': Droplets,
  'Sleep': Moon,
  'Activity': Activity,
  'Medical': Stethoscope,
};

export const Recommendations = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/health/recommendations');
        setData(response.data);
      } catch (err: any) {
        console.error("Failed to load recommendations", err);
        setError(err.response?.data?.detail || "Failed to load personalized recommendations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center animate-in fade-in">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
        <p className="text-slate-400">AI is analyzing your health profile and finding hospitals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50 mb-2">Health Recommendations</h1>
        <p className="text-slate-400">Personalized educational insights based on your recent medical reports.</p>
      </div>



      {data?.disease_analysis && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            Report Analysis & Condition Insights
          </h2>
          <Card className="p-6 bg-gradient-to-r from-primary-900/20 to-transparent border-primary-500/30">
            <p className="text-slate-300 text-sm leading-relaxed">
              {data.disease_analysis}
            </p>
          </Card>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-50 mb-4">Lifestyle Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
        {data?.insights?.map((insight: any, i: number) => {
          const Icon = iconMap[insight.icon] || Heart;
          return (
            <Card key={i} className="p-6 transition-all hover:border-primary-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-500/10 p-2.5 rounded-xl border border-primary-500/20 text-primary-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg text-slate-50">{insight.title}</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {insight.description}
              </p>
            </Card>
          );
        })}
      </div>

      {data?.hospitals && data.hospitals.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            Recommended Hospitals
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Based on your test results, we've identified you may need to consult specialists in: 
            <strong className="text-slate-200 ml-1">{data.specialties_identified?.join(', ')}</strong>. 
            Here are verified hospitals from our database:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.hospitals.map((hospital: any, i: number) => (
              <Card key={i} className="p-6 bg-gradient-to-br from-dark-surface to-dark-bg/50 border-teal-500/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-50 leading-tight">{hospital.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 px-2 py-1 rounded-full">
                    {hospital.matched_specialty}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-400">
                    <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                    {hospital.city} • {hospital.type}
                  </div>
                  {hospital.phone && (
                    <div className="flex items-center text-sm text-slate-400">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      {hospital.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-400">
                    <Activity className="w-4 h-4 mr-2 text-slate-500" />
                    {hospital.government_or_private}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};