'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, getAuthToken } from '@/config/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await api.auth.login(email, password);

      if (!response.success) {
        return { success: false, error: response.error || 'Login failed' };
      }

      const loginToken = response.data?.token;
      const loginUser = response.data?.user;

      if (!loginToken || !loginUser) {
        return { success: false, error: 'Invalid response from server' };
      }

      setToken(loginToken);
      setUser(loginUser as unknown as User);
      localStorage.setItem('user', JSON.stringify(loginUser));
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      const response = await api.auth.register(email, password, name);

      if (!response.success) {
        return { success: false, error: response.error || 'Registration failed' };
      }

      const loginResult = await login(email, password);
      if (!loginResult.success) {
        return { success: false, error: loginResult.error || 'Account created but login failed. Please sign in manually.' };
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.auth.logout();
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
