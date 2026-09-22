import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types.ts';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  quickDemoLogin: (role: 'admin' | 'nurse' | 'patient') => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'carehealth_jwt_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  // Fetch current user if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error verifying auth token:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        setIsLoading(false);
        return false;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Network error connecting to API');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role = 'patient', phone = ''): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        setIsLoading(false);
        return false;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Network error during registration');
      setIsLoading(false);
      return false;
    }
  };

  const quickDemoLogin = async (role: 'admin' | 'nurse' | 'patient') => {
    if (role === 'admin') {
      await login('admin@carehealth.com', 'admin123');
    } else if (role === 'nurse') {
      await login('nurse.priya@carehealth.com', 'nurse123');
    } else {
      await login('family.khanna@carehealth.com', 'patient123');
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
        authError,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
