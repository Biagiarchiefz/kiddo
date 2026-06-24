import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import LandingPageLayout from "@/components/layouts/LandingPageLayout/LandingPageLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Trophy,
  CheckCircle,
  Zap,
  ChevronRight,
  Gamepad2,
  LineChart,
  Dumbbell,
  Sparkles,
  Heart,
  Rocket,
  User,
  UserRound,
  UserCircle,
} from "lucide-react";
import heroSectionImg from "@/assets/images/heroSection.webp";
import tataSuryaImg from "@/assets/images/tataSurya.webp";
import duniaHewanImg from "@/assets/images/duniaHewan.webp";
import matematikaImg from "@/assets/images/matematika.webp";
import bahasaImg from "@/assets/images/bahasa.webp";

// ── Decorative SVG ───────────────────────────────────────────────────────────

const SunDecoration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" strokeLinecap="round" className={className}>
    <circle cx="100" cy="100" r="36" fill="currentColor" />
    <line x1="100" y1="52"  x2="100" y2="24"  stroke="currentColor" strokeWidth="9" />
    <line x1="134" y1="66"  x2="155" y2="45"  stroke="currentColor" strokeWidth="9" />
    <line x1="148" y1="100" x2="176" y2="100" stroke="currentColor" strokeWidth="9" />
    <line x1="134" y1="134" x2="155" y2="155" stroke="currentColor" strokeWidth="9" />
    <line x1="100" y1="148" x2="100" y2="176" stroke="currentColor" strokeWidth="9" />
    <line x1="66"  y1="134" x2="45"  y2="155" stroke="currentColor" strokeWidth="9" />
    <line x1="52"  y1="100" x2="24"  y2="100" stroke="currentColor" strokeWidth="9" />
    <line x1="66"  y1="66"  x2="45"  y2="45"  stroke="currentColor" strokeWidth="9" />
  </svg>
);

// ── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Users, value: "12K+", label: "Pelajar Aktif" },
  { icon: BookOpen, value: "50+", label: "Materi Seru" },
  { icon: Trophy, value: "70+", label: "Pencapaian" },
];

const features = [
  {
    Icon: Gamepad2,
    iconClass: "text-sky-600",
    title: "Belajar Sambil Bermain",
    desc: "Materi dikemas dalam cerita interaktif dan mini-games sehingga anak tidak pernah bosan.",
    bg: "bg-sky-50",
    badge: "bg-sky-100 text-sky-700",
    badgeText: "Interaktif",
  },
  {
    Icon: Zap,
    iconClass: "text-lime-600",
    title: "Kuis Kilat Seru",
    desc: "Uji pemahaman dengan kuis singkat setelah setiap materi dan kumpulkan XP.",
    bg: "bg-[#9FFB00]/10",
    badge: "bg-[#9FFB00]/30 text-green-800",
    badgeText: "Kuis & XP",
  },
  {
    Icon: Trophy,
    iconClass: "text-amber-600",
    title: "Papan Peringkat",
    desc: "Bersaing dengan teman-teman, raih posisi teratas, dan buktikan kehebatanmu!",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    badgeText: "Kompetisi",
  },
  {
    Icon: LineChart,
    iconClass: "text-purple-600",
    title: "Pantau Perkembangan",
    desc: "Orang tua bisa memantau progress belajar anak secara real-time setiap saat.",
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    badgeText: "Untuk Ortu",
  },
];

const modules = [
  {
    image: tataSuryaImg,
    title: "Tata Surya",
    level: "Kelas 4–6",
    count: "12 Unit",
    color: "bg-sky-400",
  },
  {
    image: duniaHewanImg,
    title: "Dunia Hewan",
    level: "Kelas 3–5",
    count: "10 Unit",
    color: "bg-emerald-400",
  },
  {
    image: matematikaImg,
    title: "Matematika",
    level: "Kelas 1–6",
    count: "15 Unit",
    color: "bg-amber-400",
  },
  {
    image: bahasaImg,
    title: "Bahasa Indonesia",
    level: "Kelas 1–6",
    count: "8 Unit",
    color: "bg-rose-400",
  },
];

