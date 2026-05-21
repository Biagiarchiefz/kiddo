import Home from '@/components/views/Home/Home'
import { createBrowserRouter } from 'react-router'
import { dashboardRoutes } from '@/features/dashboard/dashboard.routes'
import { authRoutes } from '@/features/auth/auth.routes'
import { leaderboardRoutes } from '@/features/leaderboard/leaderboard.routes'
import { challengesRoutes } from '@/features/challenges/challenges.routes'
import { materiRoutes } from '@/features/materi/materi.routes'
import { badgesRoutes } from '@/features/badges/badges.routes'
import { adminRoutes } from '@/features/admin/admin.routes'
import AuthGuard from '@/components/common/AuthGuard'
import AdminGuard from '@/components/common/AdminGuard'
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
  // Protected pages — redirect to / if not authenticated
  {
    element: <AuthGuard />,
    children: [
      ...dashboardRoutes,
      ...leaderboardRoutes,
      ...challengesRoutes,
      ...materiRoutes,
      ...badgesRoutes,
    ],
  },
  // Admin pages — redirect to /dashboard if not admin
  {
    element: <AdminGuard />,
    children: [...adminRoutes],
  },
])