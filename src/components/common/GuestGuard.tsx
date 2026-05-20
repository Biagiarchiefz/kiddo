import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'

const GuestGuard = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default GuestGuard