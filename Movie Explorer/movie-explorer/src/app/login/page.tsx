"use client";

import React from 'react';
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Movie as MovieIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  Login as LoginIcon
} from '@mui/icons-material';

export default function LoginPage() {
  const { isLoggedIn, isLoading, login } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const features = [
    {
      icon: <MovieIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      title: "Browse",
      description: "Thousands of movies"
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />,
      title: "Favorites",
      description: "Save your picks"
    },
    {
      icon: <SearchIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />,
      title: "Discover",
      description: "Find hidden gems"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.95)} 50%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)',
          backgroundSize: '50px 50px',
        }}
      />
      
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            overflow: 'visible',
            position: 'relative'
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 24px auto',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <MovieIcon sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                MovieExplorer
              </Typography>
              
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 300 }}
              >
                Discover your next favorite film
              </Typography>
            </Box>

            {/* Login Button */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={login}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: 3,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:disabled': {
                  background: alpha(theme.palette.action.disabled, 0.3),
                  transform: 'none'
                }
              }}
            >
              {isLoading ? 'Entering Cinema...' : 'Enter Movie World'}
            </Button>

            {/* Features Section */}
            <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, fontWeight: 500 }}
              >
                What awaits you inside:
              </Typography>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          background: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Version Chip */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Chip
                label="v1.0.0 Beta"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}