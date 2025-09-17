// app/favorites/page.tsx
"use client";

import React, { useEffect } from 'react';
import '@/app/globals.css'
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { favoriteMoviesAtom, selectedMovieAtom } from '../states/movieAtoms';
import { useSetAtom } from 'jotai';

export default function FavoritesPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useAtom(favoriteMoviesAtom);
  const setSelectedMovie = useSetAtom(selectedMovieAtom);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const removeFromFavorites = (movie: any, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = favorites.filter(fav => fav.id !== movie.id);
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/30 flex items-center justify-center">
        <div className="container max-w-sm mx-auto px-4">
          <div className="text-center p-6 bg-gray-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl">
            <svg 
              className="w-16 h-16 text-pink-500 mx-auto mb-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold mb-2 text-white">
              No favorites yet
            </h2>
            <p className="text-gray-400 mb-6">
              Start exploring movies and add them to your favorites!
            </p>
            <button
              onClick={handleBack}
              className="bg-gradient-to-br cursor-pointer from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 hover:shadow-purple-500/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/30 pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <button
            onClick={handleBack}
            className="text-gray-400 cursor-pointer hover:text-white p-2 rounded-full hover:bg-purple-700/30 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">
            My Favorites ({favorites.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="bg-gray-800/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-purple-500/50 cursor-pointer group"
            >
              <div className="relative">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-pink-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 truncate">
                  {movie.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-900/60 text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-white">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Remove from Favorites Button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => removeFromFavorites(movie, e)}
                    className="p-1 rounded-full transition-all duration-300 text-red-500 hover:bg-red-900/40 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}