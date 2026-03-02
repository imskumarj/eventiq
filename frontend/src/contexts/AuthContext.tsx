import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'sponsor' | 'organizer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@eventiq.com': {
    id: '1',
    email: 'admin@eventiq.com',
    name: 'Alex Morgan',
    role: 'admin',
    organization: 'EventIQ Corp',
    password: 'admin123',
  },
  'sponsor@eventiq.com': {
    id: '2',
    email: 'sponsor@eventiq.com',
    name: 'Sarah Chen',
    role: 'sponsor',
    organization: 'TechVentures Inc',
    password: 'sponsor123',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('eventiq_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const demoUser = DEMO_USERS[email];
    if (demoUser && demoUser.password === password) {
      const { password: _, ...userData } = demoUser;
      setUser(userData);
      localStorage.setItem('eventiq_user', JSON.stringify(userData));
    } else {
      // Allow any login for demo
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: 'admin',
        organization: 'Demo Org',
      };
      setUser(newUser);
      localStorage.setItem('eventiq_user', JSON.stringify(newUser));
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      organization: 'New Organization',
    };
    setUser(newUser);
    localStorage.setItem('eventiq_user', JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('eventiq_user');
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await new Promise(r => setTimeout(r, 800));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
