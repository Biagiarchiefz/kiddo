import { Link } from "react-router";
import { FaFacebookSquare, FaInstagram, FaYoutube } from "react-icons/fa";

const Cloud = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 280 110"
    fill="white"
    className={className}
  >
    <ellipse cx="140" cy="82" rx="118" ry="28" />
    <ellipse cx="90"  cy="64" rx="52"  ry="40" />
    <ellipse cx="148" cy="52" rx="64"  ry="46" />
    <ellipse cx="205" cy="66" rx="44"  ry="32" />
  </svg>
);

const LandingPageLayoutFooter = () => {
  return (
    <footer className="relative overflow-hidden bg-sky-500 text-white">
      {/* Cloud layer */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Cloud className="absolute -top-6 -left-10 w-72 opacity-[0.12]" />
        <Cloud className="absolute top-0 right-20 w-52 opacity-[0.09]" />
        <Cloud className="absolute top-16 left-[38%] w-40 opacity-[0.07]" />
        <Cloud className="absolute bottom-10 -right-6 w-80 opacity-[0.11]" />
        <Cloud className="absolute bottom-6 left-[20%] w-56 opacity-[0.08]" />
        <Cloud className="absolute -bottom-4 left-[60%] w-44 opacity-[0.10]" />
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-bold text-4xl text-white">kiddo</h1>
          </Link>
          <p className="text-sm text-white/75 leading-relaxed max-w-xs">
            Platform belajar interaktif yang menyenangkan untuk anak usia 7–12
            tahun. Belajar seru, prestasi nyata!
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[
              { label: "Facebook", href: "#", Icon: FaFacebookSquare },
              { label: "Instagram", href: "#", Icon: FaInstagram },
              { label: "YouTube", href: "#", Icon: FaYoutube },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-base"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-white">
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
              className="block text-sm text-white/75 hover:text-white transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-white">
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
              className="block text-sm text-white/75 hover:text-white transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="font-bold text-sm uppercase tracking-wider text-white">
            Unduh App
          </p>
          <p className="text-sm text-white/75">Segera hadir di:</p>
          <div className="space-y-2 pt-1">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on App Store"
              className="h-11 w-auto ml-2"
            />
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="h-15 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© 2025 Kiddo Learning Adventure. All rights reserved.</p>
          <p>Dibuat dengan untuk generasi masa depan Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageLayoutFooter;