// app/providers/themeProvider.tsx
"use client";

import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { movieTheme } from '../theme/movietheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={movieTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}