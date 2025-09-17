// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import '@/app/globals.css'
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import {
  moviesAtom,
  searchResultsAtom,
  favoriteMoviesAtom,
  selectedMovieAtom,
  searchMoviesAtom,
  fetchMoviesAtom,
  moviesLoadingAtom,
  searchLoadingAtom,
  currentPageAtom,
  totalPagesAtom,
  searchCurrentPageAtom,
  searchTotalPagesAtom
} from '../states/movieAtoms';
import UserMenu from '../components/UserMenu';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  // Jotai atoms
  const [movies] = useAtom(moviesAtom);
  const [searchResults] = useAtom(searchResultsAtom);
  const [favorites, setFavorites] = useAtom(favoriteMoviesAtom);
  const setSelectedMovie = useSetAtom(selectedMovieAtom);
  const searchMovies = useSetAtom(searchMoviesAtom);
  const [moviesLoading] = useAtom(moviesLoadingAtom);
  const [searchLoading] = useAtom(searchLoadingAtom);
  const fetchMovies = useSetAtom(fetchMoviesAtom);
  const [currentPage] = useAtom(currentPageAtom);
  const [totalPages] = useAtom(totalPagesAtom);
  const [searchCurrentPage] = useAtom(searchCurrentPageAtom);
  const [searchTotalPages] = useAtom(searchTotalPagesAtom);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Debounced search
  useEffect(() => {
    if (localSearchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        searchMovies(localSearchQuery, 1);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [localSearchQuery, searchMovies]);

  const handleMovieClick = useCallback((movie: any) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  }, [setSelectedMovie, router]);

  const toggleFavorite = useCallback((movie: any, event: React.MouseEvent) => {
    event.stopPropagation();
    const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (isCurrentlyFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== movie.id);
      setFavorites(newFavorites);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
      }
    } else {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
      }
    }
  }, [favorites, setFavorites]);

  const getDisplayMovies = () => {
    if (localSearchQuery) return searchResults;
    return movies;
  };

  const getCurrentPage = () => {
    if (localSearchQuery) return searchCurrentPage;
    return currentPage;
  };

  const getTotalPages = () => {
    if (localSearchQuery) return searchTotalPages;
    return totalPages;
  };

  const handleNextPage = () => {
    const nextPage = getCurrentPage() + 1;
    if (nextPage <= getTotalPages()) {
      if (localSearchQuery) {
        searchMovies(localSearchQuery, nextPage);
      } else {
        fetchMovies(nextPage);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    const prevPage = getCurrentPage() - 1;
    if (prevPage >= 1) {
      if (localSearchQuery) {
        searchMovies(localSearchQuery, prevPage);
      } else {
        fetchMovies(prevPage);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const displayMovies = getDisplayMovies();
  const isLoading = localSearchQuery ? isSearching : moviesLoading;

  if (!isLoggedIn) {
    return null;
  }

  const MovieCard = ({ movie, index }: { movie: any; index: number }) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    return (
      <div
        className="transform transition-all duration-300 hover:-translate-y-2"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div
          onClick={() => handleMovieClick(movie)}
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer h-full hover:shadow-xl hover:border-blue-300/50 relative group"
        >
          <div className="relative">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-72 bg-gradient-to-br from-blue-300/30 to-red-300/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="bg-gradient-to-br from-blue-600 to-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                View Details
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 truncate">
              {movie.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              </span>
              <span className="text-sm text-gray-600">
                Rating: {movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 'N/A'} ⭐
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">
                  {movie.vote_average?.toFixed(1) || 'N/A'}
                </span>
              </div>
              
              <button
                onClick={(e) => toggleFavorite(movie, e)}
                className={`p-1 rounded-full transition-colors ${
                  isFavorite 
                    ? 'text-red-600 hover:bg-red-100' 
                    : 'text-gray-400 hover:bg-gray-100'
                } cursor-pointer`}
              >
                {isFavorite ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-br from-blue-600 to-red-600 bg-clip-text text-transparent">
                MovieExplorer
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-br from-blue-600 to-red-600 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Search through thousands of movies and build your personal collection
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for movies..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-2xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap animate-fade-in">
          <button
            onClick={() => router.push('/favorites')}
            className="border-2 cursor-pointer border-red-500 text-red-600 px-6 py-2 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 hover:bg-red-50 hover:border-red-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            My Favorites ({favorites.length})
          </button>
          <button
            onClick={() => router.push('/trending')}
            className="border-2 border-blue-400 cursor-pointer text-blue-500 px-6 py-2 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 hover:bg-blue-50 hover:border-blue-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            Trending Movies
          </button>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
            
            {/* Pagination */}
              {getTotalPages() > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={getCurrentPage() === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {getCurrentPage()} of {getTotalPages()}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={getCurrentPage() === getTotalPages()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              No movies found
            </h3>
            <p className="text-gray-600">
              {localSearchQuery ? 'Try a different search term' : 'Loading movies...'}
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">
                  {movies.length}+
                </div>
                <div className="text-sm text-gray-600">
                  Movies Available
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-red-600 mb-1">
                  {favorites.length}
                </div>
                <div className="text-sm text-gray-600">
                  Your Favorites
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-blue-400 mb-1">
                  ∞
                </div>
                <div className="text-sm text-gray-600">
                  Possibilities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}