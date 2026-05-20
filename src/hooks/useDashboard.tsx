import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Module } from '@/types/database'

export interface ModuleWithProgress extends Module {
  progress: number
  totalUnits: number
  completedUnits: number
  isNew: boolean
}

async function fetchModulesWithProgress(userId: string): Promise<ModuleWithProgress[]> {
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
    const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0

    return { ...mod, progress, totalUnits, completedUnits, isNew: completedUnits === 0 }
  })
}

export const useDashboard = () => {
  const { user } = useAuth()

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules', user?.id],
    queryFn: () => fetchModulesWithProgress(user!.id),
    enabled: !!user,
  })

  return { modules, isLoading }
}
