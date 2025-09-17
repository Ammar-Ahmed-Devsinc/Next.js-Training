// app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './providers/authProvider';

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // If not loading and not logged in, redirect to login
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
    // If logged in, redirect to dashboard
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, isLoading, router]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  // Show nothing while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}