import { Link } from "react-router";
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
  return (
    <LandingPageLayout>
      {/* ══════════════ 1. HERO ══════════════ */}
      <motion.section
        {...fadeUp(0)}
        className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-50 pt-16 pb-20"
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #38BDF8, transparent)",
          }}
        />
        <div
          className="absolute -bottom-10 -left-16 w-72 h-72 rounded-full opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #9FFB00, transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14">
          {/* Left */}
          <motion.div
            {...fadeUp(0)}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border border-sky-200 bg-white text-sky-600 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
              Platform Belajar #1 untuk Anak Indonesia
            </span>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Wujudkan Masa
              <br />
              Depan Cerah
              <br />
              <span className="text-sky-500">Anak Anda</span>{" "}
              <span style={{ color: "#9FFB00" }} className="inline-block">
                Sekarang!
              </span>
            </h1>

            <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto lg:mx-0">
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
                    className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
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
                className="rounded-2xl px-8 font-bold gap-2 text-base bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200"
              >
                <Link to="/daftar">
                  Mulai Belajar
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl px-8 font-bold gap-2 text-base border-slate-200 hover:border-sky-300 hover:text-sky-600"
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
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl shadow-2xl shadow-sky-200/50 overflow-hidden"
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
        <motion.div {...fadeUp(0.3)} className="max-w-7xl mx-auto px-6 mt-14">
          <div className="bg-white rounded-2xl shadow-md border border-sky-100 grid grid-cols-3 divide-x divide-sky-100">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center py-6 gap-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-sky-500" />
                  <span className="text-2xl font-black text-slate-900">
                    {value}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* ══════════════ 2. TAGLINE + FEATURES ══════════════ */}
      <motion.section {...fadeUp(0)} id="fitur" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUp()} className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
                Kenapa Kiddo?
              </span>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Anak Cerdas &amp; Berprestasi
                <br />
                <span className="text-sky-500">Dimulai dari Sini</span>
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Kami memadukan kurikulum terbaik dengan pengalaman bermain yang
                menyenangkan — satu pelajaran seru pada satu waktu.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <Button
                asChild
                className="rounded-xl px-8 font-bold bg-sky-500 hover:bg-sky-600 text-white gap-2 shadow-md shadow-sky-200"
              >
                <Link to="/daftar">
                  Daftar Sekarang
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.08)}
                className={`${f.bg} rounded-2xl p-6 space-y-3 hover:shadow-md transition-shadow border border-white`}
              >
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center">
                    <f.Icon className={`w-6 h-6 ${f.iconClass}`} />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${f.badge}`}
                  >
                    {f.badgeText}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 3. MODULES / COURSES ══════════════ */}
      <motion.section {...fadeUp(0)} className="bg-sky-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
              Modul Belajar
            </span>
            <h2 className="text-4xl font-bold text-slate-900">
              Membentuk Masa Depan
              <br />
              <span className="text-sky-500">Anak Satu Pelajaran</span> pada
              Satu Waktu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                {...fadeUp(i * 0.08)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-sky-100 group"
              >
                <div
                  className={`${mod.color} h-32 flex items-center justify-center text-6xl select-none`}
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
                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {mod.level}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base">
                    {mod.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
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
      <motion.section {...fadeUp(0)} id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left */}
          <motion.div
            {...fadeUp()}
            className="bg-sky-500 rounded-3xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 right-10 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-lime-200" />
              </span>
              <h3 className="text-2xl font-bold leading-snug">
                Tingkatkan Kepercayaan
                <br />
                Diri Anak Anda
              </h3>
              <p className="text-sky-100 text-sm leading-relaxed">
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
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4 text-[#9FFB00] shrink-0" />
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
            className="rounded-3xl p-10 relative overflow-hidden text-slate-800 border-2 border-slate-100"
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
              <h3 className="text-2xl font-bold leading-snug text-slate-900">
                Bantu Anak Raih
                <br />
                Impian Tertinggi
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
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
                    className="flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
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
        className="py-20"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUp()}
            className="text-center text-white mb-12 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">
              Dampak Nyata
            </span>
            <h2 className="text-4xl font-bold">
              Berdayakan Anak-anak
              <br />
              Satu Pelajaran pada Satu Waktu
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                value: "12.000+",
                label: "Pelajar Aktif",
                sub: "di seluruh Indonesia",
                Icon: Users,
                iconClass: "text-[#9FFB00]",
              },
              {
                value: "4.9",
                label: "Rating Orang Tua",
                sub: "dari 500+ ulasan",
                Icon: Heart,
                iconClass: "text-rose-300",
              },
              {
                value: "95%",
                label: "Tingkat Kepuasan",
                sub: "anak lebih semangat belajar",
                Icon: Rocket,
                iconClass: "text-amber-300",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp(i * 0.1)}
                className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center text-white space-y-2 hover:bg-white/20 transition-colors"
              >
                <div className="flex justify-center">
                  <s.Icon className={`w-8 h-8 ${s.iconClass}`} />
                </div>
                <p className="text-4xl font-black">{s.value}</p>
                <p className="font-bold">{s.label}</p>
                <p className="text-sm text-sky-100">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 6. TESTIMONIALS ══════════════ */}
      <motion.section {...fadeUp(0)} className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
              Testimoni
            </span>
            <h2 className="text-4xl font-bold text-slate-900">
              Kata Mereka Tentang Kiddo
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.08)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <t.Icon className={`w-5 h-5 ${t.iconClass}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ 7. BOTTOM CTA BANNER ══════════════ */}
      <motion.section {...fadeUp(0)} id="kontak" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUp()}
            className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)" }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #9FFB00, transparent)",
              }}
            />
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none opacity-20"
              style={{
                background: "radial-gradient(circle, #38BDF8, transparent)",
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none opacity-20"
              style={{
                background: "radial-gradient(circle, #9FFB00, transparent)",
              }}
            />

            <div className="relative space-y-5 max-w-2xl mx-auto">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border text-[#9FFB00]"
                style={{ borderColor: "#9FFB0050" }}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Mulai Perjalanan Belajar Hari Ini
              </span>
              <h2 className="text-4xl font-bold leading-tight">
                Membangun Generasi Cerdas
                <br />
                <span style={{ color: "#9FFB00" }}>
                  Satu Anak pada Satu Waktu
                </span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Bergabung bersama ribuan keluarga Indonesia yang telah
                mempercayakan pendidikan anak mereka kepada Kiddo.
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl px-10 font-bold text-base text-slate-900 gap-2"
                  style={{ backgroundColor: "#9FFB00" }}
                >
                  <Link to="/daftar">
                    Daftar Gratis Sekarang
                 <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-8 font-bold text-base border-white/20 text-black "
                >
                  <Link to="/login">Sudah Punya Akun</Link>
                </Button>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Gratis selamanya · Tidak perlu kartu kredit · Setup dalam 2
                menit
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </LandingPageLayout>
  );
};

export default Home;
