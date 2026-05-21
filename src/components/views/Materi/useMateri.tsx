import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'
import type { Module, Unit } from '@/types/database'

export interface UnitWithProgress extends Unit {
  status: 'locked' | 'in_progress' | 'completed'
  correctAnswers: number
  unlockRequirement: string | null
}

async function fetchModuleDetail(moduleId: number, userId: string) {
  const [moduleRes, unitsRes, progressRes] = await Promise.all([
    supabase.from('modules').select('*').eq('id', moduleId).single(),
    supabase.from('units').select('*').eq('module_id', moduleId).order('sort_order'),
    supabase.from('user_unit_progress').select('unit_id, status, correct_answers').eq('user_id', userId),
  ])

  const module = moduleRes.data as Module | null
  const units = (unitsRes.data ?? []) as Unit[]
  const progressRows = progressRes.data ?? []

  if (!module) return null

  const progressMap = new Map(progressRows.map(p => [p.unit_id, p]))

  const unitsWithProgress: UnitWithProgress[] = units.map((unit, index) => {
    const prog = progressMap.get(unit.id)
    let status: 'locked' | 'in_progress' | 'completed' = prog?.status ?? 'locked'

    // Unit pertama selalu bisa dimulai
    if (index === 0 && status === 'locked') status = 'in_progress'

    let unlockRequirement: string | null = null
    if (status === 'locked' && unit.unlock_required_correct > 0 && index > 0) {
      const prevUnit = units[index - 1]
      const prevProg = progressMap.get(prevUnit.id)
      const prevCorrect = prevProg?.correct_answers ?? 0
      unlockRequirement = `Selesaikan ${unit.unlock_required_correct} pertanyaan kuis dari "${prevUnit.title}" untuk membuka unit ini. (${prevCorrect}/${unit.unlock_required_correct} benar)`
    }

    return { ...unit, status, correctAnswers: prog?.correct_answers ?? 0, unlockRequirement }
  })

  const totalXp = units.reduce((sum, u) => sum + u.xp_reward, 0)

  return { module, units: unitsWithProgress, totalXp }
}

export const useMateri = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const moduleId = Number(id)

  const { data, isLoading } = useQuery({
    queryKey: ['module', moduleId, user?.id],
    queryFn: () => fetchModuleDetail(moduleId, user!.id),
    enabled: !!user && !isNaN(moduleId),
  })

  const module = data?.module ?? null
  useBreadcrumb([
    { label: 'Materi', href: '/dashboard' },
    { label: module?.title ?? '...' },
  ])

  return {
    module,
    units: data?.units ?? [],
    totalXp: data?.totalXp ?? 0,
    isLoading,
  }
}
