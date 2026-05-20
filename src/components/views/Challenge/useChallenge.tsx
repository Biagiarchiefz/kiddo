import { useState } from 'react'

const questions = [
  {
    id: 1,
    question: 'Planet mana yang memiliki cincin terbesar di tata surya?',
    hint: 'Planet ini memiliki cincin yang sangat indah dan dapat terlihat dari Bumi dengan teleskop.',
    options: [
      { id: 'A', text: 'Jupiter' },
      { id: 'B', text: 'Saturnus' },
      { id: 'C', text: 'Mars' },
      { id: 'D', text: 'Uranus' },
    ],
    correct: 'B',
    category: 'Sains',
  },
]

const topicBreakdown = [
  { topic: 'Sains', count: 4 },
  { topic: 'Hewan', count: 3 },
  { topic: 'Matematika', count: 3 },
]

const TOTAL_QUESTIONS = 10

export const useChallenge = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)

  const question = questions[Math.min(currentIndex, questions.length - 1)]

  const selectAnswer = (id: string) => setSelectedAnswer(id)

  const toggleHint = () => setShowHint(prev => !prev)

  const goNext = () => {
    setSelectedAnswer(null)
    setShowHint(false)
    setCurrentIndex(prev => Math.min(prev + 1, TOTAL_QUESTIONS - 1))
  }

  const goPrev = () => {
    setSelectedAnswer(null)
    setShowHint(false)
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  return {
    question,
    currentIndex,
    totalQuestions: TOTAL_QUESTIONS,
    selectedAnswer,
    showHint,
    topicBreakdown,
    selectAnswer,
    toggleHint,
    goNext,
    goPrev,
  }
}
