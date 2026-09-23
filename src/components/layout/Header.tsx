import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, Loader2, FileText, Activity, LayoutDashboard, MapPin, Heart, MessageSquare, Stethoscope, FileSearch, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ROUTES = [
  { id: 'home', label: 'Dashboard', to: '/', type: 'Page', icon: LayoutDashboard },
  { id: 'hospitals', label: 'Find Hospitals', to: '/hospitals', type: 'Page', icon: MapPin },
  { id: 'reports', label: 'Medical Reports', to: '/reports', type: 'Page', icon: FileText },
  { id: 'health', label: 'Health Progress', to: '/health', type: 'Page', icon: Activity },
  { id: 'recommendations', label: 'Recommendations', to: '/recommendations', type: 'Page', icon: Heart },
  { id: 'assistant', label: 'AI Health Assistant', to: '/assistant', type: 'Page', icon: MessageSquare },

  { id: 'sehatmatch', label: 'SehatMatch Hospital Finder', to: '/sehatmatch', type: 'Page', icon: MapPin },
];

const MOCK_REPORTS = [
  { id: 'r1', label: 'Complete Blood Count (CBC) - March 2026', type: 'Medical Report', date: '2026-03-15' },
  { id: 'r2', label: 'Lipid Panel Results', type: 'Medical Report', date: '2026-02-10' },
  { id: 'r3', label: 'Annual Physical Report', type: 'Medical Report', date: '2025-11-20' }
];

export const Header = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{pages: any[], reports: any[]}>({ pages: [], reports: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ pages: [], reports: [] });
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    const searchTimer = setTimeout(() => {
      const q = debouncedQuery.toLowerCase();
      const filteredPages = ROUTES.filter(r => r.label.toLowerCase().includes(q));
      
      if (q === 'reports' || q === 'report') {
          const reportRouteIndex = filteredPages.findIndex(r => r.id === 'reports');
          if (reportRouteIndex > -1) {
              const [reportRoute] = filteredPages.splice(reportRouteIndex, 1);
              filteredPages.unshift(reportRoute);
          }
      }

      const filteredReports = MOCK_REPORTS.filter(r => r.label.toLowerCase().includes(q));

      setResults({ pages: filteredPages, reports: filteredReports });
      setSelectedIndex(0);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [debouncedQuery]);

  const allResults = [...results.pages, ...results.reports];

  const handleNavigate = (item: any) => {
    setIsOpen(false);
    setSearchQuery('');
    setDebouncedQuery('');
    if (item.type === 'Page') {
      navigate(item.to);
    } else if (item.type === 'Medical Report') {
      navigate(`/reports?search=${encodeURIComponent(item.label)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== 'Enter') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery && !isOpen) {
        setDebouncedQuery(searchQuery);
      } else if (allResults.length > 0 && isOpen) {
        handleNavigate(allResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    searchInputRef.current?.focus();
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-transparent backdrop-blur-sm border-b border-white/5 h-20 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-2xl">
        {/* Search bar removed by user request */}
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button className="text-slate-400 hover:text-white transition-colors focus:outline-none rounded-full p-2 hover:bg-white/5">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-white/10 mx-1"></div>
        <div className="bg-dark-surface px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2 shadow-sm relative group">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner shadow-black/20">
            {getInitials(user?.name || '')}
          </div>
          <span className="text-sm font-semibold text-slate-200 hidden sm:block pr-2">{user?.name || 'Loading...'}</span>
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-dark-surface border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2 transition-colors border-b border-white/5"
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};