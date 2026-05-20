import { motion } from 'framer-motion'
import { Link } from 'react-router'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const ModuleCardSkeleton = () => (
  <Card className="rounded-2xl border border-border overflow-hidden shadow-sm">
    <Skeleton className="h-36 w-full rounded-none" />
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-2 w-full mt-1" />
    </CardContent>
  </Card>
)

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
}

const Dashboard = () => {
  const { modules, isLoading } = useDashboard()

  return (
    <AppLayout>
      <div className="space-y-5">

        {/* Hero Banner */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Card className="bg-linear-to-r from-primary to-blue-400 border-0 overflow-hidden shadow-md">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="absolute -top-5 -right-4 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-24 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />

              <div className="space-y-2 flex-1 relative z-10">
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                  Selamat Datang Kembali!
                </p>
                <h2 className="text-xl font-bold text-white leading-snug">
                  Let's Learn Something New Today!
                </h2>
                <p className="text-blue-100/80 text-xs max-w-xs leading-relaxed">
                  Pilih modul di bawah dan mulai petualanganmu. Kumpulkan poin dan raih lencana keren.
                </p>
                <Button
                  size="sm"
                  className="rounded-xl gap-1.5 bg-white text-primary hover:bg-blue-50 border-0 font-bold shadow-sm h-8 text-xs"
                >
                  <Play className="w-3 h-3 fill-primary" />
                  Lanjutkan Pelajaran
                </Button>
              </div>

              <div className="hidden md:block select-none text-7xl shrink-0 drop-shadow-lg relative z-10">
                🧒
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section header */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-foreground">My Modules</h3>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary gap-0.5 px-2">
            <Link to="/materi/1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </motion.div>

        {/* Module cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ModuleCardSkeleton key={i} />)
            : modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
              >
                <Link to={`/materi/${mod.id}`} className="block">
                  <Card className="rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Colored header */}
                    <div className={cn('h-28 flex items-center justify-center text-4xl relative', mod.header_bg)}>
                      <span className="drop-shadow-sm">{mod.emoji}</span>
                      <div className="absolute bottom-2.5 right-2.5 bg-white/75 backdrop-blur-sm text-[10px] font-bold text-foreground px-2 py-0.5 rounded-full">
                        {mod.progress}%
                      </div>
                    </div>

                    <CardContent className="p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">{mod.title}</span>
                        {mod.isNew ? (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold border-primary text-primary">
                            NEW
                          </Badge>
                        ) : (
                          <Badge className={cn('text-[10px] h-4 px-1.5 font-bold', mod.badge_color)}>
                            LV {mod.level}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {mod.description}
                      </p>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-semibold">{mod.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={cn('h-full rounded-full', mod.progress_color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${mod.progress}%` }}
                            transition={{ duration: 0.9, delay: (i + 2) * 0.08 + 0.3, ease: 'easeOut' as const }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          }
        </div>

      </div>
    </AppLayout>
  )
}

export default Dashboard