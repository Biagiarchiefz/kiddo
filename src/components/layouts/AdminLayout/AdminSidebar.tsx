import { LayoutDashboard, LayoutGrid, Users, LogOut, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  match: (p: string) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard Admin',
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: '/admin',
    match: p => p === '/admin',
  },
  {
    label: 'Modul & Unit',
    icon: <LayoutGrid className="w-4 h-4" />,
    href: '/admin/modules',
    match: p => p.startsWith('/admin/modules') || p.startsWith('/admin/units'),
  },
  {
    label: 'Pengguna',
    icon: <Users className="w-4 h-4" />,
    href: '/admin/users',
    match: p => p.startsWith('/admin/users'),
  },
]

const Divider = () => <div className="shrink-0 h-px bg-sidebar-border mx-0" />

const AdminSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, isLoading } = useProfile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const initial = profile?.username?.charAt(0).toUpperCase() ?? 'A'

  return (
    <Sidebar collapsible="offcanvas">

      {/* Header — amber gradient to differentiate from user sidebar */}
      <SidebarHeader className="items-center gap-2.5 p-0">
        <div className="w-full bg-linear-to-b from-amber-500 to-amber-400 px-4 pt-5 pb-4 flex flex-col items-center gap-2.5">
          {isLoading ? (
            <>
              <Skeleton className="w-12 h-12 rounded-full bg-white/30" />
              <div className="space-y-1.5 flex flex-col items-center">
                <Skeleton className="h-3 w-24 bg-white/30" />
                <Skeleton className="h-2.5 w-16 bg-white/20" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white/80" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Admin Panel</span>
              </div>
              <Avatar className="w-12 h-12 ring-2 ring-white/60 shadow-md">
                <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-bold text-sm text-white">{profile?.username ?? 'Admin'}</p>
                <p className="text-xs text-white/70 mt-0.5">{profile?.school || 'Administrator'}</p>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <Divider />

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1.5">
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.match(pathname)}
                className="h-10 rounded-lg font-semibold"
              >
                <Link to={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Divider />

      {/* Footer */}
      <SidebarFooter className="gap-2 py-3 px-3">
        {/* View as user button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full rounded-lg gap-2 font-semibold border-sky-200 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
        >
          <Link to="/dashboard">
            <ExternalLink className="w-4 h-4" />
            Lihat Dashboard User
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive font-normal h-9 px-3"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Keluar
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar