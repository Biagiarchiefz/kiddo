import { Navigate, Outlet } from 'react-router'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'

const AdminGuard = () => {
  const { user, loading: authLoading } = useAuth()
  const { profile, isLoading: profileLoading } = useProfile()

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default AdminGuard