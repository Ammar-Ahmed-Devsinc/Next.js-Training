// app/state/movieAtoms.ts
import { atom } from 'jotai';

// TMDB API configuration
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Base atoms for data storage
export const moviesAtom = atom<any[]>([]);
export const searchResultsAtom = atom<any[]>([]);
export const searchQueryAtom = atom('');
export const selectedMovieAtom = atom<any | null>(null);
export const trendingMoviesAtom = atom<any[]>([]);

// Persistent favorites atom with localStorage
export const favoriteMoviesAtom = atom<any[]>(
  // Initialize from localStorage if available
  typeof window !== 'undefined' && localStorage.getItem('favoriteMovies')
    ? JSON.parse(localStorage.getItem('favoriteMovies') || '[]')
    : []
);

// Loading states
export const moviesLoadingAtom = atom(false);
export const searchLoadingAtom = atom(false);
export const trendingLoadingAtom = atom(false);

// Action atoms (write-only)
export const fetchMoviesAtom = atom(
  null,
  async (get, set) => {
    const currentMovies = get(moviesAtom);
    // Don't fetch if we already have movies
    if (currentMovies.length > 0) return;
    
    set(moviesLoadingAtom, true);
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      set(moviesAtom, data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      set(moviesAtom, []);
    } finally {
      set(moviesLoadingAtom, false);
    }
  }
);

export const fetchTrendingMoviesAtom = atom(
  null,
  async (get, set) => {
    const currentTrending = get(trendingMoviesAtom);
    // Don't fetch if we already have trending movies
    if (currentTrending.length > 0) return;
    
    set(trendingLoadingAtom, true);
    try {
      const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      set(trendingMoviesAtom, data.results || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      set(trendingMoviesAtom, []);
    } finally {
      set(trendingLoadingAtom, false);
    }
  }
);

// Search function atom
export const searchMoviesAtom = atom(
  null,
  async (get, set, query: string) => {
    if (!query.trim()) {
      set(searchResultsAtom, []);
      set(searchQueryAtom, '');
      return;
    }

    set(searchLoadingAtom, true);
    set(searchQueryAtom, query);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
      );
      const data = await response.json();
      set(searchResultsAtom, data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
      set(searchResultsAtom, []);
    } finally {
      set(searchLoadingAtom, false);
    }
  }
);