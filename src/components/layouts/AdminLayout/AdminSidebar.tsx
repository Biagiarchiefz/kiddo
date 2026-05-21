import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard, LayoutGrid, Users, LogOut, ExternalLink,
  ChevronRight, Layers, HelpCircle, ShieldCheck, BookOpen,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import kiddoLogo from '@/assets/images/kiddoLogo.webp'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { supabase } from '@/utils/supabase'
import { useProfile } from '@/hooks/useProfile'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from '@/components/ui/sidebar'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModuleWithUnits {
  id: number
  title: string
  units: { id: number; title: string; sort_order: number }[]
}

async function fetchModulesWithUnits(): Promise<ModuleWithUnits[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('id, title, units(id, title, sort_order)')
    .order('sort_order')
  if (error) throw error
  return (data ?? []).map(m => ({
    ...m,
    units: [...(m.units ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  }))
}

// ── Shared active pill (animated with layoutId) ───────────────────────────────

const PILL_ID = 'admin-nav-active'

const ActivePill = () => (
  <motion.div
    layoutId={PILL_ID}
    className="absolute inset-0 bg-white rounded-lg shadow-sm pointer-events-none"
    initial={false}
    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
  />
)

// ── Divider ───────────────────────────────────────────────────────────────────

const Divider = () => <div className="shrink-0 h-px bg-sidebar-border" />

// ── Main ──────────────────────────────────────────────────────────────────────

const AdminSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { profile, isLoading: profileLoading } = useProfile()
  const initial = profile?.username?.charAt(0).toUpperCase() ?? 'A'

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['admin-sidebar-modules'],
    queryFn: fetchModulesWithUnits,
    staleTime: 60_000,
  })

  const [openModules, setOpenModules] = useState<Record<number, boolean>>({})
  const toggleModule = (id: number) =>
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const isModulesSection = pathname.startsWith('/admin/modules') || pathname.startsWith('/admin/units')

  // Active key for sub-items (used to drive the shared pill)
  const isDashboard   = pathname === '/admin'
  const isAllModules  = pathname === '/admin/modules'
  const isUsers       = pathname.startsWith('/admin/users')

  return (
    <Sidebar collapsible="offcanvas">

      <SidebarHeader className="px-4 py-3 gap-3">
        <Link to="/admin">
          <img src={kiddoLogo} alt="Kiddo" className="h-10 w-auto" />
        </Link>

        {profileLoading ? (
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="w-9 h-9 rounded-full shrink-0 bg-white/20" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-2.5 w-24 bg-white/20" />
              <Skeleton className="h-2 w-16 bg-white/20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarFallback className="bg-white/20 text-white text-xs font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-none truncate">
                {profile?.username ?? 'Admin'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-white/60 shrink-0" />
                <span className="text-xs text-white/60">Administrator</span>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <Divider />

      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">

          {/* Dashboard */}
          <SidebarMenuItem className="relative">
            {isDashboard && <ActivePill />}
            <SidebarMenuButton
              asChild
              isActive={isDashboard}
              className="relative z-10 h-10 rounded-lg font-semibold data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
            >
              <Link to="/admin">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Admin
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Modul & Unit — collapsible */}
          <Collapsible
            open={isModulesSection || openModules[-1]}
            onOpenChange={v => setOpenModules(prev => ({ ...prev, [-1]: v }))}
          >
            <SidebarMenuItem>
              {/* Wrap only the trigger in relative so the pill doesn't cover expanded content */}
              <div className="relative">
                {isModulesSection && !isAllModules && !modules.some(m =>
                  pathname === `/admin/modules/${m.id}/units` ||
                  m.units.some(u => pathname === `/admin/units/${u.id}/questions`)
                ) && <ActivePill />}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isModulesSection}
                    className="relative z-10 h-10 rounded-lg font-semibold data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="flex-1">Modul & Unit</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isModulesSection || openModules[-1] ? 'rotate-90' : ''}`} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <SidebarMenuSub className="ml-2 mt-1 gap-0.5">

                  {/* Semua Modul */}
                  <SidebarMenuSubItem className="relative">
                    {isAllModules && <ActivePill />}
                    <SidebarMenuSubButton
                      asChild
                      isActive={isAllModules}
                      className="relative z-10 rounded-lg font-semibold text-xs h-8 data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                    >
                      <Link to="/admin/modules">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Semua Modul
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  {/* Per-module */}
                  {isLoading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <SidebarMenuSubItem key={i}>
                          <Skeleton className="h-7 w-full rounded-lg my-0.5" />
                        </SidebarMenuSubItem>
                      ))
                    : modules.map(mod => {
                        const modOpen = !!openModules[mod.id]
                          || pathname.startsWith(`/admin/modules/${mod.id}`)
                          || mod.units.some(u => pathname === `/admin/units/${u.id}/questions`)
                        const isModActive = pathname === `/admin/modules/${mod.id}/units`

                        return (
                          <SidebarMenuSubItem key={mod.id}>
                            <Collapsible open={modOpen} onOpenChange={() => toggleModule(mod.id)}>

                              <div className="relative">
                                {isModActive && <ActivePill />}
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton
                                    isActive={isModActive}
                                    className="relative z-10 rounded-lg h-8 font-medium data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                    <span className="flex-1 truncate">{mod.title}</span>
                                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform duration-200 ${modOpen ? 'rotate-90' : ''}`} />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                              </div>

                              <CollapsibleContent>
                                <SidebarMenuSub className="ml-2 mt-1 gap-0.5">

                                  <SidebarMenuSubItem className="relative">
                                    {isModActive && <ActivePill />}
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isModActive}
                                      className="relative z-10 rounded-lg h-7 text-[11px] data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                                    >
                                      <Link to={`/admin/modules/${mod.id}/units`}>
                                        <Layers className="w-3 h-3" />
                                        Kelola Unit
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>

                                  {mod.units.map(unit => {
                                    const isUnitActive = pathname === `/admin/units/${unit.id}/questions`
                                    return (
                                      <SidebarMenuSubItem key={unit.id} className="relative">
                                        {isUnitActive && <ActivePill />}
                                        <SidebarMenuSubButton
                                          asChild
                                          isActive={isUnitActive}
                                          className="relative z-10 rounded-lg h-7 text-[11px] data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                                        >
                                          <Link to={`/admin/units/${unit.id}/questions`}>
                                            <HelpCircle className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{unit.title}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    )
                                  })}

                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          </SidebarMenuSubItem>
                        )
                      })
                  }

                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Pengguna */}
          <SidebarMenuItem className="relative">
            {isUsers && <ActivePill />}
            <SidebarMenuButton
              asChild
              isActive={isUsers}
              className="relative z-10 h-10 rounded-lg font-semibold data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
            >
              <Link to="/admin/users">
                <Users className="w-4 h-4" />
                Pengguna
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      <Divider />

      <SidebarFooter className="gap-2 py-3 px-3">
        <Button
          asChild variant="outline" size="sm"
          className="w-full rounded-lg gap-2 font-semibold bg-white border-sky-200 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
        >
          <Link to="/dashboard">
            <ExternalLink className="w-4 h-4" />
            Lihat Dashboard User
          </Link>
        </Button>

        <Button
          variant="outline" size="sm" onClick={handleLogout}
          className="w-full rounded-lg gap-2 font-semibold bg-white border-destructive/30 text-destructive hover:bg-red-50 hover:border-destructive/50 hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
