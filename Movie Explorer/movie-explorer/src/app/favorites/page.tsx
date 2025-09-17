// app/favorites/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { favoriteMoviesAtom, selectedMovieAtom } from '../states/movieAtoms';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Star as StarIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useSetAtom } from 'jotai';

export default function FavoritesPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [favorites] = useAtom(favoriteMoviesAtom);
  const setSelectedMovie = useSetAtom(selectedMovieAtom);

  useEffect(() => {
    if ( !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn,  router]);


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

  if (favorites.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <FavoriteIcon sx={{ fontSize: 64, color: theme.palette.secondary.main, mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              No favorites yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Start exploring movies and add them to your favorites!
            </Typography>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        pb: 4
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <IconButton onClick={handleBack} sx={{ color: theme.palette.text.primary }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            My Favorites ({favorites.length})
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {favorites.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
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
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
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
                      <FavoriteIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
                    </Box>
                  )}
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}