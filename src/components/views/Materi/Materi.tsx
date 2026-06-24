import { ArrowLeft, BookOpen, Star, Check, Lock, RotateCcw, ArrowRight, AlertCircle, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMateri } from './useMateri'
import type { UnitWithProgress } from './useMateri'

// ── Hero decorations ─────────────────────────────────────────────────────────


const HeroCloud = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 260 100" fill="white" className={className}>
    <ellipse cx="130" cy="74" rx="108" ry="26" />
    <ellipse cx="88"  cy="58" rx="48"  ry="36" />
    <ellipse cx="140" cy="48" rx="58"  ry="42" />
    <ellipse cx="192" cy="62" rx="40"  ry="28" />
  </svg>
)

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const popIn = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 320, damping: 22 } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

// ── Unit Card ─────────────────────────────────────────────────────────────────

interface UnitCardProps {
  unit: UnitWithProgress
  index: number
}

const UnitCard = ({ unit, index }: UnitCardProps) => {
  const isLeft       = index % 2 === 0
  const isCompleted  = unit.status === 'completed'
  const isInProgress = unit.status === 'in_progress'
  const isLocked     = unit.status === 'locked'

  return (
    <motion.div variants={isLeft ? slideLeft : slideRight} className="w-full">
      <div className={cn(
        'rounded-xl bg-white border transition-all duration-200 hover:-translate-y-0.5',
        isCompleted  && 'border-emerald-100 shadow-[0_2px_16px_rgba(16,185,129,0.09)]',
        isInProgress && 'border-sky-200 shadow-[0_2px_16px_rgba(14,165,233,0.13)]',
        isLocked     && 'border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] opacity-55',
      )}>
        <div className="p-5 3xl:p-8 space-y-4">

          {/* Top row: unit number + status chip */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Unit {String(unit.sort_order).padStart(2, '0')}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                <Check className="w-2.5 h-2.5" /> Selesai
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md">
                Sedang Berjalan
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                <Lock className="w-2.5 h-2.5" /> Terkunci
              </span>
            )}
          </div>

          {/* Title + description */}
          <div className="space-y-1.5">
            <h3 className={cn(
              'font-semibold text-[15px] 3xl:text-lg leading-snug',
              isLocked ? 'text-slate-400' : 'text-slate-800'
            )}>
              {unit.title}
            </h3>
            <p className="text-[13px] 3xl:text-base text-slate-400 leading-relaxed">{unit.description}</p>
          </div>

          {/* Unlock notice */}
          {isLocked && unit.unlockRequirement && (
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-100 p-3">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">{unit.unlockRequirement}</p>
            </div>
          )}

          {/* Footer: XP + action */}
          {!isLocked && (
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                +XP Hadiah
              </span>

              {isCompleted ? (
                <div className="flex gap-1.5">
                  <Button asChild variant="ghost" size="sm"
                    className="h-8 px-3 text-xs gap-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                    <Link to={`/materi/${unit.module_id}/unit/${unit.id}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      Baca
                    </Link>
                  </Button>
                  <Button asChild size="sm"
                    className="h-8 px-3 text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                    <Link to={`/materi/${unit.module_id}/unit/${unit.id}/kuis`}>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Ulangi Kuis
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm"
                  className="h-8 px-4 text-xs gap-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold">
                  <Link to={`/materi/${unit.module_id}/unit/${unit.id}`}>
                    Mulai Belajar
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Track dot ─────────────────────────────────────────────────────────────────

const TrackDot = ({ status }: { status: UnitWithProgress['status'] }) => (
  <motion.div variants={popIn} className="relative flex items-center justify-center mx-auto z-10">
    {status === 'in_progress' && (
      <div className="absolute w-10 h-10 rounded-full bg-sky-400/20 animate-ping" />
    )}
    <div className={cn(
      'w-6 h-6 rounded-full flex items-center justify-center shadow-sm border-2 relative',
      status === 'completed'  && 'bg-emerald-500 border-emerald-400 shadow-emerald-100',
      status === 'in_progress'&& 'bg-sky-500 border-sky-400 shadow-sky-100',
      status === 'locked'     && 'bg-white border-slate-200',
    )}>
      {status === 'completed'   && <Check className="w-3 h-3 text-white" />}
      {status === 'in_progress' && <ArrowRight className="w-3 h-3 text-white" />}
      {status === 'locked'      && <Lock className="w-2.5 h-2.5 text-slate-300" />}
    </div>
  </motion.div>
)

// ── Loading Skeleton ───────────────────────────────────────────────────────────

const MateriSkeleton = () => (
  <AppLayout>
    <div className="space-y-8">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
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
          <p className="font-semibold text-slate-700">Modul tidak ditemukan.</p>
          <Link to="/dashboard" className="text-sm text-sky-500 hover:text-sky-600">
            Kembali ke Dashboard
          </Link>
        </div>
      </AppLayout>
    )
  }

  const completedCount = units.filter(u => u.status === 'completed').length

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* ── Hero Banner ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="bg-sky-600 rounded-xl p-5 text-white relative overflow-hidden">

            {/* Rings — top right */}
            <div className="absolute -top-10 -right-10 pointer-events-none">
              <div className="w-36 h-36 rounded-full border-[8px] border-white/20" />
              <div className="absolute top-5 left-5 w-24 h-24 rounded-full border-[6px] border-white/15" />
              <div className="absolute top-10 left-10 w-14 h-14 rounded-full border-[4px] border-white/25" />
            </div>

            {/* Cloud — bottom left */}
            <HeroCloud className="absolute -bottom-4 -left-4 w-48 pointer-events-none opacity-30" />

            {/* Cloud — bottom right, smaller */}
            <HeroCloud className="absolute -bottom-2 right-10 w-32 pointer-events-none opacity-20" />

            {/* Amber sparkle stars */}
            <svg className="absolute top-4 left-[36%] w-4 h-4 pointer-events-none opacity-60" fill="#FCD34D" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute bottom-7 left-[22%] w-3 h-3 pointer-events-none opacity-50" fill="#FCD34D" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute top-6 right-[32%] w-2.5 h-2.5 pointer-events-none opacity-40" fill="white" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute top-2 left-[55%] w-2 h-2 pointer-events-none opacity-35" fill="#FCD34D" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>

            <Button
              asChild variant="ghost" size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 -ml-1.5 mb-4 h-7 px-2 gap-1 text-xs"
            >
              <Link to="/dashboard">
                <ArrowLeft className="w-3.5 h-3.5" />
                Semua Modul
              </Link>
            </Button>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-sky-200 text-[11px] font-semibold uppercase tracking-widest mb-1">
                    Modul Belajar
                  </p>
                  <h1 className="text-xl 3xl:text-3xl font-bold leading-snug">{module.title}</h1>
                  <p className="text-sky-200/80 text-xs 3xl:text-sm leading-relaxed mt-1.5 max-w-sm 3xl:max-w-xl">
                    {module.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-100 bg-white/10 px-2.5 py-1 rounded-md">
                    <BookOpen className="w-3 h-3" />
                    {units.length} unit
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-100 bg-white/10 px-2.5 py-1 rounded-md">
                    <Star className="w-3 h-3 fill-sky-200 text-sky-200" />
                    {totalXp} XP total
                  </span>
                  {completedCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-200 bg-emerald-500/20 px-2.5 py-1 rounded-md">
                      <Check className="w-3 h-3" />
                      {completedCount}/{units.length} selesai
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Unit List ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative">

          {/* Dashed track line */}
          <div
            className="absolute left-4 top-0 bottom-0 pointer-events-none md:left-1/2 md:-translate-x-1/2"
            style={{
              width: '1.5px',
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 5px, oklch(0.62 0.19 211 / 0.25) 5px, oklch(0.62 0.19 211 / 0.25) 10px)',
            }}
          />

          <div className="space-y-0">
            {units.map((unit, index) => {
              const isLeft = index % 2 === 0
              return (
                <div key={unit.id}>
                  <div className="grid grid-cols-[32px_1fr] items-start gap-0 md:grid-cols-[1fr_48px_1fr] 3xl:grid-cols-[1fr_64px_1fr] md:items-center">

                    {/* Left slot — desktop only */}
                    <div className="hidden md:block pr-5">
                      {isLeft && <UnitCard unit={unit} index={index} />}
                    </div>

                    {/* Track dot */}
                    <div className="flex justify-center">
                      <TrackDot status={unit.status} />
                    </div>

                    {/* Right slot */}
                    <div className="pl-3 pb-5 md:pl-5 md:pb-0">
                      <div className="md:hidden">
                        <UnitCard unit={unit} index={index} />
                      </div>
                      {!isLeft && (
                        <div className="hidden md:block">
                          <UnitCard unit={unit} index={index} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gap between units */}
                  {index < units.length - 1 && (
                    <div className="h-5 md:h-6" />
                  )}
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