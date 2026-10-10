import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import { CrmApp } from './App.tsx';
import './crm.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

createRoot(document.getElementById('crm-root')!).render(
  <QueryClientProvider client={queryClient}>
    <CrmApp />
    <Toaster position="top-center" richColors closeButton />
  </QueryClientProvider>,
);
