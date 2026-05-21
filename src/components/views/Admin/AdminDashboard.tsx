import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Users, BookOpen, HelpCircle, LayoutDashboard, ChevronRight } from 'lucide-react'
import AdminLayout from '@/components/layouts/AdminLayout/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/utils/supabase'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

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

const adminSections = [
  {
    label: 'Kelola Modul',
    description: 'Tambah, edit, hapus, dan publish modul belajar.',
    href: '/admin/modules',
    icon: <BookOpen className="w-5 h-5 text-sky-600" />,
    bg: 'bg-sky-50',
  },
  {
    label: 'Kelola Soal',
    description: 'Buka halaman modul, lalu masuk ke unit untuk mengelola soal.',
    href: '/admin/modules',
    icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
    bg: 'bg-amber-50',
  },
]

const AdminDashboard = () => {
  useBreadcrumb([{ label: 'Admin' }])

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    staleTime: 30_000,
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Kelola konten dan pengguna Kiddo</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-10" /></div>
                </CardContent>
              </Card>
            ))
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
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 gap-3">
          {adminSections.map(s => (
            <Card key={s.href + s.label} className="border border-border">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="shrink-0 rounded-lg h-8 gap-1 text-xs">
                  <Link to={s.href}>Buka <ChevronRight className="w-3 h-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
