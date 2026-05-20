import Home from '@/components/views/Home/Home'
import { createBrowserRouter } from 'react-router'
import { dashboardRoutes } from '@/features/dashboard/dashboard.routes'
import { authRoutes } from '@/features/auth/auth.routes'
import { leaderboardRoutes } from '@/features/leaderboard/leaderboard.routes'
import { challengesRoutes } from '@/features/challenges/challenges.routes'
import { materiRoutes } from '@/features/materi/materi.routes'
import AuthGuard from '@/components/common/AuthGuard'
import GuestGuard from '@/components/common/GuestGuard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  // Auth pages — redirect to /dashboard if already logged in
  {
    element: <GuestGuard />,
    children: [...authRoutes],
  },
  // Protected pages — redirect to /login if not authenticated
  {
    element: <AuthGuard />,
    children: [
      ...dashboardRoutes,
      ...leaderboardRoutes,
      ...challengesRoutes,
      ...materiRoutes,
    ],
  },
])