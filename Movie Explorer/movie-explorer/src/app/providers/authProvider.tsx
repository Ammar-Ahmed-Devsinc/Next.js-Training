// app/providers/authProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state synchronously to avoid flash
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially

  useEffect(() => {
    // This effect now only handles hydration mismatch if any
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('isLoggedIn') === 'true';
      if (storedAuth !== isLoggedIn) {
        setIsLoggedIn(storedAuth);
      }
    }
  }, [isLoggedIn]);

  const login = () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
      }
    }, 1500);
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
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