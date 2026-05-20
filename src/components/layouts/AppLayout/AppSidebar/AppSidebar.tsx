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
    label: 'Modules',
    icon: <Rocket className="w-4 h-4" />,
    href: '/dashboard',
    match: p => p === '/dashboard' || p.startsWith('/materi'),
  },
  {
    label: 'Quizzes',
    icon: <ClipboardList className="w-4 h-4" />,
    href: '/challenges',
    match: p => p.startsWith('/challenges'),
  },
  {
    label: 'Badges',
    icon: <Medal className="w-4 h-4" />,
    href: '/badges',
    match: p => p.startsWith('/badges'),
  },
  {
    label: 'Leaderboard',
    icon: <Trophy className="w-4 h-4" />,
    href: '/leaderboard',
    match: p => p.startsWith('/leaderboard'),
  },
]

// Garis pemisah yang sepenuhnya di dalam sidebar (tidak menyentuh border kanan)
const Divider = () => (
  <div className="shrink-0 h-px bg-sidebar-border/70 mx-3" />
)

const AppSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, isLoading } = useProfile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initial = profile?.username?.charAt(0).toUpperCase() ?? '?'

  return (
    <Sidebar collapsible="offcanvas">
      {/* Profile */}
      <SidebarHeader className="items-center py-5 gap-2.5">
        {isLoading ? (
          <>
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-1.5 flex flex-col items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="w-14 h-14 ring-2 ring-sidebar-border">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-sm text-sidebar-foreground">
                {profile?.username ?? 'Explorer'}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                {profile?.school
                  ? profile.school
                  : `Level ${profile?.level ?? 1} Adventurer`}
              </p>
            </div>
          </>
        )}
      </SidebarHeader>

      <Divider />

      {/* Nav Items */}
      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navItems.map(item => {
            const active = item.match(pathname)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="h-10 rounded-xl font-semibold"
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
        <Button className="w-full rounded-full gap-2 font-semibold" size="default">
          <Lock className="w-4 h-4" />
          Unlock All
        </Button>

        <div className="flex flex-col gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground font-normal h-9 px-3"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            Help
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2.5 text-destructive hover:bg-sidebar-accent hover:text-destructive font-normal h-9 px-3"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
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