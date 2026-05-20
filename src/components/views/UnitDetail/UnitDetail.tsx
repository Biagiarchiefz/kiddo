import { ArrowLeft, BookOpen, CheckCircle2, Circle, Zap, ClipboardList } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUnitDetail } from './useUnitDetail'
import type { SectionBlock } from '@/types/database'

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// ── Content Blocks ────────────────────────────────────────────────────────────

const ParagraphBlock = ({ title, body }: { title: string; body: string }) => (
  <motion.div variants={fadeUp} className="space-y-1.5">
    <h2 className="text-sm font-bold text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </motion.div>
)

const InfoBoxesBlock = ({
  boxes,
}: {
  boxes: Array<{ title: string; icon: string; body: string }>
}) => (
  <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2.5">
    {boxes.map((box, i) => (
      <div
        key={i}
        className={`rounded-xl p-3 space-y-1.5 ${
          i % 2 === 0
            ? 'bg-amber-50 border border-amber-100'
            : 'bg-blue-50 border border-blue-100'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{box.icon}</span>
          <p
            className={`text-[10px] font-bold uppercase tracking-wide leading-none ${
              i % 2 === 0 ? 'text-amber-700' : 'text-blue-700'
            }`}
          >
            {box.title}
          </p>
        </div>
        <p
          className={`text-xs leading-relaxed ${
            i % 2 === 0 ? 'text-amber-800/80' : 'text-blue-800/80'
          }`}
        >
          {box.body}
        </p>
      </div>
    ))}
  </motion.div>
)

// ── Loading Skeleton ──────────────────────────────────────────────────────────

const UnitDetailSkeleton = () => (
  <AppLayout>
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="flex gap-5 items-start">
        <div className="flex-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
        <div className="w-56 shrink-0 space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </AppLayout>
)

// ── Main Component ────────────────────────────────────────────────────────────

const UnitDetail = () => {
  const { module, unit, content, questionCount, progress, isLoading } = useUnitDetail()

  if (isLoading) return <UnitDetailSkeleton />

  if (!module || !unit) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">😕</span>
          <p className="font-bold text-foreground">Unit tidak ditemukan.</p>
          <Button asChild variant="link" size="sm">
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  const correctAnswers = progress?.correct_answers ?? 0
  const readProgress = questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0

  const paragraphTitles = (content?.sections ?? [])
    .filter((s): s is Extract<SectionBlock, { type: 'paragraph' }> => s.type === 'paragraph')
    .map(s => s.title)

  return (
    <AppLayout>
      <div className="space-y-4">

        {/* ── Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' as const }}
          className="bg-linear-to-r from-blue-500 to-sky-400 rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="absolute -top-5 -right-5 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 right-20 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 mb-3 h-7 px-2 gap-1"
          >
            <Link to={`/materi/${module.id}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke {module.title}
            </Link>
          </Button>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="inline-block bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">
                Unit {unit.sort_order}
              </span>
              <h1 className="text-xl font-bold leading-tight">{unit.title}</h1>
              <p className="text-white/75 text-xs leading-relaxed line-clamp-2">{unit.description}</p>
            </div>
            <div className="text-4xl shrink-0 select-none drop-shadow">{module.emoji}</div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-white/70 font-semibold uppercase tracking-wide">
              <span>Progres Belajar</span>
              <span className="text-white">{readProgress}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${readProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.25 }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Two-column body ── */}
        <div className="flex gap-5 items-start">

          {/* ── Article Content ── */}
          <motion.div
            className="flex-1 min-w-0"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <Card className="shadow-sm">
              <CardContent className="p-5 space-y-5">
                {/* Intro */}
                {content?.intro && (
                  <motion.div
                    variants={fadeUp}
                    className="flex items-start gap-2.5 bg-primary/5 border border-primary/10 rounded-xl p-3.5"
                  >
                    <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">{content.intro}</p>
                  </motion.div>
                )}

                {/* Sections */}
                {content?.sections && content.sections.length > 0 ? (
                  content.sections.map((section, i) => {
                    if (section.type === 'paragraph') {
                      return <ParagraphBlock key={i} title={section.title} body={section.body} />
                    }
                    if (section.type === 'info_boxes') {
                      return <InfoBoxesBlock key={i} boxes={section.boxes} />
                    }
                    return null
                  })
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Konten bacaan akan segera tersedia.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Right Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.35, ease: 'easeOut' as const }}
            className="w-56 shrink-0 space-y-3 sticky top-20"
          >
            {/* Daftar Isi */}
            {paragraphTitles.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Daftar Isi</h4>
                  <div className="space-y-1.5">
                    {paragraphTitles.map((title, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {i === 0 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-xs leading-snug ${
                            i === 0
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kuis Kilat */}
            <Card className="shadow-sm border-secondary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-secondary" />
                    <h4 className="text-xs font-bold text-foreground">Kuis Kilat</h4>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    +{unit.xp_reward} XP
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {questionCount} pertanyaan seputar{' '}
                  <span className="font-semibold text-foreground">{unit.title}</span>.
                </p>

                <Button asChild size="sm" className="w-full rounded-xl gap-1.5 text-xs font-semibold h-8">
                  <Link to={`/materi/${module.id}/unit/${unit.id}/kuis`}>
                    <ClipboardList className="w-3.5 h-3.5" />
                    Mulai Kuis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  )
}

export default UnitDetail