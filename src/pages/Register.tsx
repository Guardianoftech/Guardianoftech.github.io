import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Heart, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (name.length < 3) {
      setError('Full name must be at least 3 characters long.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleDemoModeFallback = () => {
    console.log("Using Demo Mode Fallback for Registration");
    
    // Check if user exists in demo storage
    const storedUsers = JSON.parse(localStorage.getItem('mediconnect_users') || '[]');
    if (storedUsers.find((u: any) => u.email === email)) {
      setError('The user with this email already exists in the system. (Demo Mode)');
      setIsLoading(false);
      return;
    }

    // Register user in localStorage
    const newUser = { id: Date.now(), name, email, password }; // In a real app never store passwords in plaintext
    storedUsers.push(newUser);
    localStorage.setItem('mediconnect_users', JSON.stringify(storedUsers));
    
    // Auto-login demo
    localStorage.setItem('mediconnect_currentUser', JSON.stringify(newUser));
    // Provide a fake token to pass AuthContext check
    const fakeToken = "demo_mode_token_" + Date.now();
    login(fakeToken);
    
    setSuccess('Account created in demo mode!');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validate()) return;
    
    setIsLoading(true);

    if (!import.meta.env.VITE_API_URL) {
      handleDemoModeFallback();
      return;
    }

    try {
      // Register
      await api.post('/auth/register', { name, email, password });
      
      // Auto Login after register
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginResponse = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      login(loginResponse.data.access_token);
      navigate('/');
    } catch (err: any) {
      console.error("Registration Error: ", err.response?.data || err.message);
      
      if (!err.response || [404, 405, 502, 503, 504].includes(err.response.status)) {
        // Missing or unavailable backend -> Fallback to Demo Mode
        handleDemoModeFallback();
        return;
      }

      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        setError(detail[0].msg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-400">
          <Heart className="h-12 w-12 fill-current" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-surface py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-dark-bg border border-white/10 rounded-xl text-sm focus:bg-white/5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none text-slate-50 placeholder:text-slate-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-dark-bg border border-white/10 rounded-xl text-sm focus:bg-white/5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none text-slate-50 placeholder:text-slate-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-dark-bg border border-white/10 rounded-xl text-sm focus:bg-white/5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none text-slate-50 placeholder:text-slate-500 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-900/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
