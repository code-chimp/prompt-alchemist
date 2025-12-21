import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { Toaster } from '@/components/ui/sonner.tsx';
import '@/lib/global-errors';

import App from './App';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
    <Toaster richColors />
  </StrictMode>,
);
