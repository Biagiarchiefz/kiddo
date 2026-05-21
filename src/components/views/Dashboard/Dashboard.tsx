import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { useDashboard } from '@/hooks/useDashboard'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight, Zap, Star, BookCheck, Swords } from 'lucide-react'
import { cn } from '@/lib/utils'

const ModuleCardSkeleton = () => (
  <Card className="border border-border">
    <Skeleton className="h-28 w-full rounded-none" />
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-2 w-full mt-1" />
    </CardContent>
  </Card>
)

const StatSkeleton = () => (
  <Card className="border border-border">
    <CardContent className="p-4 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
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

const WelcomeModal = ({ username, onClose }: { username: string; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-sky-500 to-sky-400 px-6 pt-8 pb-10 text-center relative overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 15, delay: 0.15 } }}
            className="text-6xl mb-3 select-none"
          >
            🎉
          </motion.div>
          <h2 className="text-xl font-black text-white">Selamat Bergabung!</h2>
          <p className="text-white/80 text-sm mt-1">Akun kamu berhasil dibuat</p>
        </div>

        {/* Body */}
        <div className="-mt-5 bg-white rounded-t-3xl px-6 pt-6 pb-7 text-center space-y-4 relative z-10">
          <div>
            <p className="text-muted-foreground text-sm">Halo,</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{username}! 👋</p>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
              Petualangan belajarmu dimulai sekarang. Kumpulkan XP, selesaikan kuis, dan raih lencana!
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full rounded-xl h-11 text-sm font-bold"
          >
            Ayo Mulai Belajar! 🚀
          </Button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
)

const Dashboard = () => {
  const { modules, isLoading } = useDashboard()
  const { profile, isLoading: profileLoading } = useProfile()
  const [newUserName, setNewUserName] = useState<string | null>(null)

  useEffect(() => {
    const name = sessionStorage.getItem('newUser')
    if (name) {
      setNewUserName(name)
      sessionStorage.removeItem('newUser')
    }
  }, [])

  const completedModules = modules.filter(m => m.progress === 100).length

  return (
    <AppLayout>
      {newUserName && <WelcomeModal username={newUserName} onClose={() => setNewUserName(null)} />}
      <div className="space-y-5">

        {/* Hero Banner */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Card className="bg-linear-to-r from-sky-500 to-sky-400 border-0">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-28 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />

              <div className="space-y-2 flex-1 relative z-10">
                <p className="text-sky-100 text-[10px] font-bold uppercase tracking-widest">
                  Selamat Datang Kembali!
                </p>
                <h2 className="text-xl font-bold text-white leading-snug">
                  Halo, {profile?.username ?? 'Pelajar'}! 👋
                </h2>
                <p className="text-sky-100/80 text-xs max-w-xs leading-relaxed">
                  Pilih modul di bawah dan lanjutkan petualangan belajarmu. Kumpulkan XP dan naiki peringkat!
                </p>
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg gap-1.5 bg-white text-sky-600 hover:bg-sky-50 border-0 font-bold h-8 text-xs"
                >
                  <Link to="/materi/1">Mulai Belajar</Link>
                </Button>
              </div>

              <div className="hidden md:block select-none text-7xl shrink-0 drop-shadow-lg relative z-10">
                🧒
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats row */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {profileLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Total XP</p>
                    <p className="text-lg font-black text-foreground">{(profile?.total_xp ?? 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-sky-500 fill-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Level</p>
                    <p className="text-lg font-black text-foreground">{profile?.level ?? 1}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <BookCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Modul Selesai</p>
                    <p className="text-lg font-black text-foreground">{completedModules}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Section header */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-foreground">Modul Belajar</h3>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary gap-0.5 px-2">
            <Link to="/materi/1">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
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
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
              >
                <Link to={`/materi/${mod.id}`} className="block">
                  <Card className="border border-border">
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
                            BARU
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
                          <span>Progres</span>
                          <span className="font-semibold">{mod.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={cn('h-full rounded-full', mod.progress_color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${mod.progress}%` }}
                            transition={{ duration: 0.9, delay: (i + 3) * 0.08 + 0.3, ease: 'easeOut' as const }}
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

        {/* Challenge CTA */}
        <motion.div custom={modules.length + 4} variants={fadeUp} initial="hidden" animate="show">
          <Card className="border border-sky-100 bg-linear-to-r from-sky-50 to-white">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center shrink-0">
                  <Swords className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Tantangan Campuran</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Uji semua pengetahuanmu dan kumpulkan extra XP!
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="rounded-lg gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold shrink-0">
                <Link to="/challenges">
                  Mulai <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </AppLayout>
  )
}

export default Dashboard