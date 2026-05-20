import { Bell, Settings, Zap } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'

const AppNavbar = () => {
  const { profile, isLoading } = useProfile()

  return (
    <header className="bg-sidebar border-b border-border/60 shadow-sm sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 mx-1" />

      <div className="flex items-center gap-1.5 ml-auto">
        {/* XP badge */}
        {isLoading ? (
          <Skeleton className="h-7 w-24 rounded-full" />
        ) : (
          <div className="flex items-center gap-1 bg-secondary/15 border border-secondary/30 px-2.5 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 text-secondary fill-secondary" />
            <span className="text-xs font-bold text-secondary">
              {(profile?.total_xp ?? 0).toLocaleString('id-ID')} XP
            </span>
          </div>
        )}

        <Button variant="ghost" size="icon" className="h-9 w-9 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}

export default AppNavbar