import { ArrowLeft, Lightbulb, ChevronRight, Zap, Trophy, RotateCcw, BookOpen, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useQuizKilat } from './useQuizKilat'

// ── Loading skeleton ──────────────────────────────────────────────────────────

const QuizSkeleton = () => (
  <AppLayout>
    <div className="space-y-4">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex gap-5 items-start">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="w-52 h-48 rounded-2xl shrink-0" />
      </div>
    </div>
  </AppLayout>
)

// ── Result screen ─────────────────────────────────────────────────────────────

interface ResultProps {
  correctCount: number
  totalQuestions: number
  totalXpEarned: number
  unitCompletionXp: number
  moduleId: number
  unitIdNum: number
  moduleName: string
  retry: () => void
}

const QuizResult = ({
  correctCount,
  totalQuestions,
  totalXpEarned,
  unitCompletionXp,
  moduleId,
  unitIdNum,
  moduleName,
  retry,
}: ResultProps) => {
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '😊' : '💪'
  const headline = pct >= 80 ? 'Luar Biasa!' : pct >= 60 ? 'Bagus!' : 'Terus Semangat!'
  const quizOnlyXp = totalXpEarned - unitCompletionXp

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' as const }}
        className="max-w-xl mx-auto space-y-4 py-6"
      >
        {/* Score card */}
        <Card className="shadow-sm overflow-hidden">
          <div className="bg-linear-to-r from-blue-500 to-sky-400 p-6 text-center text-white">
            <div className="text-5xl mb-2 drop-shadow">{emoji}</div>
            <h2 className="text-2xl font-bold">{headline}</h2>
            <p className="text-white/75 text-sm mt-1">
              Kamu menjawab <span className="font-bold text-white">{correctCount}</span> dari{' '}
              <span className="font-bold text-white">{totalQuestions}</span> soal dengan benar
            </p>
          </div>

          <CardContent className="p-5 space-y-4">
            {/* Score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Skor</span>
                <span className="font-bold text-foreground">{pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', pct >= 60 ? 'bg-green-500' : 'bg-amber-400')}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.2 }}
                />
              </div>
            </div>

            {/* XP breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-center">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1" />
                <p className="text-xs text-amber-700 font-semibold mb-0.5">XP Kuis</p>
                <p className="text-2xl font-black text-amber-600">+{quizOnlyXp}</p>
              </div>
              {unitCompletionXp > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 text-center">
                  <Trophy className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-green-700 font-semibold mb-0.5">Bonus Selesai</p>
                  <p className="text-2xl font-black text-green-600">+{unitCompletionXp}</p>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-bold text-primary">Total +{totalXpEarned} XP diperoleh!</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl" onClick={retry}>
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi Kuis
              </Button>
              <Button asChild size="sm" className="flex-1 gap-2 rounded-xl">
                <Link to={`/materi/${moduleId}/unit/${unitIdNum}`}>
                  <BookOpen className="w-3.5 h-3.5" />
                  Kembali ke Materi
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const QuizKilat = () => {
  const {
    module, unit, currentQuestion, currentIndex, totalQuestions,
    selectedAnswer, showHint, phase, isLoading, isSubmitting,
    correctCount, totalXpEarned, unitCompletionXp, moduleId, unitIdNum,
    selectAnswer, toggleHint, submitAndNext, retry,
  } = useQuizKilat()

  if (isLoading) return <QuizSkeleton />

  if (!module || !unit || totalQuestions === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">📭</span>
          <p className="font-bold text-foreground">Belum ada soal untuk unit ini.</p>
          <Button asChild variant="link" size="sm">
            <Link to={`/materi/${moduleId}/unit/${unitIdNum}`}>Kembali ke Materi</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (phase === 'result') {
    return (
      <QuizResult
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        totalXpEarned={totalXpEarned}
        unitCompletionXp={unitCompletionXp}
        moduleId={moduleId}
        unitIdNum={unitIdNum}
        moduleName={module.title}
        retry={retry}
      />
    )
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <AppLayout>
      <div className="space-y-4">

        {/* ── Top bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className="flex items-center justify-between"
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 h-8"
          >
            <Link to={`/materi/${moduleId}/unit/${unitIdNum}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              {unit.title}
            </Link>
          </Button>

          <span className="text-xs font-semibold text-muted-foreground">
            Soal {currentIndex + 1} / {totalQuestions}
          </span>
        </motion.div>

        {/* ── Progress bar ── */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
          />
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-5 items-start">

          {/* ── Question area ── */}
          <div className="flex-1 min-w-0 space-y-3">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: 'easeOut' as const }}
                >
                  <Card className="shadow-sm">
                    <CardContent className="p-5 space-y-4">
                      {/* Category badge */}
                      <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {currentQuestion.category}
                      </span>

                      {/* Question text */}
                      <p className="text-base font-semibold text-foreground leading-relaxed">
                        {currentQuestion.question}
                      </p>

                      {/* Hint toggle */}
                      {currentQuestion.hint && (
                        <>
                          <Button
                            variant={showHint ? 'outline' : 'ghost'}
                            size="sm"
                            onClick={toggleHint}
                            className={cn(
                              'gap-2 h-8 text-xs',
                              showHint
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-700'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <Lightbulb className={cn('w-3.5 h-3.5', showHint && 'fill-amber-400 text-amber-400')} />
                            {showHint ? 'Sembunyikan hint' : 'Lihat Hint'}
                          </Button>

                          <AnimatePresence>
                            {showHint && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
                                  💡 {currentQuestion.hint}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Answer options */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {currentQuestion.question_options.map(opt => {
                          const isSelected = selectedAnswer === opt.option_key
                          return (
                            <motion.button
                              key={opt.option_key}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => selectAnswer(opt.option_key)}
                              className={cn(
                                'flex items-center gap-3 p-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all duration-150',
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30 text-foreground'
                              )}
                            >
                              <span className={cn(
                                'w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors',
                                isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                              )}>
                                {opt.option_key}
                              </span>
                              {opt.text}
                            </motion.button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <Button
              className="w-full rounded-xl gap-2"
              onClick={submitAndNext}
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : currentIndex === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' as const }}
            className="w-52 shrink-0 space-y-3 sticky top-20"
          >
            {/* XP reward */}
            <Card className="bg-linear-to-br from-amber-50 to-yellow-50 border-amber-100 shadow-sm">
              <CardContent className="p-4 text-center space-y-1.5">
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Hadiah XP</p>
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-2xl font-black text-amber-600">+{unit.xp_reward}</span>
                </div>
                <p className="text-[10px] text-amber-700/70 leading-relaxed">
                  Bonus XP setelah menyelesaikan unit ini!
                </p>
              </CardContent>
            </Card>

            {/* Answer tracker */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">Progres Soal</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: totalQuestions }).map((_, i) => {
                    const isDone = i < currentIndex
                    const isCurrent = i === currentIndex
                    return (
                      <div
                        key={i}
                        className={cn(
                          'h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors',
                          isDone ? 'bg-green-100 text-green-700' :
                          isCurrent ? 'bg-primary text-white' :
                          'bg-muted text-muted-foreground'
                        )}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold">{currentIndex} selesai</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{totalQuestions - currentIndex} tersisa</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}

export default QuizKilat