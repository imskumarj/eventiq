"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser } from "../services/register";
import { loginUser } from "../services/login";

export type UserRole = "admin" | "sponsor" | "organizer";

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

  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("eventiq_user");
    const token = localStorage.getItem("eventiq_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setIsLoading(true);

    try {
      const res = await registerUser({ email, password, name, role });

      const { user, token } = res.data;

      setUser(user);

      localStorage.setItem("eventiq_user", JSON.stringify(user));
      localStorage.setItem("eventiq_token", token);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });

      const { user, token } = res.data;

      setUser(user);

      localStorage.setItem("eventiq_user", JSON.stringify(user));
      localStorage.setItem("eventiq_token", token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("eventiq_user");
    localStorage.removeItem("eventiq_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}