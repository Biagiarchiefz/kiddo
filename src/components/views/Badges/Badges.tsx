import { motion } from 'framer-motion'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useBadges } from './useBadges'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Lock, CheckCircle2, Trophy } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' as const },
  }),
}

const BadgeSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-32 w-full rounded-none" />
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-2 w-full mt-2" />
    </CardContent>
  </Card>
)

const Badges = () => {
  const { badges, earnedCount, isLoading } = useBadges()

  return (
    <AppLayout>
      {/* Header */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate="show"
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-primary">Lencana Saya</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Selesaikan semua unit dalam sebuah modul untuk mendapatkan lencana!
        </p>
        {!isLoading && (
          <div className="inline-flex items-center gap-2 mt-4 bg-amber-50 border border-amber-100 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-sm font-bold text-amber-700">
              {earnedCount} dari {badges.length} lencana diraih
            </span>
          </div>
        )}
      </motion.div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <BadgeSkeleton key={i} />)
          : badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={badge.earned ? { y: -4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } } : {}}
            >
              <Card className={cn(
                'overflow-hidden transition-all duration-300',
                badge.earned
                  ? 'ring-2 ring-amber-300 shadow-[3px_4px_0px_0px_rgba(245,158,11,0.25)]'
                  : 'opacity-60 grayscale'
              )}>
                {/* Badge visual */}
                <div className={cn(
                  'h-32 flex items-center justify-center relative',
                  badge.earned ? badge.headerBg : 'bg-muted'
                )}>
                  <span className={cn('text-5xl drop-shadow', badge.earned ? '' : 'grayscale')}>
                    {badge.emoji}
                  </span>

                  {badge.earned ? (
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-white fill-white" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-2.5 shadow-sm">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 text-center space-y-2">
                  {badge.earned && (
                    <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      ✨ Lencana Diraih!
                    </span>
                  )}

                  <p className={cn(
                    'font-bold text-sm leading-snug',
                    badge.earned ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {badge.title}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>

                  {!badge.earned && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Progres</span>
                        <span className="font-semibold">
                          {badge.completedUnits}/{badge.totalUnits} unit
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/40 rounded-full transition-all duration-700"
                          style={{
                            width: badge.totalUnits > 0
                              ? `${(badge.completedUnits / badge.totalUnits) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        }
      </div>

      {/* Empty state */}
      {!isLoading && badges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground/30" />
          <p className="font-bold text-foreground">Belum ada modul tersedia.</p>
          <p className="text-sm text-muted-foreground">Modul akan segera hadir!</p>
        </div>
      )}
    </AppLayout>
  )
}

export default Badges