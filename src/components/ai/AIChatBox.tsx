import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const AIChatBox = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-blue-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 rounded-xl border-2 border-transparent shadow-md focus:border-blue-500 focus:ring-0 text-lg bg-white"
          placeholder="Ask anything about healthcare..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Ask AI
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">
        Example: "Find kidney treatment hospitals near Chandigarh under ₹2 lakh"
      </p>
    </form>
  );
};