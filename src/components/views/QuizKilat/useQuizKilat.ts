import { useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Module, Unit } from '@/types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: number
  question_id: number
  option_key: string
  text: string
}

export interface QuestionWithOptions {
  id: number
  unit_id: number
  category: string
  question: string
  hint: string | null
  correct: string
  xp_reward: number
  question_options: QuestionOption[]
}

interface AnswerRecord {
  questionId: number
  selectedOption: string
  isCorrect: boolean
  xpEarned: number
}

// ── Data fetcher ──────────────────────────────────────────────────────────────

async function fetchQuizData(moduleId: number, unitId: number, userId: string) {
  const [moduleRes, unitRes, questionsRes, progressRes] = await Promise.all([
    supabase.from('modules').select('*').eq('id', moduleId).single(),
    supabase.from('units').select('*').eq('id', unitId).single(),
    supabase
      .from('questions')
      .select('*, question_options(id, question_id, option_key, text)')
      .eq('unit_id', unitId)
      .order('id'),
    supabase
      .from('user_unit_progress')
      .select('status, correct_answers')
      .eq('user_id', userId)
      .eq('unit_id', unitId)
      .maybeSingle(),
  ])

  if (moduleRes.error) throw moduleRes.error
  if (unitRes.error) throw unitRes.error

  const questions = (questionsRes.data ?? []) as QuestionWithOptions[]
  questions.forEach(q => {
    q.question_options.sort((a, b) => a.option_key.localeCompare(b.option_key))
  })

  return {
    module: moduleRes.data as Module,
    unit: unitRes.data as Unit,
    questions,
    unitProgress: progressRes.data ?? null,
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useQuizKilat = () => {
  const { id, unitId } = useParams<{ id: string; unitId: string }>()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const sessionIdRef = useRef<string | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalXpEarned, setTotalXpEarned] = useState(0)
  const [unitCompletionXp, setUnitCompletionXp] = useState(0)

  const moduleId = Number(id)
  const unitIdNum = Number(unitId)

  const { data, isLoading } = useQuery({
    queryKey: ['quiz-kilat', moduleId, unitIdNum, user?.id],
    queryFn: () => fetchQuizData(moduleId, unitIdNum, user!.id),
    enabled: !!user && !isNaN(moduleId) && !isNaN(unitIdNum),
    staleTime: Infinity,
  })

  const questions = data?.questions ?? []
  const currentQuestion = questions[currentIndex]

  const ensureSession = async (): Promise<string> => {
    if (sessionIdRef.current) return sessionIdRef.current
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user!.id,
        unit_id: unitIdNum,
        session_type: 'unit',
        total_q: questions.length,
      })
      .select('id')
      .single()
    if (error) throw error
    sessionIdRef.current = session.id
    return session.id
  }

  const submitAndNext = async () => {
    if (!selectedAnswer || !currentQuestion || isSubmitting) return
    setIsSubmitting(true)

    try {
      const sessionId = await ensureSession()
      const isCorrect = selectedAnswer === currentQuestion.correct

      // Insert attempt — the DB trigger handles XP + progress automatically
      const { error } = await supabase.from('quiz_attempts').insert({
        session_id: sessionId,
        user_id: user!.id,
        question_id: currentQuestion.id,
        selected_option: selectedAnswer,
        is_correct: isCorrect,
      })
      if (error) throw error

      const newAnswer: AnswerRecord = {
        questionId: currentQuestion.id,
        selectedOption: selectedAnswer,
        isCorrect,
        xpEarned: isCorrect ? currentQuestion.xp_reward : 0,
      }
      const newAnswers = [...answers, newAnswer]
      setAnswers(newAnswers)

      const isLast = currentIndex === questions.length - 1

      if (isLast) {
        // Close the session
        await supabase
          .from('quiz_sessions')
          .update({ finished_at: new Date().toISOString() })
          .eq('id', sessionId)

        // Award unit completion XP + unlock next unit (only once)
        const bonusXp = data?.unit?.xp_reward ?? 0
        const alreadyCompleted = data?.unitProgress?.status === 'completed'
        if (!alreadyCompleted) {
          await supabase.rpc('complete_unit', { p_user_id: user!.id, p_unit_id: unitIdNum })
          setUnitCompletionXp(bonusXp)
        }

        // Refresh profile XP, module & unit caches
        queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
        queryClient.invalidateQueries({ queryKey: ['module', moduleId, user?.id] })
        queryClient.invalidateQueries({ queryKey: ['unit-detail', moduleId, unitIdNum, user?.id] })

        const quizXp = newAnswers.reduce((s, a) => s + a.xpEarned, 0)
        setTotalXpEarned(quizXp + (alreadyCompleted ? 0 : bonusXp))
        setPhase('result')
      } else {
        setCurrentIndex(p => p + 1)
        setSelectedAnswer(null)
        setShowHint(false)
      }
    } catch (err) {
      console.error('QuizKilat submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const retry = () => {
    sessionIdRef.current = null
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowHint(false)
    setAnswers([])
    setPhase('quiz')
    setTotalXpEarned(0)
    setUnitCompletionXp(0)
    queryClient.invalidateQueries({ queryKey: ['quiz-kilat', moduleId, unitIdNum, user?.id] })
  }

  return {
    module: data?.module ?? null,
    unit: data?.unit ?? null,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedAnswer,
    showHint,
    phase,
    isLoading,
    isSubmitting,
    correctCount: answers.filter(a => a.isCorrect).length,
    totalXpEarned,
    unitCompletionXp,
    answers,
    moduleId,
    unitIdNum,
    selectAnswer: (opt: string) => setSelectedAnswer(opt),
    toggleHint: () => setShowHint(p => !p),
    submitAndNext,
    retry,
  }
}