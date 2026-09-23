import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, MapPin, FileText, Activity, Heart, MessageSquare,
  Stethoscope, FileSearch, Pill, User, Settings
} from 'lucide-react';

interface NavSectionProps {
  title: string;
  items: Array<{ to: string; icon: React.ElementType; label: string }>;
}

const NavSection = ({ title, items }: NavSectionProps) => (
  <div className="mb-6">
    <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <nav className="space-y-1.5">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
              isActive 
                ? 'bg-primary-900/20 text-primary-400 shadow-[inset_3px_0_0_0] shadow-primary-500' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  </div>
);

export const Sidebar = () => {
  const mainNav = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/hospitals', icon: MapPin, label: 'Find Hospitals' },
    { to: '/reports', icon: FileText, label: 'Medical Reports' },
    { to: '/health', icon: Activity, label: 'Health Progress' },
    { to: '/recommendations', icon: Heart, label: 'Recommendations' },
    { to: '/assistant', icon: MessageSquare, label: 'AI Health Assistant' },
  ];

  const healthTools = [

    { to: '/sehatmatch', icon: MapPin, label: 'SehatMatch Finder' },
    { to: '/medicine', icon: Pill, label: 'Medicine Information' },
  ];

  const accountNav = [
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border h-screen hidden md:flex flex-col fixed shadow-xl z-30">
      <div className="p-6 mb-4">
        <h1 className="text-xl font-bold text-primary-400 flex items-center gap-2">
          <Heart className="h-6 w-6 fill-current" />
          MediSphere
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <NavSection title="Main" items={mainNav} />
        <NavSection title="Health Tools" items={healthTools} />
        <NavSection title="Account" items={accountNav} />
      </div>

      <div className="p-4 border-t border-dark-border bg-dark-surface/50 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 group hover:border-primary-500/30 transition-all cursor-pointer">
          <div className="relative w-8 h-8 bg-dark-surface border border-white/10 rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-dark-surface"></span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">System Status</p>
            <p className="text-xs text-emerald-400 font-medium">All systems normal</p>
          </div>
        </div>
      </div>
    </div>
  );
};