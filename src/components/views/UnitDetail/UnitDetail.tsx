import { ArrowLeft, BookOpen, Zap, ClipboardList } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUnitDetail } from './useUnitDetail'

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// ── Heading parser ────────────────────────────────────────────────────────────

function parseHeadings(md: string) {
  return md
    .split('\n')
    .filter(l => /^#{1,3} /.test(l))
    .map(l => ({
      level: (l.match(/^#+/)?.[0].length ?? 1),
      text: l.replace(/^#+\s*/, ''),
    }))
}

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
  const { module, unit, questionCount, progress, isLoading } = useUnitDetail()

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

  const markdownContent = unit.markdown_content ?? ''
  const headings = parseHeadings(markdownContent)

  return (
    <AppLayout>
      <div className="space-y-4">


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
              <CardContent className="p-5">
                {markdownContent.trim() ? (
                  <motion.div variants={fadeUp} className="
                    prose prose-sm max-w-none
                    prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-5 prose-headings:mb-2 prose-headings:first:mt-0
                    prose-h1:text-xl prose-h2:text-base prose-h3:text-sm
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-2
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-em:text-muted-foreground
                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:text-foreground
                    prose-pre:bg-muted prose-pre:rounded-xl prose-pre:p-4
                    prose-ul:text-muted-foreground prose-ul:my-2 prose-li:my-0.5
                    prose-ol:text-muted-foreground prose-ol:my-2
                    prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                    prose-hr:border-border prose-hr:my-4
                    prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
                  </motion.div>
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
            {headings.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Daftar Isi</h4>
                  <div className="space-y-1.5">
                    {headings.map((h, i) => (
                      <div key={i} className="flex items-start gap-2" style={{ paddingLeft: `${(h.level - 1) * 10}px` }}>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" />
                        <span className={`text-xs leading-snug ${h.level === 1 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                          {h.text}
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