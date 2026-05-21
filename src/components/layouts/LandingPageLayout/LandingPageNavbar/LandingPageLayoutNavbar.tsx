import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'


const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Fitur', href: '/#fitur' },
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Kontak', href: '/#kontak' },
]

const LandingPageLayoutNavbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          {/* <img src={kiddoLogo} alt="Kiddo" className="h-10 w-auto" /> */}
          <h1 className='text-4xl font-bold text-sky-500'>kiddo</h1>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = link.href === '/'
              ? location.pathname === '/' && !location.hash
              : location.hash === '#' + link.href.split('#')[1]
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  isActive
                    ? 'text-sky-600 font-semibold border-b-2 border-sky-500'
                    : 'text-slate-500 hover:text-sky-600 border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="font-medium text-slate-600 hover:text-sky-600">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button size="sm" asChild className="rounded-xl font-semibold px-5 bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
            <Link to="/daftar">Mulai Gratis</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default LandingPageLayoutNavbar