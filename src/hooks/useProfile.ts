import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Profile {
  id: string
  username: string
  school: string
  avatar_url: string | null
  total_xp: number
  level: number
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export const useProfile = () => {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!user,
    staleTime: 1000 * 60,    // cache 1 menit
  })

  return { profile, isLoading }
}