const testimonials = [
  {
    name: "Bu Siti",
    role: "Ibu dari Arif, 9 thn",
    text: "Anak saya jadi semangat belajar setiap hari sejak pakai Kiddo!",
    Icon: UserRound,
    iconClass: "text-sky-600",
  },
  {
    name: "Pak Budi",
    role: "Ayah dari Dina, 10 thn",
    text: "Tampilan menarik dan materinya sesuai kurikulum SD. Sangat direkomendasikan!",
    Icon: User,
    iconClass: "text-emerald-600",
  },
  {
    name: "Bu Rahma",
    role: "Guru SD Negeri 1",
    text: "Platform terbaik untuk mendukung kegiatan belajar siswa di rumah.",
    Icon: UserCircle,
    iconClass: "text-amber-600",
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [location.hash])

  return (
    <LandingPageLayout>
      {/* ══════════════ 1. HERO ══════════════ */}
      <motion.section
        {...fadeUp(0)}
        className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-50 pt-16 pb-20 3xl:pt-24 3xl:pb-32"
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #38BDF8, transparent)",
          }}
        />

        {/* Sun decoration */}
        <div className="absolute -top-10 right-[10%] w-72 text-amber-300 opacity-[0.22] pointer-events-none hidden lg:block">
          <SunDecoration />
        </div>

        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10 flex flex-col lg:flex-row items-center gap-14 3xl:gap-24">
          {/* Left */}
          <motion.div
            {...fadeUp(0)}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-xs 3xl:text-sm font-bold px-4 py-1.5 3xl:px-6 3xl:py-2 rounded-full border border-sky-200 bg-white text-sky-600 shadow-sm">
              <Star className="w-3.5 h-3.5 3xl:w-5 3xl:h-5 fill-sky-400 text-sky-400" />
              Platform Belajar #1 untuk Anak Indonesia
            </span>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl 3xl:text-8xl font-bold text-slate-900 leading-tight">
              Wujudkan Masa
              <br />
              Depan Cerah
              <br />
              <span className="text-sky-500">Anak Anda</span>{" "}
              <span style={{ color: "#9FFB00" }} className="inline-block">
                Sekarang!
              </span>
            </h1>

            <p className="text-slate-500 text-base 3xl:text-xl leading-relaxed max-w-md 3xl:max-w-xl mx-auto lg:mx-0">
              Petualangan belajar interaktif yang dirancang khusus untuk anak
              usia 7–12 tahun. Kumpulkan XP, selesaikan misi, dan raih prestasi
              setiap hari!
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {["Gratis Daftar", "Tanpa Kartu Kredit", "Sesuai Kurikulum"].map(
                (t) => (
                  <span
                    key={t}
                    className="text-xs 3xl:text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 3xl:px-4 3xl:py-1.5 rounded-full inline-flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 3xl:w-5 3xl:h-5 text-emerald-500" />
                    {t}
                  </span>
                ),
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-8 3xl:px-12 font-bold gap-2 text-base 3xl:text-lg bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200"
              >
                <Link to="/daftar">
                  Mulai Belajar
                  <ChevronRight className="w-5 h-5 3xl:w-6 3xl:h-6" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl px-8 3xl:px-12 font-bold gap-2 text-base 3xl:text-lg border-slate-200 hover:border-sky-300 hover:text-sky-600"
              >
                <Link to="/#fitur">
                  Lihat Fitur
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — Hero illustration */}
          <motion.div
            {...fadeUp(0.15)}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Main card */}
              <div
                className="w-80 h-80 lg:w-96 lg:h-96 3xl:w-[560px] 3xl:h-[560px] rounded-3xl shadow-2xl shadow-sky-200/50 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #e0f2fe, #bae6fd, #e0f2fe)",
                }}
              >
                <img
                  src={heroSectionImg}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-5 -left-10 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#9FFB00] flex items-center justify-center text-sm">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    XP Diraih
                  </p>
                  <p className="text-sm font-black text-slate-800">+250 XP</p>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-10 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sm">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Peringkat
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    #1 Terbaik
                  </p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-14 -translate-y-1/2 bg-white rounded-2xl shadow-lg px-4 py-3">
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Kuis Selesai!
                </p>
                <p className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                  10/10 Benar
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats Bar ── */}
        <motion.div {...fadeUp(0.3)} className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10 mt-14 3xl:mt-20">
          <div className="bg-white rounded-2xl shadow-md border border-sky-100 grid grid-cols-3 divide-x divide-sky-100">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center py-6 3xl:py-10 gap-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 3xl:w-7 3xl:h-7 text-sky-500" />
                  <span className="text-2xl 3xl:text-4xl font-black text-slate-900">
                    {value}
                  </span>
                </div>
                <span className="text-xs 3xl:text-base text-slate-400 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════════ 2. TAGLINE + FEATURES ══════════════ */}
      <motion.section {...fadeUp(0)} id="fitur" className="bg-white py-20 3xl:py-28">
        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUp()} className="space-y-3 max-w-xl 3xl:max-w-3xl">
              <span className="text-xs 3xl:text-sm font-bold uppercase tracking-widest text-sky-500">
                Kenapa Kiddo?
              </span>
              <h2 className="text-4xl 3xl:text-6xl font-bold text-slate-900 leading-tight">
                Anak Cerdas &amp; Berprestasi
                <br />
                <span className="text-sky-500">Dimulai dari Sini</span>
              </h2>
              <p className="text-slate-500 3xl:text-lg leading-relaxed">
                Kami memadukan kurikulum terbaik dengan pengalaman bermain yang
                menyenangkan — satu pelajaran seru pada satu waktu.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <Button
                asChild
                className="rounded-xl px-8 3xl:px-12 3xl:py-3 3xl:text-base font-bold bg-sky-500 hover:bg-sky-600 text-white gap-2 shadow-md shadow-sky-200"
              >
                <Link to="/daftar">
                  Daftar Sekarang
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 3xl:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.08)}
                className={`${f.bg} rounded-2xl p-6 3xl:p-10 space-y-3 3xl:space-y-5 hover:shadow-md transition-shadow border border-white`}
              >
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 3xl:w-18 3xl:h-18 rounded-2xl bg-white/80 flex items-center justify-center">
                    <f.Icon className={`w-6 h-6 3xl:w-9 3xl:h-9 ${f.iconClass}`} />
                  </span>
                  <span
                    className={`text-[10px] 3xl:text-xs font-bold px-2.5 py-1 3xl:px-3 3xl:py-1.5 rounded-full ${f.badge}`}
                  >
                    {f.badgeText}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base 3xl:text-xl leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm 3xl:text-base text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 3. MODULES / COURSES ══════════════ */}
      <motion.section {...fadeUp(0)} className="bg-sky-50 py-20 3xl:py-28">
        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10">
          <motion.div {...fadeUp()} className="text-center space-y-3 mb-12 3xl:mb-16">
            <span className="text-xs 3xl:text-sm font-bold uppercase tracking-widest text-sky-500">
              Modul Belajar
            </span>
            <h2 className="text-4xl 3xl:text-6xl font-bold text-slate-900">
              Membentuk Masa Depan
              <br />
              <span className="text-sky-500">Anak Satu Pelajaran</span> pada
              Satu Waktu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 3xl:gap-8">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                {...fadeUp(i * 0.08)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-sky-100 group"
              >
                <div
                  className={`${mod.color} h-32 3xl:h-52 flex items-center justify-center text-6xl select-none`}
                >
                  {mod.image ? (
                    <img
                      src={mod.image}
                      alt={mod.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    " "
                  )}
                </div>
                <div className="p-5 3xl:p-7 space-y-1.5">
                  <span className="text-[10px] 3xl:text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {mod.level}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base 3xl:text-lg">
                    {mod.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs 3xl:text-sm text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 3xl:w-5 3xl:h-5" />
                      {mod.count}
                    </span>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-xl -mr-1"
                    >
                      <Link to="/login">
                        Mulai <ArrowRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 4. SPLIT CTA ══════════════ */}
      <motion.section {...fadeUp(0)} id="tentang" className="py-20 3xl:py-28 bg-white">
        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 3xl:gap-10">
          {/* Left */}
          <motion.div
            {...fadeUp()}
            className="bg-sky-500 rounded-3xl p-10 3xl:p-16 text-white relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 right-10 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-lime-200" />
              </span>
              <h3 className="text-2xl 3xl:text-4xl font-bold leading-snug">
                Tingkatkan Kepercayaan
                <br />
                Diri Anak Anda
              </h3>
              <p className="text-sky-100 text-sm 3xl:text-lg leading-relaxed">
                Dengan sistem pencapaian XP dan lencana, setiap pelajaran
                memberikan rasa bangga dan motivasi untuk terus maju.
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Sistem XP & Level Up",
                  "Lencana Pencapaian",
                  "Ranking Mingguan",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm 3xl:text-base font-medium"
                  >
                    <CheckCircle className="w-4 h-4 3xl:w-5 3xl:h-5 text-[#9FFB00] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="sm"
                className="mt-2 rounded-xl px-6 font-bold text-sky-700 bg-[#9FFB00] hover:bg-[#8adc00]"
              >
                <Link to="/daftar">Coba Sekarang</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-3xl p-10 3xl:p-16 relative overflow-hidden text-slate-800 border-2 border-slate-100"
            style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}
          >
            <div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, #9FFB0030, transparent)",
              }}
            />
            <div className="relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-sky-600" />
              </span>
              <h3 className="text-2xl 3xl:text-4xl font-bold leading-snug text-slate-900">
                Bantu Anak Raih
                <br />
                Impian Tertinggi
              </h3>
              <p className="text-slate-500 text-sm 3xl:text-lg leading-relaxed">
                Konten belajar kami disusun bersama para ahli pendidikan anak
                untuk memastikan setiap materi sesuai tahapan perkembangan.
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Sesuai Kurikulum Merdeka",
                  "Dikembangkan Ahli Pendidikan",
                  "Update Konten Rutin",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm 3xl:text-base font-medium text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 3xl:w-5 3xl:h-5 text-sky-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="sm"
                className="mt-2 rounded-xl px-6 font-bold bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Link to="/daftar">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ══════════════ 5. BIG STATS ══════════════ */}
      <motion.section
        {...fadeUp(0)}
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9, #38bdf8)" }}
      >
        {/* Half-ring top-right */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border-[14px] border-white/15 pointer-events-none" />
        {/* Half-ring bottom-left */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[14px] border-white/10 pointer-events-none" />
        {/* Medium ring mid-right */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-8 w-44 h-44 rounded-full border-[8px] border-white/10 pointer-events-none" />
        {/* Small rings scattered */}
        <div className="absolute top-10 left-[18%] w-10 h-10 rounded-full border-2 border-white/20 pointer-events-none" />
        <div className="absolute bottom-10 right-[22%] w-7 h-7 rounded-full border-2 border-white/15 pointer-events-none" />
        <div className="absolute top-[55%] left-10 w-5 h-5 rounded-full border border-white/20 pointer-events-none" />
        {/* Sparkles */}
        <svg className="absolute top-8 left-[40%] w-4 h-4 text-white/25 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
        </svg>
        <svg className="absolute bottom-12 left-14 w-3 h-3 text-white/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
        </svg>
        <svg className="absolute top-14 right-[30%] w-3 h-3 text-white/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
        </svg>

        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10 relative">
          <motion.div {...fadeUp()} className="text-center text-white mb-12 3xl:mb-20 space-y-3">
            <span className="text-xs 3xl:text-sm font-bold uppercase tracking-widest opacity-70">
              Dampak Nyata
            </span>
            <h2 className="text-4xl 3xl:text-6xl font-bold">
              Berdayakan Anak-anak
              <br />
              Satu Pelajaran pada Satu Waktu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 3xl:gap-10">
            {/* ── Card 1: Pelajar Aktif ── */}
            <motion.div
              {...fadeUp(0)}
              className="bg-sky-50 rounded-2xl p-8 3xl:p-12 text-center space-y-2 3xl:space-y-4 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border-[12px] border-sky-300/25 pointer-events-none" />
              <div className="absolute bottom-4 left-5 w-5 h-5 rounded-full bg-sky-200/70 pointer-events-none" />
              <div className="flex justify-center relative">
                <Users className="w-8 h-8 3xl:w-14 3xl:h-14 text-sky-500" />
              </div>
              <p className="text-4xl 3xl:text-6xl font-black text-sky-700">12.000+</p>
              <p className="font-bold text-sm 3xl:text-lg text-sky-800">Pelajar Aktif</p>
              <p className="text-sm 3xl:text-base text-muted-foreground">di seluruh Indonesia</p>
            </motion.div>

            {/* ── Card 2: Rating ── */}
            <motion.div
              {...fadeUp(0.1)}
              className="bg-rose-50 rounded-2xl p-8 3xl:p-12 text-center space-y-2 3xl:space-y-4 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 rotate-45 border-[10px] border-rose-300/25 rounded-xl pointer-events-none" />
              <div className="absolute bottom-4 right-5 w-10 h-10 rounded-full border-2 border-rose-300/40 pointer-events-none" />
              <div className="flex justify-center relative">
                <Heart className="w-8 h-8 3xl:w-14 3xl:h-14 text-rose-500" />
              </div>
              <p className="text-4xl 3xl:text-6xl font-black text-rose-600">4.9</p>
              <p className="font-bold text-sm 3xl:text-lg text-rose-800">Rating Orang Tua</p>
              <p className="text-sm 3xl:text-base text-muted-foreground">dari 500+ ulasan</p>
            </motion.div>

            {/* ── Card 3: Kepuasan ── */}
            <motion.div
              {...fadeUp(0.2)}
              className="bg-amber-50 rounded-2xl p-8 3xl:p-12 text-center space-y-2 3xl:space-y-4 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute -bottom-5 -right-4 w-28 h-20 border-[10px] border-amber-300/25 rounded-2xl pointer-events-none" />
              <div className="absolute top-5 left-5 w-7 h-7 rotate-12 border-2 border-amber-300/45 rounded-md pointer-events-none" />
              <div className="flex justify-center relative">
                <Rocket className="w-8 h-8 3xl:w-14 3xl:h-14 text-amber-500" />
              </div>
              <p className="text-4xl 3xl:text-6xl font-black text-amber-600">95%</p>
              <p className="font-bold text-sm 3xl:text-lg text-amber-800">Tingkat Kepuasan</p>
              <p className="text-sm 3xl:text-base text-muted-foreground">anak lebih semangat belajar</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 6. TESTIMONIALS ══════════════ */}
      <motion.section {...fadeUp(0)} className="bg-slate-50 py-20 3xl:py-28">
        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10">
          <motion.div {...fadeUp()} className="text-center space-y-3 mb-12 3xl:mb-16">
            <span className="text-xs 3xl:text-sm font-bold uppercase tracking-widest text-sky-500">
              Testimoni
            </span>
            <h2 className="text-4xl 3xl:text-6xl font-bold text-slate-900">
              Kata Mereka Tentang Kiddo
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 3xl:gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.08)}
                className="bg-white rounded-2xl p-6 3xl:p-10 shadow-sm border border-slate-100 space-y-4 3xl:space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 3xl:w-6 3xl:h-6 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm 3xl:text-base text-slate-600 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="w-10 h-10 3xl:w-14 3xl:h-14 rounded-full bg-sky-100 flex items-center justify-center">
                    <t.Icon className={`w-5 h-5 3xl:w-7 3xl:h-7 ${t.iconClass}`} />
                  </div>
                  <div>
                    <p className="text-sm 3xl:text-base font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs 3xl:text-sm text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 7. BOTTOM CTA BANNER ══════════════ */}
      <motion.section {...fadeUp(0)} id="kontak" className="py-20 3xl:py-28 bg-white">
        <div className="max-w-7xl 3xl:max-w-[2000px] mx-auto px-6 3xl:px-10">
          <motion.div
            {...fadeUp()}
            className="rounded-3xl p-12 3xl:p-24 text-center relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-sky-500"
          >
            {/* Glow blobs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-20"
              style={{ background: "radial-gradient(circle, white, transparent)" }} />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none opacity-15"
              style={{ background: "radial-gradient(circle, white, transparent)" }} />

            {/* Sparkle stars */}
            <svg className="absolute top-6 left-10 w-5 h-5 text-white/30 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute top-14 right-14 w-4 h-4 text-white/25 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute bottom-10 left-[15%] w-6 h-6 text-white/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute bottom-8 right-[12%] w-3 h-3 text-white/30 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute top-[40%] left-6 w-3 h-3 text-white/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>
            <svg className="absolute top-[35%] right-8 w-4 h-4 text-white/20 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l2 9.3L24 12l-10 2.7L12 24l-2-9.3L0 12l10-2.7z"/>
            </svg>

            {/* Floating rings */}
            <div className="absolute top-8 right-[28%] w-14 h-14 rounded-full border border-white/15 pointer-events-none" />
            <div className="absolute bottom-10 left-[30%] w-20 h-20 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute top-[30%] left-[8%] w-10 h-10 rounded-full border border-white/12 pointer-events-none" />

            {/* Top shimmer line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />

            <div className="relative space-y-5 3xl:space-y-8 max-w-2xl 3xl:max-w-5xl mx-auto">
              <span className="inline-flex items-center gap-2 text-xs 3xl:text-sm font-bold px-4 py-1.5 3xl:px-6 3xl:py-2.5 rounded-full bg-white/20 text-white border border-white/30">
                <Zap className="w-3.5 h-3.5 3xl:w-5 3xl:h-5 fill-current" />
                Mulai Perjalanan Belajar Hari Ini
              </span>
              <h2 className="text-4xl 3xl:text-7xl font-bold leading-tight text-white">
                Membangun Generasi Cerdas
                <br />
                <span className="text-white/80">
                  Satu Anak pada Satu Waktu
                </span>
              </h2>
              <p className="text-white/70 3xl:text-xl leading-relaxed">
                Bergabung bersama ribuan keluarga Indonesia yang telah
                mempercayakan pendidikan anak mereka kepada Kiddo.
              </p>
              <div className="flex flex-wrap gap-3 3xl:gap-5 justify-center pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 3xl:px-16 font-bold text-base 3xl:text-xl bg-white text-sky-700 gap-2 shadow-lg shadow-sky-900/20 hover:bg-white! hover:opacity-90!"
                >
                  <Link to="/daftar">
                    Daftar Gratis Sekarang
                    <ChevronRight className="w-5 h-5 3xl:w-7 3xl:h-7" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-8 3xl:px-14 font-bold text-base 3xl:text-xl bg-white/15 border border-white/50 text-white hover:bg-white/25! hover:border-white! hover:text-white!"
                >
                  <Link to="/login">Sudah Punya Akun</Link>
                </Button>
              </div>
              <p className="text-xs 3xl:text-base text-white/55 pt-1">
                Gratis selamanya · Tidak perlu kartu kredit · Setup dalam 2 menit
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </LandingPageLayout>
  );
};

export default Home;
