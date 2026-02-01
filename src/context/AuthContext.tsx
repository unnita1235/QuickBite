'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, getAuthToken } from '@/config/api';

interface User {
  id: number;
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

  // Load token from localStorage on mount and validate it
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Try to parse stored user data
      let storedUser: User | null = null;
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          storedUser = JSON.parse(raw);
        }
      } catch {
        localStorage.removeItem('user');
      }

      // Set optimistically from localStorage, then validate
      if (storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      // Validate token by fetching current user from server
      try {
        const response = await api.auth.getCurrentUser();
        if (response.success && response.data) {
          const validatedUser = response.data as unknown as User;
          setToken(storedToken);
          setUser(validatedUser);
          localStorage.setItem('user', JSON.stringify(validatedUser));
        } else {
          // Token is invalid/expired - clear auth state
          setToken(null);
          setUser(null);
          api.auth.logout();
          localStorage.removeItem('user');
        }
      } catch {
        // Network error - keep the optimistic state from localStorage
      }

      setIsLoading(false);
    };

    initAuth();
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
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      const response = await api.auth.register(email, password, name);

      if (!response.success) {
        return { success: false, error: response.error || 'Registration failed' };
      }

      // Auto-login after registration
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
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
