// app/trending/page.tsx
"use client";

import React, { useEffect } from 'react';
import "@/app/globals.css"
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { 
  trendingMoviesAtom, 
  selectedMovieAtom, 
  fetchTrendingMoviesAtom, 
  trendingLoadingAtom, 
  favoriteMoviesAtom,
  trendingCurrentPageAtom,
  trendingTotalPagesAtom
} from '../states/movieAtoms';

export default function TrendingPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [trending] = useAtom(trendingMoviesAtom);
  const [trendingLoading] = useAtom(trendingLoadingAtom);
  const [favorites, setFavorites] = useAtom(favoriteMoviesAtom);
  const setSelectedMovie = useSetAtom(selectedMovieAtom);
  const fetchTrendingMovies = useSetAtom(fetchTrendingMoviesAtom);
  const [currentPage] = useAtom(trendingCurrentPageAtom);
  const [totalPages] = useAtom(trendingTotalPagesAtom);

  // Fetch trending movies on mount
  useEffect(() => {
    fetchTrendingMovies(1);
  }, [fetchTrendingMovies]);

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

  const toggleFavorite = (movie: any, event: React.MouseEvent) => {
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
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      fetchTrendingMovies(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      fetchTrendingMovies(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-8">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <button
            onClick={handleBack}
            className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Trending Movies
          </h1>
        </div>

        {trendingLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : trending.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              No trending movies found
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((movie) => {
                const isFavorite = favorites.some(fav => fav.id === movie.id);
                
                return (
                  <div
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full"
                  >
                    <div className="relative">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-72 object-cover"
                        />
                      ) : (
                        <div className="w-full h-72 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 flex items-center justify-center">
                          <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {movie.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                        </span>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">
                            {movie.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <div className="flex justify-end">
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
                );
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}