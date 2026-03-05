"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

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
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("eventiq_user");
    const token = localStorage.getItem("eventiq_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      setUser(user);

      localStorage.setItem("eventiq_user", JSON.stringify(user));
      localStorage.setItem("eventiq_token", token);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        name,
        role,
      });

      const { user, token } = res.data;

      setUser(user);

      localStorage.setItem("eventiq_user", JSON.stringify(user));
      localStorage.setItem("eventiq_token", token);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");

      setUser(null);

      localStorage.removeItem("eventiq_user");
      localStorage.removeItem("eventiq_token");
    } catch {
      // even if API fails, clear locally
      setUser(null);
      localStorage.removeItem("eventiq_user");
      localStorage.removeItem("eventiq_token");
    }
  };

  // RESET PASSWORD
  const resetPassword = async (email: string) => {
    await api.post("/auth/reset-password", { email });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
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