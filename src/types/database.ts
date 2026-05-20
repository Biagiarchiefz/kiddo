export interface Module {
  id: number
  title: string
  description: string
  emoji: string
  level: number
  header_bg: string
  progress_color: string
  badge_color: string
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface Unit {
  id: number
  module_id: number
  title: string
  description: string
  sort_order: number
  xp_reward: number
  unlock_required_correct: number
  created_at: string
}

export interface UserUnitProgress {
  id: string
  user_id: string
  unit_id: number
  status: 'locked' | 'in_progress' | 'completed'
  correct_answers: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type SectionBlock =
  | { type: 'paragraph'; title: string; body: string }
  | { type: 'info_boxes'; boxes: Array<{ title: string; icon: string; body: string }> }

export interface UnitContent {
  id: number
  unit_id: number
  intro: string
  sections: SectionBlock[]
  created_at: string
}
