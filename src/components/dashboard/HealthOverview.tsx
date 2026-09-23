import React from 'react';
import { FileText, Activity, MapPin, TrendingUp, Info } from 'lucide-react';
import { Card } from '../ui/Card';

interface HealthOverviewProps {
  data: any;
}

export const HealthOverview = ({ data }: HealthOverviewProps) => {
  const score = data?.healthScore || 0;
  const strokeDashoffset = 351.8 - (351.8 * score) / 100;
  
  return (
    <Card className="mb-8 overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5">
        


        {/* Supporting Metrics */}
        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-3 p-6 gap-6">
          <div className="group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-50">{data?.totalReports || 0}</p>
            <p className="text-sm font-medium text-slate-400">Medical Reports</p>
          </div>
          
          <div className="group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-slate-50">{data?.analyses || 0}</p>
            <p className="text-sm font-medium text-slate-400">Analyses</p>
          </div>
          
          <div className="group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MapPin className="h-5 w-5 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-slate-50">8</p>
            <p className="text-sm font-medium text-slate-400">Nearby Hospitals</p>
          </div>
        </div>
        
      </div>
    </Card>
  );
};