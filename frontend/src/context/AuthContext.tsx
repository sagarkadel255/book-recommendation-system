import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/authService';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (sessionStorage.getItem('booknest_access_token')) {
        const userData = await authService.getMe();
        setUser(userData);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const userData = await authService.login(credentials);
    setUser(userData);
  };

  const register = async (userData: any) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
