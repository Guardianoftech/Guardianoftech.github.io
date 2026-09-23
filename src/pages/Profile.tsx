import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Profile = () => {
  const { user } = useAuth();

  // Create a stylized ID from the actual user ID
  const displayId = user?.id ? `MED-${10000 + user.id}` : 'MED-10000';

  return (
    <div className="pb-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-8 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>

        {/* Profile Avatar */}
        <div className="relative z-10 shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-slate-800">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
          </div>
        </div>

        {/* Profile Details */}
        <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
            <p className="text-slate-400 font-medium">Patient Account</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="bg-primary-500/20 p-3 rounded-xl text-primary-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Login / Registration ID</p>
                <p className="font-mono text-lg font-bold text-slate-200">{displayId}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="bg-secondary-500/20 p-3 rounded-xl text-secondary-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="font-medium text-slate-200">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
