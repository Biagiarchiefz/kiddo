import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

export interface BadgeItem {
  id: number
  name: string
  description: string
  emoji: string
  conditionType: string
  conditionValue: number
  earned: boolean
  earnedAt: string | null
  // progress info (for unearned badges)
  progressCurrent: number
  progressTotal: number
  headerBg: string
}

const bgByType: Record<string, string> = {
  level_up:            'bg-amber-400',
  xp_milestone:        'bg-sky-400',
  module_completed:    'bg-green-400',
  unit_completed:      'bg-purple-400',
  quiz_correct_streak: 'bg-red-400',
}

async function fetchBadgeData(userId: string): Promise<BadgeItem[]> {
  const [badgesRes, earnedRes, profileRes, unitsRes, progressRes] = await Promise.all([
    supabase.from('badges').select('*').order('condition_type').order('condition_value'),
    supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', userId),
    supabase.from('profiles').select('total_xp, level').eq('id', userId).single(),
    supabase.from('units').select('id, module_id'),
    supabase.from('user_unit_progress').select('unit_id, status').eq('user_id', userId),
  ])

  const badges      = badgesRes.data ?? []
  const earnedSet   = new Map((earnedRes.data ?? []).map(e => [e.badge_id, e.earned_at]))
  const profile     = profileRes.data ?? { total_xp: 0, level: 1 }
  const units       = unitsRes.data ?? []
  const progress    = progressRes.data ?? []

  const completedUnitIds = new Set(
    progress.filter(p => p.status === 'completed').map(p => p.unit_id)
  )

  // units grouped by module
  const unitsByModule = units.reduce<Record<number, number[]>>((acc, u) => {
    ;(acc[u.module_id] ??= []).push(u.id)
    return acc
  }, {})

  const totalCompletedUnits = completedUnitIds.size

  return badges.map(b => {
    const earned   = earnedSet.has(b.id)
    const earnedAt = earnedSet.get(b.id) ?? null

    let progressCurrent = 0
    let progressTotal   = b.condition_value

    switch (b.condition_type) {
      case 'level_up':
        progressCurrent = profile.level
        progressTotal   = b.condition_value
        break
      case 'xp_milestone':
        progressCurrent = profile.total_xp
        progressTotal   = b.condition_value
        break
      case 'module_completed': {
        const modUnits = unitsByModule[b.condition_value] ?? []
        progressCurrent = modUnits.filter(id => completedUnitIds.has(id)).length
        progressTotal   = modUnits.length
        break
      }
      case 'unit_completed':
        progressCurrent = totalCompletedUnits
        progressTotal   = b.condition_value
        break
      case 'quiz_correct_streak':
        progressCurrent = Math.min(totalCompletedUnits, b.condition_value)
        progressTotal   = b.condition_value
        break
    }

    return {
      id:               b.id,
      name:             b.name,
      description:      b.description,
      emoji:            b.emoji,
      conditionType:    b.condition_type,
      conditionValue:   b.condition_value,
      earned,
      earnedAt,
      progressCurrent:  Math.min(progressCurrent, progressTotal),
      progressTotal,
      headerBg:         bgByType[b.condition_type] ?? 'bg-muted',
    }
  })
}

export const useBadges = () => {
  useBreadcrumb([{ label: 'Lencana' }])
  const { user } = useAuth()

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['badges', user?.id],
    queryFn: () => fetchBadgeData(user!.id),
    enabled: !!user,
    staleTime: 60_000,
  })

  const earnedCount = badges.filter(b => b.earned).length

  return { badges, earnedCount, isLoading }
}
