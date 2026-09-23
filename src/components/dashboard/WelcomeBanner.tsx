import React, { useState } from 'react';
import { Search, Mic, Upload, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const WelcomeBanner = () => {
  const [query, setQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsNavigating(true);
    // Simulate slight loading for UI feedback
    setTimeout(() => {
      navigate(`/assistant?q=${encodeURIComponent(query.trim())}`);
      setIsNavigating(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-50 mb-2">Good morning, Demo User 👋</h1>
        <p className="text-slate-400 text-lg">
          Your health information, care discovery and personalized insights in one place.
        </p>
      </div>

      <div className="bg-dark-surface p-2 rounded-2xl shadow-soft border border-white/5 flex items-center max-w-4xl hover:border-primary-500/30 transition-colors focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/50">
        <div className="p-3 text-primary-400">
          {isNavigating ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Search className="h-6 w-6" />
          )}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your health (e.g., 'Explain my latest blood report')..." 
          className="flex-1 bg-transparent border-none focus:outline-none text-slate-100 text-lg placeholder:text-slate-500 px-2"
          disabled={isNavigating}
        />
        <div className="flex items-center gap-2 pr-2 border-l border-white/10 pl-4">
          <Button variant="ghost" className="rounded-xl text-slate-400 hover:text-primary-400 hover:bg-white/5">
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="rounded-xl text-slate-400 hover:text-primary-400 hover:bg-white/5">
            <Upload className="h-5 w-5" />
          </Button>
          <Button 
            variant="primary" 
            className="rounded-xl px-6" 
            onClick={handleSearch}
            disabled={isNavigating}
          >
            {isNavigating ? 'Asking AI...' : 'Ask AI'}
          </Button>
        </div>
      </div>
    </div>
  );
};