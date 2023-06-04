import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from './auth-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
