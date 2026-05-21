import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useLeaderboard } from './useLeaderboard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Podium config ─────────────────────────────────────────────────────────────

const podiumConfig: Record<number, { height: string; bg: string; labelColor: string; order: number }> = {
  1: { height: 'h-24', bg: 'bg-secondary',  labelColor: 'text-white',      order: 2 },
  2: { height: 'h-16', bg: 'bg-slate-300',  labelColor: 'text-slate-600',  order: 1 },
  3: { height: 'h-12', bg: 'bg-amber-200',  labelColor: 'text-amber-700',  order: 3 },
}

const avatarSizeByRank: Record<number, string> = {
  1: 'w-16 h-16',
  2: 'w-14 h-14',
  3: 'w-12 h-12',
}

// ── Rank Row ─────────────────────────────────────────────────────────────────

interface RankRowProps { entry: import('./useLeaderboard').RankEntry; idx: number; showBorder: boolean }

const RankRow = ({ entry, idx, showBorder }: RankRowProps) => (
  <motion.div
    key={entry.id}
    custom={idx + 2}
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className={cn(
      'flex items-center gap-3 px-5 py-3.5 transition-colors',
      showBorder ? 'border-b border-border' : '',
      entry.isCurrentUser
        ? 'bg-primary/5 border-l-[3px] border-l-primary'
        : 'hover:bg-muted/30'
    )}
  >
    <span className={cn(
      'w-6 text-center text-sm font-bold shrink-0',
      entry.rank === 1 ? 'text-secondary' :
      entry.rank === 2 ? 'text-slate-400' :
      entry.rank === 3 ? 'text-amber-500' :
      entry.isCurrentUser ? 'text-primary' : 'text-muted-foreground'
    )}>
      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
    </span>

    <Avatar className="w-9 h-9 shrink-0">
      <AvatarFallback className={cn(
        entry.isCurrentUser ? 'bg-primary text-white' : (entry.bg ?? 'bg-muted'),
        entry.isCurrentUser ? '' : (entry.text ?? 'text-foreground'),
        'font-bold text-sm'
      )}>
        {entry.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className={cn('text-sm font-semibold truncate', entry.isCurrentUser ? 'text-primary' : 'text-foreground')}>
          {entry.name}
        </p>
        {entry.isCurrentUser && (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
            KAMU
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground truncate">{entry.school}</p>
    </div>

    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
      Lv.{entry.level}
    </span>

    <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full shrink-0">
      <Zap className="w-3 h-3 fill-primary" />
      <span className="text-xs font-bold">{entry.xp.toLocaleString()}</span>
    </div>
  </motion.div>
)

// ── Fade-up variant ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

const LeaderboardSkeleton = () => (
  <AppLayout>
    <div className="text-center mb-8 space-y-2">
      <Skeleton className="h-9 w-48 mx-auto rounded-xl" />
      <Skeleton className="h-4 w-72 mx-auto rounded" />
    </div>
    <div className="flex gap-6 items-end">
      <div className="w-72 shrink-0 flex items-end justify-center gap-3 pb-1">
        {[2, 1, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-14 h-14 rounded-full" />
            <Skeleton className={cn('w-20 rounded-t-xl', i === 1 ? 'h-24' : i === 2 ? 'h-16' : 'h-12')} />
          </div>
        ))}
      </div>
      <Card className="flex-1 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-muted/50 border-b border-border">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <CardContent className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
              <Skeleton className="w-6 h-5 rounded" />
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </AppLayout>
)

// ── Main Component ────────────────────────────────────────────────────────────

const Leaderboard = () => {
  const { rankings, currentUserEntry, isLoading } = useLeaderboard()

  if (isLoading) return <LeaderboardSkeleton />

  if (rankings.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground/30" />
          <p className="font-bold text-foreground">Belum ada data peringkat.</p>
          <p className="text-sm text-muted-foreground">Selesaikan kuis untuk masuk papan peringkat!</p>
        </div>
      </AppLayout>
    )
  }

  const top3 = rankings
    .filter(r => r.rank <= 3)
    .sort((a, b) => podiumConfig[a.rank].order - podiumConfig[b.rank].order)

  return (
    <AppLayout>

      {/* Title */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-primary">Papan Peringkat</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Lihat pencapaian para pelajar terbaik! Selesaikan kuis untuk naik peringkat.
        </p>
      </motion.div>

      <div className="flex gap-6 items-start">

        {/* ── Podium ── */}
        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="w-72 shrink-0"
        >
          {/* Podium avatars */}
          <div className="flex items-end justify-center gap-3 pb-1">
            {top3.map(entry => {
              const cfg = podiumConfig[entry.rank]
              const isFirst = entry.rank === 1
              const avatarSize = avatarSizeByRank[entry.rank]
              return (
                <motion.div
                  key={entry.rank}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  {isFirst && <span className="text-2xl mb-1 leading-none">👑</span>}

                  <Avatar className={cn(avatarSize, 'ring-2 ring-white shadow-md')}>
                    <AvatarFallback className={cn(
                      entry.isCurrentUser ? 'bg-primary text-white' : cfg.bg,
                      'font-bold text-base'
                    )}>
                      {entry.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn(
                    cfg.height, cfg.bg,
                    'w-20 rounded-t-xl flex items-center justify-center mt-2 shadow-sm'
                  )}>
                    <span className={cn('font-black text-xl', cfg.labelColor)}>
                      {entry.rank}
                    </span>
                  </div>

                  <div className="text-center mt-2 w-20">
                    <p className="font-bold text-xs text-foreground truncate">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                      {entry.xp.toLocaleString()} XP
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Current user summary (if not in top 3) */}
          {currentUserEntry && currentUserEntry.rank > 3 && (
            <motion.div
              custom={2} variants={fadeUp} initial="hidden" animate="show"
              className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-1"
            >
              <p className="text-[10px] text-primary font-bold uppercase tracking-wide">Posisimu</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary text-white font-bold text-sm">
                    {currentUserEntry.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{currentUserEntry.name}</p>
                  <p className="text-xs text-muted-foreground">Peringkat #{currentUserEntry.rank}</p>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="w-3.5 h-3.5 fill-primary" />
                  <span className="text-sm font-black">{currentUserEntry.xp.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Rankings list ── */}
        <Card className="flex-1 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">Pelajar</span>
            <span>Level</span>
            <span>XP</span>
          </div>

          <CardContent className="p-0">
            {rankings.map((entry, idx) => (
              <RankRow key={entry.id} entry={entry} idx={idx} showBorder={idx < rankings.length - 1 || !!currentUserEntry} />
            ))}

            {/* Current user row — shown only when outside top 5 */}
            {currentUserEntry && (
              <>
                <RankRow entry={currentUserEntry} idx={rankings.length} showBorder={false} />
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}

export default Leaderboard