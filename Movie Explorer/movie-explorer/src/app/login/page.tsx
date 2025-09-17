// app/login/page.tsx
"use client";

import React from 'react';
import '@/app/globals.css'
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { isLoggedIn, isLoading, login } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      ),
      title: "Browse",
      description: "Thousands of movies"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      title: "Favorites",
      description: "Save your picks"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      ),
      title: "Discover",
      description: "Find hidden gems"
    }
  ];

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-100 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:50px_50px]"></div>
      
      <div className="container max-w-sm mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-2xl overflow-visible relative">
          <div className="p-8">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-extrabold bg-gradient-to-br from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">
                MovieExplorer
              </h1>
              
              <p className="text-gray-600 text-lg font-light">
                Discover your next favorite film
              </p>
            </div>

            {/* Login Button */}
            <button
              className="w-full py-3 text-lg font-semibold bg-gradient-to-br from-blue-600 to-red-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              onClick={login}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entering Cinema...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Enter Movie World
                </>
              )}
            </button>

            {/* Features Section */}
            <div className="mt-8 pt-6 border-t border-gray-200/30">
              <p className="text-gray-600 text-sm text-center mb-6 font-medium">
                What awaits you inside:
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/50">
                    <div className="mb-2 flex justify-center">
                      {feature.icon}
                    </div>
                    <p className="text-sm font-semibold mb-1">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Chip */}
            <div className="text-center mt-6">
              <span className="inline-block px-2 py-1 text-xs border border-blue-300/50 text-blue-600 rounded-full">
                v1.0.0 Beta
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}