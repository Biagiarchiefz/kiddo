import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  Users,
  BookOpen,
  HelpCircle,
  ChevronRight,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/utils/supabase";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useProfile } from "@/hooks/useProfile";
import dashboardHeroImg from "@/assets/images/dashboardHero.webp";
import kelolaModulImg from "@/assets/images/kelolaModul.webp";
import kelolaSoalImg from "@/assets/images/kelolaSoal.webp";
import kelolaUserImg from "@/assets/images/kelolaUser.webp";

async function fetchStats() {
  const [users, modules, questions] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("modules").select("id", { count: "exact", head: true }),
    supabase.from("questions").select("id", { count: "exact", head: true }),
  ]);
  return {
    users: users.count ?? 0,
    modules: modules.count ?? 0,
    questions: questions.count ?? 0,
  };
}

const quickNav = [
  {
    label: "Kelola Modul",
    description: "Tambah, edit, hapus, dan atur urutan modul belajar.",
    href: "/admin/modules",
    image: kelolaModulImg,
    bg: "bg-sky-400",
  },
  {
    label: "Kelola Soal",
    description: "Masuk ke unit dalam modul untuk mengelola soal kuis.",
    href: "/admin/modules",
    image: kelolaSoalImg,
    bg: "bg-amber-400",
  },
  {
    label: "Kelola Pengguna",
    description: "Lihat dan kelola data pengguna yang terdaftar di Kiddo.",
    href: "/admin/users",
    image: kelolaUserImg,
    bg: "bg-purple-400",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const StatSkeleton = () => (
  <Card className="border border-border">
    <CardContent className="p-3.5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-8 rounded-full" />
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  useBreadcrumb([{ label: "Admin" }]);
  const { profile, isLoading: profileLoading } = useProfile();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
    staleTime: 30_000,
  });

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* ── Hero Banner ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <Card className="bg-linear-to-r from-amber-500 to-amber-400 border-0">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-28 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />

              <div className="space-y-2 flex-1 relative z-10">
                <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest">
                  Panel Admin
                </p>
                <h2 className="text-4xl font-bold text-white leading-snug">
                  Halo, {profile?.username ?? "Admin"}! 👋
                </h2>
                <p className="text-white/80 text-xs max-w-xs leading-relaxed">
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

              {/* Image card — same style as Dashboard */}
              <div className="hidden md:block shrink-0 relative z-10">
                <div className="w-40 h-40 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 shadow-[0_16px_40px_rgba(180,83,9,0.35)] overflow-hidden -rotate-2">
                  <img
                    src={dashboardHeroImg}
                    alt="Admin panel"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {profileLoading || statsLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <Card className="border border-border/70 bg-white/70 backdrop-blur-sm -rotate-1">
                <CardContent className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Pengguna
                      </p>
                      <p className="text-lg font-black text-foreground leading-none">
                        {stats?.users}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Terdaftar
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-200">
                    USR
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-white/70 backdrop-blur-sm rotate-1">
                <CardContent className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Modul
                      </p>
                      <p className="text-lg font-black text-foreground leading-none">
                        {stats?.modules}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Tersedia
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                    MOD
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-white/70 backdrop-blur-sm -rotate-1">
                <CardContent className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Soal
                      </p>
                      <p className="text-lg font-black text-foreground leading-none">
                        {stats?.questions}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Total bank soal
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    SOL
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* ── Section header ── */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between"
        >
          <h3 className="text-sm font-bold text-foreground">Akses Cepat</h3>
        </motion.div>

        {/* ── Quick nav cards — same style as module cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickNav.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i + 3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={{
                y: -4,
                transition: {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20,
                },
              }}
            >
              <Link to={item.href} className="block h-full">
                <Card className="border border-border pt-0 h-full">
                  <div
                    className={`h-40 flex items-center justify-center text-5xl relative overflow-hidden ${item.bg}`}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-3.5 space-y-1.5">
                    <p className="font-bold text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA — kembali ke dashboard user ── */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <Card className="border border-amber-100 bg-linear-to-r from-amber-50 to-white">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Panel Manajemen
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola semua modul, soal, dan pengguna dari satu tempat.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-lg gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold shrink-0"
              >
                <Link to="/admin/modules">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Lihat Modul
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
