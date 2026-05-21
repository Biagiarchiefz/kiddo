import { Bell, Zap } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/useProfile'

const AppNavbar = () => {
  const { profile, isLoading } = useProfile()
  const initial = profile?.username?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-4 mx-1" />

      <div className="flex items-center gap-2 ml-auto">
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

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl">
          <Bell className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-4 mx-0.5" />

        {/* User info */}
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="hidden sm:flex flex-col gap-1">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2 w-14" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground leading-none">
                {profile?.username ?? 'Explorer'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {profile?.school || `Level ${profile?.level ?? 1} Adventurer`}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppNavbar