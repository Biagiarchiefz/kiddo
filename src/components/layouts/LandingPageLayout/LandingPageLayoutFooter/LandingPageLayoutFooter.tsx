import { Link } from "react-router";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

const LandingPageLayoutFooter = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-bold text-4xl text-sky-500">kiddo</h1>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Platform belajar interaktif yang menyenangkan untuk anak usia 7–12
            tahun. Belajar seru, prestasi nyata!
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[
              {
                label: "Facebook",
                href: "#",
                Icon: FaFacebookSquare,
              },
              {
                label: "Instagram",
                href: "#",
                Icon: FaInstagram,
              },
              {
                label: "YouTube",
                href: "#",
                Icon: FaYoutube,
              },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-sky-500 transition-colors flex items-center justify-center text-base"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">
            Platform
          </p>
          {[
            "Beranda",
            "Fitur",
            "Modul Belajar",
            "Tantangan",
            "Papan Peringkat",
          ].map((l) => (
            <Link
              key={l}
              to="#"
              className="block text-sm text-slate-400 hover:text-white transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">
            Dukungan
          </p>
          {[
            "Panduan Orang Tua",
            "Pusat Bantuan",
            "Kebijakan Privasi",
            "Keamanan Anak",
            "Hubungi Kami",
          ].map((l) => (
            <Link
              key={l}
              to="#"
              className="block text-sm text-slate-400 hover:text-white transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-sky-400">
            Unduh App
          </p>
          <p className="text-sm text-slate-400">Segera hadir di:</p>
          <div className="space-y-2 pt-1">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on App Store"
              className="h-11 w-auto ml-2"
            />

            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="h-15 w-auto "
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2025 Kiddo Learning Adventure. All rights reserved.</p>
          <p>Dibuat dengan untuk generasi masa depan Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageLayoutFooter;
