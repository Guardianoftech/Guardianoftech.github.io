import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { HealthOverview } from '../components/dashboard/HealthOverview';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';

const data = [
  { name: 'Mon', score: 72 },
  { name: 'Tue', score: 74 },
  { name: 'Wed', score: 73 },
  { name: 'Thu', score: 76 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 78 },
  { name: 'Sun', score: 78 },
];

export const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/health/dashboard/summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      <WelcomeBanner />
      <HealthOverview data={summary} />
      
      <div className="mb-8 flex flex-col space-y-4">
        <h2 className="text-lg font-bold text-slate-50 mb-2">Quick Actions</h2>
        <QuickActions />
      </div>

      <div className="mb-8">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Health Progress</CardTitle>
            <select className="text-sm bg-dark-surface border border-white/10 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 text-slate-300">
              <option>7 Days</option>
              <option>30 Days</option>
              <option>3 Months</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#F8FAFC', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};