import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useChallenge } from './useChallenge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const topicColors = ['bg-blue-400', 'bg-rose-400', 'bg-amber-400']

const Challenge = () => {
  const {
    question,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    showHint,
    topicBreakdown,
    selectAnswer,
    toggleHint,
    goNext,
    goPrev,
  } = useChallenge()

  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <AppLayout>
      <div className="flex gap-6 items-start">

        {/* ── Main area ── */}
        <div className="flex-1 space-y-5">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="flex items-start justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-foreground">Tantangan Campuran</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Uji pengetahuanmu dari semua materi dan dapatkan Extra XP!
              </p>
            </div>
            <span className="bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
              {question?.category ?? 'Sains'}
            </span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Challenge {currentIndex + 1} of {totalQuestions}</span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' as const }}
              />
            </div>
          </motion.div>

          {/* Question card — slides on change */}
          <AnimatePresence mode="wait">
            {question && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: 'easeOut' as const }}
              >
                <Card className="border border-border shadow-sm">
                  <CardContent className="p-6 space-y-5">
                    <p className="text-base font-semibold text-foreground leading-relaxed">
                      {question.question}
                    </p>

                    {/* Hint toggle */}
                    <Button
                      variant={showHint ? 'outline' : 'ghost'}
                      size="sm"
                      onClick={toggleHint}
                      className={cn(
                        'gap-2 text-xs font-medium h-8',
                        showHint
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-700'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Lightbulb className={cn('w-3.5 h-3.5', showHint ? 'fill-amber-400 text-amber-400' : '')} />
                      {showHint ? 'Sembunyikan hint' : 'Klik untuk Balik — Lihat Hint'}
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
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
                            💡 {question.hint}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Answer options */}
                    <div className="grid grid-cols-2 gap-3">
                      {question.options.map(opt => {
                        const isSelected = selectedAnswer === opt.id
                        return (
                          <motion.button
                            key={opt.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => selectAnswer(opt.id)}
                            className={cn(
                              'flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200',
                              isSelected
                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-border hover:border-primary/40 hover:bg-muted/30 text-foreground'
                            )}
                          >
                            <span className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors',
                              isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            )}>
                              {opt.id}
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

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex-1 rounded-xl gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Pertanyaan
            </Button>
            <Button
              onClick={goNext}
              disabled={!selectedAnswer}
              className="flex-1 rounded-xl gap-2"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Info Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
          className="w-56 shrink-0 space-y-4"
        >
          {/* XP reward */}
          <Card className="bg-linear-to-br from-amber-50 to-yellow-50 border-amber-100 shadow-sm">
            <CardContent className="p-5 text-center space-y-2">
              <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">Hadiah XP</p>
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-3xl font-black text-amber-600">+250</span>
              </div>
              <p className="text-xs text-amber-700/70 leading-relaxed">
                Semakin banyak benar, semakin besar hadiahnya!
              </p>
            </CardContent>
          </Card>

          {/* Topic breakdown */}
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h4 className="text-sm font-bold text-foreground">Topik Sesi Ini</h4>
              {topicBreakdown.map((t, i) => (
                <div key={t.topic} className="flex items-center gap-2.5">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', topicColors[i % topicColors.length])} />
                  <span className="text-sm text-muted-foreground flex-1">{t.topic}</span>
                  <span className="text-xs font-semibold bg-muted text-foreground px-2 py-0.5 rounded-full">
                    {t.count} soal
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </AppLayout>
  )
}

export default Challenge