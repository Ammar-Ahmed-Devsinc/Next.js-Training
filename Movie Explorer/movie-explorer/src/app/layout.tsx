// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthProvider } from './providers/authProvider';
import { JotaiProvider } from './providers/jotaiProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieExplorer - Discover Your Next Favorite Film',
  description: 'Browse, search, and favorite movies from a vast collection.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <JotaiProvider>
          
            <AuthProvider>
              {children}
            </AuthProvider>
       
        </JotaiProvider>
      </body>
    </html>
  );
}