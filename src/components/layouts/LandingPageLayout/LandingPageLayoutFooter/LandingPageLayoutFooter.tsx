import { Link } from 'react-router'

const LandingPageLayoutFooter = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)' }}>
              K
            </div>
            <span className="font-bold text-xl text-white">Kiddo</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Platform belajar interaktif yang menyenangkan untuk anak usia 7–12 tahun. Belajar seru, prestasi nyata!
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[['📸', 'Instagram'], ['▶️', 'YouTube'], ['🐦', 'Twitter']].map(([icon, label]) => (
              <a key={label} href="#" aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-sky-500 transition-colors flex items-center justify-center text-sm">
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">Platform</p>
          {['Beranda', 'Fitur', 'Modul Belajar', 'Tantangan', 'Papan Peringkat'].map(l => (
            <Link key={l} to="#" className="block text-sm text-slate-400 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">Dukungan</p>
          {['Panduan Orang Tua', 'Pusat Bantuan', 'Kebijakan Privasi', 'Keamanan Anak', 'Hubungi Kami'].map(l => (
            <Link key={l} to="#" className="block text-sm text-slate-400 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">Unduh App</p>
          <p className="text-sm text-slate-400">Segera hadir di:</p>
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5 w-fit">
              <span className="text-lg">🍎</span>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Download on</p>
                <p className="text-xs font-bold">App Store</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5 w-fit">
              <span className="text-lg">▶</span>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Get it on</p>
                <p className="text-xs font-bold">Google Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2025 Kiddo Learning Adventure. All rights reserved.</p>
          <p>Dibuat dengan ❤️ untuk generasi masa depan Indonesia</p>
        </div>
      </div>
    </footer>
  )
}

export default LandingPageLayoutFooter