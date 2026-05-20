import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useLeaderboard } from './useLeaderboard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const podiumConfig: Record<number, { height: string; bg: string; avatarSize: string; order: number }> = {
  1: { height: 'h-24', bg: 'bg-secondary',  avatarSize: 'w-16 h-16', order: 2 },
  2: { height: 'h-16', bg: 'bg-slate-300',  avatarSize: 'w-14 h-14', order: 1 },
  3: { height: 'h-12', bg: 'bg-slate-200',  avatarSize: 'w-12 h-12', order: 3 },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' as const },
  }),
}

const Leaderboard = () => {
  const { rankings } = useLeaderboard()

  const top3 = rankings
    .filter(r => r.rank <= 3)
    .sort((a, b) => podiumConfig[a.rank].order - podiumConfig[b.rank].order)

  const rest = rankings.filter(r => r.rank > 3)

  return (
    <AppLayout>

      {/* Title */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-primary">Top Explorers</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Lihat pencapaian para pelajar muda terbaik! Terus selesaikan tantangan untuk naik peringkat.
        </p>
      </motion.div>

      {/* Podium + Rankings */}
      <div className="flex gap-6 items-end">

        {/* ── Podium ── */}
        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="w-72 shrink-0 flex items-end justify-center gap-3 pb-1"
        >
          {top3.map(entry => {
            const cfg = podiumConfig[entry.rank]
            const isFirst = entry.rank === 1
            return (
              <motion.div
                key={entry.rank}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                {isFirst && <span className="text-2xl mb-1 leading-none">👑</span>}

                <Avatar className={cn(cfg.avatarSize, 'ring-2 ring-white shadow-md')}>
                  <AvatarFallback className={cn(
                    cfg.bg,
                    isFirst ? 'text-white' : 'text-slate-700',
                    'font-bold text-base'
                  )}>
                    {entry.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  cfg.height, cfg.bg,
                  'w-20 rounded-t-xl flex items-center justify-center mt-2 shadow-sm'
                )}>
                  <span className={cn('font-black text-xl', isFirst ? 'text-white' : 'text-slate-500')}>
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
        </motion.div>

        {/* ── Rankings list ── */}
        <Card className="flex-1 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">Explorer</span>
            <span>Poin</span>
          </div>

          <CardContent className="p-0">
            {rest.map((entry, idx) => (
              <motion.div
                key={entry.rank}
                custom={idx + 2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className={cn(
                  'flex items-center gap-3 px-5 py-3.5 transition-colors',
                  idx < rest.length - 1 ? 'border-b border-border' : '',
                  entry.isCurrentUser
                    ? 'bg-primary/5 border-l-[3px] border-l-primary'
                    : 'hover:bg-muted/30'
                )}
              >
                <span className={cn(
                  'w-6 text-center text-sm font-bold shrink-0',
                  entry.isCurrentUser ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {entry.rank}
                </span>

                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className={cn(entry.avatarBg, entry.avatarText, 'font-bold text-sm')}>
                    {entry.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      'text-sm font-semibold truncate',
                      entry.isCurrentUser ? 'text-primary' : 'text-foreground'
                    )}>
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

                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full shrink-0">
                  <Zap className="w-3 h-3 fill-primary" />
                  <span className="text-xs font-bold">{entry.xp.toLocaleString()} XP</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}

export default Leaderboard