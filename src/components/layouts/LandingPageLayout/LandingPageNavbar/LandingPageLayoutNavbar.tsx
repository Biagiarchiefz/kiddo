import { Link, useLocation } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Fitur', href: '/#fitur' },
]

const LandingPageLayoutNavbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-primary">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bold text-lg">Kiddo</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
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
                    ? 'text-foreground font-semibold border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="font-medium">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="rounded-lg font-semibold bg-foreground hover:bg-foreground/90 text-background"
          >
            <Link to="/daftar">Daftar</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default LandingPageLayoutNavbar