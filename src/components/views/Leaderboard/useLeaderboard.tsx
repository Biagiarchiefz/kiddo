import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

export interface RankEntry {
  rank: number
  id: string
  name: string
  school: string
  xp: number
  level: number
  isCurrentUser: boolean
  bg: string
  text: string
}

const avatarPalette = [
  { bg: 'bg-secondary',   text: 'text-white' },
  { bg: 'bg-slate-300',   text: 'text-slate-700' },
  { bg: 'bg-amber-300',   text: 'text-amber-800' },
  { bg: 'bg-orange-300',  text: 'text-orange-800' },
  { bg: 'bg-sky-300',     text: 'text-sky-800' },
  { bg: 'bg-rose-300',    text: 'text-rose-800' },
  { bg: 'bg-purple-300',  text: 'text-purple-800' },
  { bg: 'bg-primary',     text: 'text-white' },
]

async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, school, total_xp, level')
    .order('total_xp', { ascending: false })

  if (error) throw error
  return data ?? []
}

export const useLeaderboard = () => {
  useBreadcrumb([{ label: 'Papan Peringkat' }])
  const { user } = useAuth()

  const { data = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 60_000,
  })

  const allRankings: RankEntry[] = data.map((p, i) => {
    const palette = avatarPalette[i % avatarPalette.length]
    return {
      rank: i + 1,
      id: p.id,
      name: p.username ?? 'Anonim',
      school: p.school || '—',
      xp: p.total_xp ?? 0,
      level: p.level ?? 1,
      isCurrentUser: p.id === user?.id,
      ...palette,
    }
  })

  const top5 = allRankings.slice(0, 5)
  const currentUserEntry = allRankings.find(r => r.isCurrentUser)
  // Only expose currentUserEntry separately when they're outside the top 5
  const currentUserOutside = currentUserEntry && currentUserEntry.rank > 5 ? currentUserEntry : undefined

  return { rankings: top5, currentUserEntry: currentUserOutside, isLoading }
}