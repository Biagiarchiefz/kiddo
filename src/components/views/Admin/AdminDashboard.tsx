import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Users, BookOpen, HelpCircle, ChevronRight } from 'lucide-react'
import AdminLayout from '@/components/layouts/AdminLayout/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/utils/supabase'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'
import { useProfile } from '@/hooks/useProfile'

async function fetchStats() {
  const [users, modules, questions] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('modules').select('id', { count: 'exact', head: true }),
    supabase.from('questions').select('id', { count: 'exact', head: true }),
  ])
  return {
    users: users.count ?? 0,
    modules: modules.count ?? 0,
    questions: questions.count ?? 0,
  }
}

const quickNav = [
  {
    label: 'Kelola Modul',
    description: 'Tambah, edit, hapus, dan atur urutan modul belajar.',
    href: '/admin/modules',
    emoji: '📚',
    bg: 'bg-sky-50',
  },
  {
    label: 'Kelola Soal',
    description: 'Masuk ke unit dalam modul untuk mengelola soal kuis.',
    href: '/admin/modules',
    emoji: '❓',
    bg: 'bg-amber-50',
  },
  {
    label: 'Kelola Pengguna',
    description: 'Lihat dan kelola data pengguna yang terdaftar di Kiddo.',
    href: '/admin/users',
    emoji: '👥',
    bg: 'bg-purple-50',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
}

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

const AdminDashboard = () => {
  useBreadcrumb([{ label: 'Admin' }])
  const { profile } = useProfile()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    staleTime: 30_000,
  })

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Hero Banner */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
          <Card className="bg-linear-to-r from-amber-500 to-amber-400 border-0">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-28 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />

              <div className="space-y-2 flex-1 relative z-10">
                <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest">
                  Panel Admin
                </p>
                <h2 className="text-xl font-bold text-white leading-snug">
                  Halo, {profile?.username ?? 'Admin'}! 👋
                </h2>
                <p className="text-amber-100/80 text-xs max-w-xs leading-relaxed">
                  Kelola konten, soal, dan pengguna platform Kiddo dari sini.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg gap-1.5 bg-white text-amber-600 hover:bg-amber-50 border-0 font-bold h-8 text-xs"
                >
                  <Link to="/admin/modules">
                    Kelola Modul <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="hidden md:block select-none text-7xl shrink-0 drop-shadow-lg relative z-10">
                🛡️
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Pengguna</p>
                    <p className="text-lg font-black text-foreground">{stats?.users}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Modul</p>
                    <p className="text-lg font-black text-foreground">{stats?.modules}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Soal</p>
                    <p className="text-lg font-black text-foreground">{stats?.questions}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Section header */}
        <motion.div
          custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-foreground">Akses Cepat</h3>
        </motion.div>

        {/* Quick nav cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickNav.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i + 3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
            >
              <Link to={s.href} className="block h-full">
                <Card className="border border-border h-full">
                  <div className={`h-24 flex items-center justify-center text-4xl ${s.bg}`}>
                    {s.emoji}
                  </div>
                  <CardContent className="p-3.5 space-y-1.5">
                    <p className="font-bold text-sm text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
