import { ArrowLeft, BookOpen, Star, Check, Lock, RotateCcw, ArrowRight, AlertCircle, Globe } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMateri } from './useMateri'
import type { UnitWithProgress } from './useMateri'

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const popIn = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 18 } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
}

// ── Unit Card ─────────────────────────────────────────────────────────────────

interface UnitCardProps {
  unit: UnitWithProgress
  index: number
}

const UnitCard = ({ unit, index }: UnitCardProps) => {
  const isLeft = index % 2 === 0
  const isCompleted = unit.status === 'completed'
  const isLocked = unit.status === 'locked'

  return (
    <motion.div variants={isLeft ? slideLeft : slideRight} className="w-full">
      <Card
        className={`border-2 transition-shadow duration-300 hover:shadow-md ${
          isCompleted
            ? 'border-green-200 bg-green-50/40'
            : 'border-border bg-background opacity-85'
        }`}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              UNIT {unit.sort_order}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500' : 'bg-muted'
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Lock className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Content */}
          <h3 className="font-bold text-sm text-foreground mb-1">{unit.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {unit.description}
          </p>

          {/* Unlock notice */}
          {isLocked && unit.unlockRequirement && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-2.5 mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-red-600 mb-0.5">
                  Kerjakan Kuis untuk Membuka
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{unit.unlockRequirement}</p>
              </div>
            </div>
          )}

          {/* Action */}
          {isCompleted ? (
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl gap-1.5 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 h-8 text-xs"
              >
                <Link to={`/materi/${unit.module_id}/unit/${unit.id}`}>
                  <BookOpen className="w-3 h-3" />
                  Lihat Materi
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="flex-1 rounded-xl gap-1.5 bg-green-500 hover:bg-green-600 text-white h-8 text-xs"
              >
                <Link to={`/materi/${unit.module_id}/unit/${unit.id}/kuis`}>
                  <RotateCcw className="w-3 h-3" />
                  Ulangi Kuis
                </Link>
              </Button>
            </div>
          ) : !isLocked ? (
            <Button asChild size="sm" className="w-full rounded-xl gap-1.5 h-8 text-xs">
              <Link to={`/materi/${unit.module_id}/unit/${unit.id}`}>
                Mulai Belajar
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Connector ─────────────────────────────────────────────────────────────────

const Connector = () => (
  <div className="flex flex-col items-center py-1 shrink-0">
    <div className="w-px h-6 bg-border" />
    <motion.div
      variants={popIn}
      className="w-11 h-11 rounded-full bg-secondary shadow-md flex items-center justify-center my-1"
    >
      <Globe className="w-5 h-5 text-white" />
    </motion.div>
    <div className="w-px h-6 bg-border" />
  </div>
)

// ── Loading Skeleton ───────────────────────────────────────────────────────────

const MateriSkeleton = () => (
  <AppLayout>
    <div className="space-y-8">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  </AppLayout>
)

// ── Main Component ─────────────────────────────────────────────────────────────

const Materi = () => {
  const { module, units, totalXp, isLoading } = useMateri()

  if (isLoading) return <MateriSkeleton />

  if (!module) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">😕</span>
          <p className="font-bold text-foreground">Modul tidak ditemukan.</p>
          <Link to="/dashboard" className="text-sm text-primary hover:underline">
            Kembali ke Dashboard
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* ── Hero Banner ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-linear-to-r from-blue-500 to-sky-400 rounded-2xl p-5 text-white overflow-hidden relative"
        >
          <div className="absolute -top-5 -right-5 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 right-16 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 mb-3 h-7 px-2 gap-1"
          >
            <Link to="/dashboard">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Modul
            </Link>
          </Button>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1">{module.title}</h1>
              <p className="text-white/80 text-xs leading-relaxed mb-3.5">
                {module.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <BookOpen className="w-3 h-3" />
                  {units.length} Unit Belajar
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-white" />
                  {totalXp} XP Total
                </span>
              </div>
            </div>
            <div className="w-20 h-20 shrink-0 flex items-center justify-center text-5xl select-none drop-shadow-lg">
              {module.emoji}
            </div>
          </div>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 pointer-events-none" />

          <div className="space-y-0">
            {units.map((unit, index) => {
              const isLeft = index % 2 === 0
              return (
                <div key={unit.id}>
                  {/* Unit row — card on alternating side */}
                  <div className="grid grid-cols-[1fr_56px_1fr] items-center gap-0">
                    {/* Left slot */}
                    <div className="pr-4">
                      {isLeft && <UnitCard unit={unit} index={index} />}
                    </div>

                    {/* Center dot on the line */}
                    <motion.div
                      variants={popIn}
                      className={`flex items-center justify-center w-7 h-7 rounded-full border-2 mx-auto z-10 relative ${
                        unit.status === 'completed'
                          ? 'bg-green-500 border-green-500'
                          : 'bg-background border-border'
                      }`}
                    >
                      {unit.status === 'completed' ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </motion.div>

                    {/* Right slot */}
                    <div className="pl-4">
                      {!isLeft && <UnitCard unit={unit} index={index} />}
                    </div>
                  </div>

                  {/* Connector between units */}
                  {index < units.length - 1 && <Connector />}
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </AppLayout>
  )
}

export default Materi
