// cspell:disable
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { queryClient } from './lib/queryClient';
import './assets/style.css';

// main.jsx adalah entry point aplikasi. Tiga provider yang dibungkus di sini:
// - StrictMode: mendeteksi side effect yang tidak aman di development (double-invoke effects)
// - QueryClientProvider: menyediakan queryClient ke seluruh component tree
// - Toaster: dipasang di root agar notifikasi toast bisa dipicu dari komponen mana saja
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-center" />
    </QueryClientProvider>
  </StrictMode>,
);
