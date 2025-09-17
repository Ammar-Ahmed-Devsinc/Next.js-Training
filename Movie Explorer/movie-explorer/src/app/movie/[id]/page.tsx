// app/movie/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import "@/app/globals.css"
import { useAuth } from '../../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { favoriteMoviesAtom, selectedMovieAtom } from '../../states/movieAtoms';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; name: string }[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useAtom(favoriteMoviesAtom);
  const [selectedMovie, setSelectedMovie] = useAtom(selectedMovieAtom);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovieDetails(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    // If we have the movie data from navigation, use it temporarily
    if (selectedMovie) {
      setMovieDetails(selectedMovie as any);
    }

    fetchMovieDetails();
  }, [params.id, isLoggedIn, router, selectedMovie]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const toggleFavorite = () => {
    if (!movieDetails) return;

    const isCurrentlyFavorite = favorites.some(fav => fav.id === movieDetails.id);

    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter((fav: { id: number; }) => fav.id !== movieDetails.id));
    } else {
      setFavorites((prev: any) => [...prev, movieDetails]);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {error || 'Movie not found'}
          </h2>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === movieDetails.id);
  const backdropUrl = movieDetails.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`
    : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      className="min-h-screen pb-8 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: backdropUrl
          ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backdropUrl})`
          : 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'
      }}
    >
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <button
            onClick={handleBack}
            className="text-white cursor-pointer bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Movie Details
          </h1>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Poster Column */}
            <div className="md:col-span-1 p-6 text-center">
              <img
                src={movieDetails.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                  : '/placeholder-poster.jpg'
                }
                alt={movieDetails.title}
                className="w-full max-w-xs rounded-xl shadow-lg mx-auto"
              />

              <div className="mt-6 space-y-3">
                <button
                  onClick={toggleFavorite}
                  className={`w-full cursor-pointer py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors ${isFavorite
                      ? 'border-red-500 text-red-600 hover:bg-red-50'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
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
                  <span className="font-semibold text-sm">
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </span>
                </button>

                {movieDetails.homepage && (
                  <a
                    href={movieDetails.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 border-2 border-blue-500 text-blue-600 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-sm">Official Website</span>
                  </a>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-3 p-6">
              {/* Title and Rating */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {movieDetails.title}
                </h1>

                {movieDetails.tagline && (
                  <p className="text-lg text-gray-600 italic mb-4">
                    "{movieDetails.tagline}"
                  </p>
                )}

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold">
                      {movieDetails.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({movieDetails.vote_count.toLocaleString()} votes)
                    </span>
                  </div>

                  <span className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {movieDetails.release_date.split('-')[0]}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              {/* Overview */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {movieDetails.overview || 'No overview available.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Genres */}
                {movieDetails.genres && movieDetails.genres.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Genres
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {movieDetails.genres.map(genre => (
                        <span
                          key={genre.id}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Runtime */}
                {movieDetails.runtime && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Runtime
                    </h3>
                    <p className="text-gray-700">
                      {formatRuntime(movieDetails.runtime)}
                    </p>
                  </div>
                )}

                {/* Languages */}
                {movieDetails.spoken_languages && movieDetails.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Languages
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {movieDetails.spoken_languages.map((lang, index) => (
                        <span
                          key={index}
                          className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                          {lang.english_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Status
                  </h3>
                  <p className="text-gray-700">
                    {movieDetails.status}
                  </p>
                </div>

                {/* Budget */}
                {movieDetails.budget > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Budget
                    </h3>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        {formatCurrency(movieDetails.budget)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Revenue */}
                {movieDetails.revenue > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Revenue
                    </h3>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">
                        {formatCurrency(movieDetails.revenue)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Production Companies */}
                {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Production Companies
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {movieDetails.production_companies.map(company => (
                        <span
                          key={company.id}
                          className="border border-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {company.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}