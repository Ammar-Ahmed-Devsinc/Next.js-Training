// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';

import {
  moviesAtom,
  searchResultsAtom,
  favoriteMoviesAtom,
  trendingMoviesAtom,
  searchMoviesAtom,
  selectedMovieAtom,
  fetchMoviesAtom,          // New
  moviesLoadingAtom,        // New
  searchLoadingAtom         // New
} from '../states/movieAtoms';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Zoom,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Movie as MovieIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import UserMenu from '../components/UserMenu';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  
  // Jotai atoms
  const [movies] = useAtom(moviesAtom);
  const [searchResults] = useAtom(searchResultsAtom);
  const [favorites, setFavorites] = useAtom(favoriteMoviesAtom);
  const setSelectedMovie = useSetAtom(selectedMovieAtom);
  const searchMovies = useSetAtom(searchMoviesAtom);
  const [moviesLoading] = useAtom(moviesLoadingAtom);        // New
  const [searchLoading] = useAtom(searchLoadingAtom);   
  const fetchMovies = useSetAtom(fetchMoviesAtom);           // New
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

   // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
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
        searchMovies(localSearchQuery);
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

  // In your dashboard page.tsx, update the toggleFavorite function:

const toggleFavorite = useCallback((movie: any, event: React.MouseEvent) => {
  event.stopPropagation();
  const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
  
  if (isCurrentlyFavorite) {
    const newFavorites = favorites.filter(fav => fav.id !== movie.id);
    setFavorites(newFavorites);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
    }
  } else {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteMovies', JSON.stringify(newFavorites));
    }
  }
}, [favorites, setFavorites]);

  const getDisplayMovies = () => {
    if (localSearchQuery) return searchResults;
    return movies; // Always show popular movies when not searching
  };

  const displayMovies = getDisplayMovies();
  const isLoading = localSearchQuery ? isSearching : false;

  if (!isLoggedIn) {
    return null;
  }

  const MovieCard = ({ movie, index }: { movie: any; index: number }) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    return (
      <Zoom in timeout={300 + index * 100} style={{ transitionDelay: `${index * 50}ms` }}>
        <Card
          onClick={() => handleMovieClick(movie)}
          elevation={0}
          sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 3,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              '& .movie-overlay': {
                opacity: 1
              }
            }
          }}
        >
          <CardMedia sx={{ position: 'relative' }}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ 
                  width: '100%', 
                  height: 300, 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.3)}, ${alpha(theme.palette.secondary.dark, 0.3)})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MovieIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
            )}
            
            {/* Hover Overlay */}
            <Box
              className="movie-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View Details
              </Button>
            </Box>
          </CardMedia>
          
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                size="small"
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Rating: {movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 'N/A'} ⭐
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {movie.vote_average?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>
              
              <IconButton
                size="small"
                onClick={(e) => toggleFavorite(movie, e)}
                sx={{
                  color: isFavorite ? theme.palette.secondary.main : theme.palette.text.secondary,
                  '&:hover': {
                    background: alpha(theme.palette.secondary.main, 0.1)
                  }
                }}
              >
                {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        pb: 4
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: `${alpha(theme.palette.background.paper, 0.9)}`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                width: 40,
                height: 40
              }}
            >
              <MovieIcon />
            </Avatar>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MovieExplorer
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Discover Amazing Movies
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 300, maxWidth: 600, mx: 'auto' }}
            >
              Search through thousands of movies and build your personal collection
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search for movies..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: isLoading && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    fontSize: '1.1rem',
                    py: 1,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      }
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Fade>

        {/* Navigation Buttons */}
        <Fade in timeout={1000}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<FavoriteIcon />}
              onClick={() => router.push('/favorites')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                }
              }}
            >
              My Favorites ({favorites.length})
            </Button>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              onClick={() => router.push('/trending')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                '&:hover': {
                  borderColor: theme.palette.info.dark,
                  backgroundColor: alpha(theme.palette.info.main, 0.1)
                }
              }}
            >
              Trending Movies
            </Button>
          </Box>
        </Fade>

        {/* Movies Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : displayMovies.length > 0 ? (
          <Grid container spacing={3}>
            {displayMovies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={movie.id}>
                <MovieCard movie={movie} index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MovieIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              No movies found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {localSearchQuery ? 'Try a different search term' : 'Loading movies...'}
            </Typography>
          </Box>
        )}

        {/* Stats Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Paper
              elevation={0}
              sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                    {movies.length}+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Movies Available
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.secondary.main }}>
                    {favorites.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Favorites
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.info.main }}>
                    ∞
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Possibilities
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}