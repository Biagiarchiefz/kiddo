import { Rocket, ClipboardList, Medal, Trophy, HelpCircle, LogOut, Lock } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/utils/supabase'
import { useProfile } from '@/hooks/useProfile'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  icon: ReactNode
  href: string
  match: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Modul',
    icon: <Rocket className="w-4 h-4" />,
    href: '/dashboard',
    match: p => p === '/dashboard' || p.startsWith('/materi'),
  },
  {
    label: 'Tantangan',
    icon: <ClipboardList className="w-4 h-4" />,
    href: '/challenges',
    match: p => p.startsWith('/challenges'),
  },
  {
    label: 'Lencana',
    icon: <Medal className="w-4 h-4" />,
    href: '/badges',
    match: p => p.startsWith('/badges'),
  },
  {
    label: 'Peringkat',
    icon: <Trophy className="w-4 h-4" />,
    href: '/leaderboard',
    match: p => p.startsWith('/leaderboard'),
  },
]

const Divider = () => (
  <div className="shrink-0 h-px bg-sidebar-border mx-0" />
)

const AppSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, isLoading } = useProfile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initial = profile?.username?.charAt(0).toUpperCase() ?? '?'

  return (
    <Sidebar collapsible="offcanvas">

      {/* Profile header with sky blue gradient accent */}
      <SidebarHeader className="items-center gap-2.5 p-0">
        <div className="w-full bg-linear-to-b from-sky-500 to-sky-400 px-4 pt-6 pb-5 flex flex-col items-center gap-2.5">
          {isLoading ? (
            <>
              <Skeleton className="w-14 h-14 rounded-full bg-white/30" />
              <div className="space-y-1.5 flex flex-col items-center">
                <Skeleton className="h-3 w-24 bg-white/30" />
                <Skeleton className="h-2.5 w-16 bg-white/20" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-14 h-14 ring-2 ring-white/60 shadow-md">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                )}
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-bold text-sm text-white">
                  {profile?.username ?? 'Explorer'}
                </p>
                <p className="text-xs text-white/70 mt-0.5">
                  {profile?.school
                    ? profile.school
                    : `Level ${profile?.level ?? 1} Adventurer`}
                </p>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <Divider />

      {/* Nav Items */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1.5">
          {navItems.map(item => {
            const active = item.match(pathname)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="h-10 rounded-lg font-semibold"
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <Divider />

      {/* Footer */}
      <SidebarFooter className="gap-2 py-3 px-3">
        <Button className="w-full rounded-lg gap-2 font-semibold" size="default">
          <Lock className="w-4 h-4" />
          Buka Semua
        </Button>

        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 text-sidebar-foreground/60 hover:bg-black/5 hover:text-sidebar-foreground font-normal h-9 px-3"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            Bantuan
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive font-normal h-9 px-3"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Keluar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin mau keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan keluar dari akun Kiddo. Progress belajarmu tetap tersimpan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar