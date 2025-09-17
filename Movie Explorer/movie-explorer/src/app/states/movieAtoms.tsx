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

// Pagination atoms
export const currentPageAtom = atom(1);
export const totalPagesAtom = atom(1);
export const trendingCurrentPageAtom = atom(1);
export const trendingTotalPagesAtom = atom(1);
export const searchCurrentPageAtom = atom(1);
export const searchTotalPagesAtom = atom(1);

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
  async (get, set, page: number = 1) => {
    set(moviesLoadingAtom, true);
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      const data = await response.json();
      set(moviesAtom, data.results || []);
      set(currentPageAtom, data.page || 1);
      set(totalPagesAtom, data.total_pages || 1);
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
  async (get, set, page: number = 1) => {
    set(trendingLoadingAtom, true);
    try {
      const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      const data = await response.json();
      set(trendingMoviesAtom, data.results || []);
      set(trendingCurrentPageAtom, data.page || 1);
      set(trendingTotalPagesAtom, data.total_pages || 1);
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
  async (get, set, query: string, page: number = 1) => {
    if (!query.trim()) {
      set(searchResultsAtom, []);
      set(searchQueryAtom, '');
      return;
    }

    set(searchLoadingAtom, true);
    set(searchQueryAtom, query);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      set(searchResultsAtom, data.results || []);
      set(searchCurrentPageAtom, data.page || 1);
      set(searchTotalPagesAtom, data.total_pages || 1);
    } catch (error) {
      console.error('Error searching movies:', error);
      set(searchResultsAtom, []);
    } finally {
      set(searchLoadingAtom, false);
    }
  }
);