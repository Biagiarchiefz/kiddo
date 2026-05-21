import { motion } from "framer-motion";
import {
  Rocket,
  ClipboardList,
  Medal,
  Trophy,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog";
import { supabase } from "@/utils/supabase";
import { useProfile } from "@/hooks/useProfile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  match: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    label: "Modul",
    icon: <Rocket className="w-4 h-4" />,
    href: "/dashboard",
    match: (p) => p === "/dashboard" || p.startsWith("/materi"),
  },
  {
    label: "Tantangan",
    icon: <ClipboardList className="w-4 h-4" />,
    href: "/challenges",
    match: (p) => p.startsWith("/challenges"),
  },
  {
    label: "Lencana",
    icon: <Medal className="w-4 h-4" />,
    href: "/badges",
    match: (p) => p.startsWith("/badges"),
  },
  {
    label: "Peringkat",
    icon: <Trophy className="w-4 h-4" />,
    href: "/leaderboard",
    match: (p) => p.startsWith("/leaderboard"),
  },
];

const PILL_ID = "app-nav-active";

const ActivePill = () => (
  <motion.div
    layoutId={PILL_ID}
    className="absolute inset-0 bg-white rounded-lg shadow-sm pointer-events-none"
    initial={false}
    transition={{ type: "spring", stiffness: 420, damping: 36 }}
  />
);

const Divider = () => <div className="shrink-0 h-px bg-sidebar-border mx-0" />;

const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();
  const initial = profile?.username?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-4 py-3 gap-3">
        {/* <Link to="/dashboard">
          <img src={kiddoLogo} alt="Kiddo" className="h-10 w-auto" />
        </Link> */}

        {/* User info + XP */}
        {isLoading ? (
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
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              )}
              <AvatarFallback className="bg-yellow-500 text-slate-900 text-xs font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-none truncate">
                {profile?.username ?? "Explorer"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300 shrink-0" />
                <span className="text-xs font-bold text-yellow-300">
                  {(profile?.total_xp ?? 0).toLocaleString("id-ID")} XP
                </span>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <Divider />

      {/* Nav Items */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1.5">
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <SidebarMenuItem key={item.href} className="relative">
                {active && <ActivePill />}
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="relative z-10 h-10 rounded-lg font-semibold data-[active=true]:bg-transparent data-[active=true]:text-sky-700 data-[active=true]:shadow-none"
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <Divider />

      {/* Footer */}
      <SidebarFooter className="gap-2 py-3 px-3">
        {profile?.role === "admin" && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full rounded-lg gap-2 font-semibold bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
          >
            <Link to="/admin">
              <ShieldCheck className="w-4 h-4" />
              Kembali ke Admin
            </Link>
          </Button>
        )}

        <div className="flex flex-col gap-1.5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-lg gap-2 font-semibold bg-white border-red-300 text-destructive shadow-none hover:bg-red-50 hover:border-red-400 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin mau keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan keluar dari akun Kiddo. Progress belajarmu tetap
                  tersimpan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  variant="destructive"
                >
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
