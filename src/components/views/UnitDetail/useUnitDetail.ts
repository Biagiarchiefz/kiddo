import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Module, Unit, UnitContent } from '@/types/database'

async function fetchUnitDetail(moduleId: number, unitId: number, userId: string) {
  const [moduleRes, unitRes, contentRes, questionsRes, progressRes] = await Promise.all([
    supabase.from('modules').select('*').eq('id', moduleId).single(),
    supabase.from('units').select('*').eq('id', unitId).single(),
    supabase.from('unit_contents').select('*').eq('unit_id', unitId).maybeSingle(),
    supabase.from('questions').select('id').eq('unit_id', unitId),
    supabase
      .from('user_unit_progress')
      .select('status, correct_answers')
      .eq('user_id', userId)
      .eq('unit_id', unitId)
      .maybeSingle(),
  ])

  if (moduleRes.error) throw moduleRes.error
  if (unitRes.error) throw unitRes.error

  return {
    module: moduleRes.data as Module,
    unit: unitRes.data as Unit,
    content: contentRes.data as UnitContent | null,
    questionCount: (questionsRes.data ?? []).length,
    progress: progressRes.data ?? null,
  }
}

export const useUnitDetail = () => {
  const { id, unitId } = useParams<{ id: string; unitId: string }>()
  const { user } = useAuth()
  const moduleId = Number(id)
  const unitIdNum = Number(unitId)

  const { data, isLoading } = useQuery({
    queryKey: ['unit-detail', moduleId, unitIdNum, user?.id],
    queryFn: () => fetchUnitDetail(moduleId, unitIdNum, user!.id),
    enabled: !!user && !isNaN(moduleId) && !isNaN(unitIdNum),
  })

  return {
    module: data?.module ?? null,
    unit: data?.unit ?? null,
    content: data?.content ?? null,
    questionCount: data?.questionCount ?? 0,
    progress: data?.progress ?? null,
    isLoading,
  }
}