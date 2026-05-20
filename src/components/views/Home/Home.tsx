import LandingPageLayout from '@/components/layouts/LandingPageLayout/LandingPageLayout'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play, Rocket, Gamepad2, Zap } from 'lucide-react'

const Home = () => {
  return (
    <LandingPageLayout>
      {/* ── Hero ── */}
      <section className="bg-[#f5f5f7] py-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-12">
          {/* Left */}
          <div className="flex-1 space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-border bg-white px-4 py-1.5 rounded-full text-sm text-muted-foreground font-medium shadow-sm">
              <Gamepad2 className="w-4 h-4 text-primary" />
              Aplikasi Belajar #1 untuk Anak
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Belajar Jadi <span className="text-primary">Seru!</span>
              <br />
              Main Sambil Pintar.
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
              Petualangan belajar interaktif yang dirancang khusus untuk anak.
              Kumpulkan XP, selesaikan misi, dan raih prestasi!
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 font-semibold gap-2 bg-foreground hover:bg-foreground/90 text-background"
              >
                <Link to="/daftar">
                  Mulai Belajar!
                  <Rocket className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild className="rounded-xl px-6 gap-2">
                <Link to="/#fitur">
                  <Play className="w-4 h-4 fill-current" />
                  Tonton Video
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — Illustration placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-80 h-72 bg-white rounded-3xl shadow-md flex items-center justify-center overflow-hidden border border-border">
              <span className="text-9xl select-none">🤖</span>
              {/* Floating badge */}
              <div className="absolute bottom-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                Kuis Selesai! ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mengapa Belajar di Kiddo? ── */}
      <section id="fitur" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Mengapa Belajar di Kiddo?
            </h2>
            <p className="text-sm text-primary font-medium max-w-md mx-auto leading-relaxed">
              Kami menggabungkan kurikulum terbaik dengan pengalaman bermain
              yang menyenangkan.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — Belajar Seru Interaktif */}
            <Card className="rounded-2xl overflow-hidden border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">
                  Belajar <span className="text-primary">Seru</span> Interaktif
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Materi pelajaran dikemas dalam bentuk cerita interaktif dan
                  mini-games yang membuat anak tidak cepat bosan.
                </p>
              </CardContent>
              {/* Illustration area */}
              <div className="mx-6 mb-6 h-36 bg-linear-to-br from-yellow-100 via-pink-100 to-blue-100 rounded-xl flex items-center justify-center gap-4 text-4xl select-none">
                🧩 🎨 🔬
              </div>
            </Card>

            {/* Card 2 — Kuis Kilat */}
            <Card className="rounded-2xl overflow-hidden border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                </div>
                <h3 className="font-bold text-foreground">Kuis Kilat</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Uji pemahaman dengan kuis singkat yang menyenangkan setelah
                  setiap materi.
                </p>

                {/* Mock quiz result */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-2 mt-2">
                  <div className="flex justify-between text-sm font-semibold text-foreground">
                    <span>Skor Kuis</span>
                    <span>100/100</span>
                  </div>
                  <Progress value={100} className="h-2.5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Tentang ── */}
      <section id="tentang" className="bg-[#f5f5f7] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Dibuat untuk <span className="text-primary">Generasi Alpha</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Kiddo dirancang khusus untuk anak usia 7–12 tahun. Dengan sistem
              gamifikasi XP dan papan peringkat, belajar jadi pengalaman yang
              tidak bisa mereka lewatkan setiap hari.
            </p>
            <Button asChild className="rounded-xl font-semibold" size="lg">
              <Link to="/daftar">Coba Gratis Sekarang</Link>
            </Button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { emoji: '🌍', label: 'Tata Surya', sub: '12 Sub-Materi' },
              { emoji: '🐾', label: 'Dunia Hewan', sub: '10 Sub-Materi' },
              { emoji: '➕', label: 'Matematika', sub: '15 Sub-Materi' },
              { emoji: '📖', label: 'Bahasa', sub: '8 Sub-Materi' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-border p-5 flex flex-col items-center text-center gap-2 hover:shadow-sm transition-shadow"
              >
                <span className="text-4xl">{item.emoji}</span>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingPageLayout>
  )
}

export default Home