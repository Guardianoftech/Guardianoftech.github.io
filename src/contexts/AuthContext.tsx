import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('mediconnect_currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('mediconnect_currentUser');
      }
    }
    const demoUser = { id: 1, name: 'Demo User', email: 'demo@example.com' };
    localStorage.setItem('mediconnect_currentUser', JSON.stringify(demoUser));
    return demoUser;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) return storedToken;
    const demoToken = 'demo_mode_token_default';
    localStorage.setItem('token', demoToken);
    return demoToken;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        if (token.startsWith('demo_mode_token_')) {
          const demoUser = localStorage.getItem('mediconnect_currentUser');
          if (demoUser) {
            setUser(JSON.parse(demoUser));
          } else {
            logout();
          }
          setIsLoading(false);
          return;
        }

        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    const demoUser = { id: 1, name: 'Demo User', email: 'demo@example.com' };
    const demoToken = 'demo_mode_token_default';
    localStorage.setItem('token', demoToken);
    localStorage.setItem('mediconnect_currentUser', JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
