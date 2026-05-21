import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BreadcrumbProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </BreadcrumbProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)