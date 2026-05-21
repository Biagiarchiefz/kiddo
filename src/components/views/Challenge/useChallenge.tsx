import { useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: number
  question_id: number
  option_key: string
  text: string
}

export interface ChallengeQuestion {
  id: number
  unit_id: number
  question_type: 'pilihan_ganda' | 'benar_salah' | 'isian_singkat'
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

const CHALLENGE_SIZE = 10

async function fetchChallengeQuestions(): Promise<ChallengeQuestion[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*, question_options(id, question_id, option_key, text)')

  if (error) throw error

  const all = (data ?? []) as ChallengeQuestion[]

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }

  return all.slice(0, CHALLENGE_SIZE).map(q => ({
    ...q,
    question_options: q.question_options.sort((a, b) =>
      a.option_key.localeCompare(b.option_key)
    ),
  }))
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useChallenge = () => {
  useBreadcrumb([{ label: 'Tantangan' }])
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const sessionIdRef = useRef<string | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [phase, setPhase] = useState<'challenge' | 'result'>('challenge')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalXpEarned, setTotalXpEarned] = useState(0)

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['challenge-questions', user?.id],
    queryFn: fetchChallengeQuestions,
    enabled: !!user,
    staleTime: Infinity,
  })

  const currentQuestion = questions[currentIndex]

  const ensureSession = async (): Promise<string> => {
    if (sessionIdRef.current) return sessionIdRef.current
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: user!.id,
        unit_id: null,
        session_type: 'challenge',
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
      const normalize = (s: string) => s.trim().toLowerCase()
      const isCorrect = currentQuestion.question_type === 'isian_singkat'
        ? normalize(selectedAnswer) === normalize(currentQuestion.correct)
        : selectedAnswer === currentQuestion.correct

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
        await supabase
          .from('quiz_sessions')
          .update({ finished_at: new Date().toISOString() })
          .eq('id', sessionId)

        const totalXp = newAnswers.reduce((s, a) => s + a.xpEarned, 0)
        setTotalXpEarned(totalXp)
        queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
        setPhase('result')
      } else {
        setCurrentIndex(p => p + 1)
        setSelectedAnswer(null)
        setShowHint(false)
      }
    } catch (err) {
      console.error('Challenge submit error:', err)
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
    setPhase('challenge')
    setTotalXpEarned(0)
    queryClient.invalidateQueries({ queryKey: ['challenge-questions', user?.id] })
  }

  const topicBreakdown = Object.entries(
    questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.category] = (acc[q.category] ?? 0) + 1
      return acc
    }, {})
  ).map(([topic, count]) => ({ topic, count }))

  return {
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
    topicBreakdown,
    selectAnswer: (opt: string) => setSelectedAnswer(opt),
    toggleHint: () => setShowHint(p => !p),
    submitAndNext,
    retry,
  }
}