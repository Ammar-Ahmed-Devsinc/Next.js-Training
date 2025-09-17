// app/movie/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { favoriteMoviesAtom, selectedMovieAtom } from '../../states/movieAtoms';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Rating,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  Theaters as TheatersIcon,
  MonetizationOn as MoneyIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import Image from 'next/image';

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
  const theme = useTheme();
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
      setFavorites(prev => prev.filter(fav => fav.id !== movieDetails.id));
    } else {
      setFavorites(prev => [...prev, movieDetails]);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movieDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Movie not found'}
          </Typography>
          <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
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
    <Box
      sx={{
        minHeight: '100vh',
        background: backdropUrl 
          ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backdropUrl})`
          : `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pb: 4
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ 
              color: 'white',
              background: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { background: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Movie Details
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
          }}
        >
          <Grid container>
            {/* Poster Column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <img
                  src={movieDetails.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                    : '/placeholder-poster.jpg'
                  }
                  alt={movieDetails.title}
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                />
                
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <IconButton
                    onClick={toggleFavorite}
                    sx={{
                      color: isFavorite ? theme.palette.secondary.main : theme.palette.text.secondary,
                      border: `2px solid ${isFavorite ? theme.palette.secondary.main : theme.palette.divider}`,
                      borderRadius: 2,
                      py: 1.5,
                      '&:hover': {
                        background: alpha(theme.palette.secondary.main, 0.1)
                      }
                    }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Typography>
                  </IconButton>

                  {movieDetails.homepage && (
                    <Button
                      variant="outlined"
                      fullWidth
                      href={movieDetails.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      Official Website
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Details Column */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 4 }}>
                {/* Title and Rating */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
                    {movieDetails.title}
                  </Typography>
                  
                  {movieDetails.tagline && (
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ fontStyle: 'italic', mb: 2 }}
                    >
                      "{movieDetails.tagline}"
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#FFD700' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {movieDetails.vote_average.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({movieDetails.vote_count.toLocaleString()} votes)
                      </Typography>
                    </Box>

                    <Chip
                      icon={<CalendarIcon />}
                      label={movieDetails.release_date.split('-')[0]}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Overview */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Overview
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {movieDetails.overview || 'No overview available.'}
                  </Typography>
                </Box>

                {/* Details Grid */}
                <Grid container spacing={3}>
                  {/* Genres */}
                  {movieDetails.genres && movieDetails.genres.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Genres
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {movieDetails.genres.map(genre => (
                          <Chip
                            key={genre.id}
                            label={genre.name}
                            size="small"
                            sx={{
                              background: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Runtime */}
                  {movieDetails.runtime && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Runtime
                      </Typography>
                      <Typography variant="body2">
                        {formatRuntime(movieDetails.runtime)}
                      </Typography>
                    </Grid>
                  )}

                  {/* Languages */}
                  {movieDetails.spoken_languages && movieDetails.spoken_languages.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Languages
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {movieDetails.spoken_languages.map((lang, index) => (
                          <Chip
                            key={index}
                            icon={<LanguageIcon />}
                            label={lang.english_name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Status */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                      Status
                    </Typography>
                    <Typography variant="body2">
                      {movieDetails.status}
                    </Typography>
                  </Grid>

                  {/* Budget */}
                  {movieDetails.budget > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Budget
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatCurrency(movieDetails.budget)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {/* Revenue */}
                  {movieDetails.revenue > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Revenue
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatCurrency(movieDetails.revenue)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {/* Production Companies */}
                  {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Production Companies
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {movieDetails.production_companies.map(company => (
                          <Chip
                            key={company.id}
                            label={company.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}