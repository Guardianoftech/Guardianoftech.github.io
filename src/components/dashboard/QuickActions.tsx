import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Search, MessageSquare, Activity, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { icon: FileText, label: 'Upload Report', desc: 'Add new medical records', to: '/reports', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50' },
    { icon: MapPin, label: 'Find Hospital', desc: 'Locate nearby care', to: '/hospitals', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50' },

    { icon: MessageSquare, label: 'Ask AI', desc: 'Health information assistant', to: '/assistant', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20 group-hover:border-primary-500/50' },
    { icon: MapPin, label: 'SehatMatch', desc: 'Find Govt scheme hospitals', to: '/sehatmatch', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20 group-hover:border-teal-500/50' },
  ];

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncNABH = async () => {
    setIsSyncing(true);
    try {
      const res = await api.post('/crawler/run-nabh');
      alert(`Successfully synced NABH data!\nAdded: ${res.data.added} hospitals.\nUpdated: ${res.data.updated} hospitals.`);
    } catch (error) {
      console.error(error);
      alert('Failed to sync NABH data.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, i) => (
        <button 
          key={i} 
          onClick={() => navigate(action.to)}
          className="flex flex-col items-start p-4 rounded-2xl bg-dark-surface border border-white/5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 group"
        >
          <div className={`mb-3 p-2.5 rounded-xl border transition-colors ${action.bg}`}>
            <action.icon className={`h-5 w-5 ${action.color}`} />
          </div>
          <span className="font-bold text-slate-50 mb-1">{action.label}</span>
          <span className="text-xs text-slate-400 leading-tight">{action.desc}</span>
        </button>
      ))}
      <button 
        onClick={handleSyncNABH}
        disabled={isSyncing}
        className="flex flex-col items-start p-4 rounded-2xl bg-dark-surface border border-white/5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 group disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <div className={`mb-3 p-2.5 rounded-xl border transition-colors bg-teal-500/10 border-teal-500/20 group-hover:border-teal-500/50`}>
          <RefreshCw className={`h-5 w-5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
        </div>
        <span className="font-bold text-slate-50 mb-1">Sync NABH</span>
        <span className="text-xs text-slate-400 leading-tight">{isSyncing ? 'Crawling...' : 'Fetch real hospitals'}</span>
      </button>
    </div>
  );
};