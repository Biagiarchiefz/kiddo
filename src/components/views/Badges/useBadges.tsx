import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

export interface Badge {
  id: number
  title: string
  description: string
  emoji: string
  headerBg: string
  earned: boolean
  completedUnits: number
  totalUnits: number
}

async function fetchBadgeData(userId: string): Promise<Badge[]> {
  const [modulesRes, unitsRes, progressRes] = await Promise.all([
    supabase.from('modules').select('*').eq('is_published', true).order('sort_order'),
    supabase.from('units').select('id, module_id'),
    supabase.from('user_unit_progress').select('unit_id, status').eq('user_id', userId),
  ])

  const modules = modulesRes.data ?? []
  const units = unitsRes.data ?? []
  const progressRows = progressRes.data ?? []

  const unitsByModule = units.reduce<Record<number, number[]>>((acc, u) => {
    ;(acc[u.module_id] ??= []).push(u.id)
    return acc
  }, {})

  const completedSet = new Set(
    progressRows.filter(p => p.status === 'completed').map(p => p.unit_id)
  )

  return modules.map(mod => {
    const modUnitIds = unitsByModule[mod.id] ?? []
    const completedUnits = modUnitIds.filter(id => completedSet.has(id)).length
    const totalUnits = modUnitIds.length
    const earned = totalUnits > 0 && completedUnits === totalUnits

    return {
      id: mod.id,
      title: mod.title,
      description: mod.description ?? '',
      emoji: mod.emoji ?? '📚',
      headerBg: mod.header_bg ?? 'bg-sky-400',
      earned,
      completedUnits,
      totalUnits,
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