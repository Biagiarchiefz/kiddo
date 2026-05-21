import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'

const GuestGuard = () => {
  const { user, loading } = useAuth()
  const { profile, isLoading: profileLoading } = useProfile()

  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <Outlet />
}

export default GuestGuard