import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Fitur', href: '/#fitur' },
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Kontak', href: '/#kontak' },
]

const sectionIds = ['fitur', 'tentang', 'kontak']

const LandingPageLayoutNavbar = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('')

  // Scroll spy — track which section is at the top of the viewport
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveHash('')
      return
    }

    const updateActive = () => {
      if (window.scrollY < 80) {
        setActiveHash('')
        return
      }
      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id
        }
      }
      setActiveHash(current)
    }

    window.addEventListener('scroll', updateActive, { passive: true })
    updateActive()
    return () => window.removeEventListener('scroll', updateActive)
  }, [location.pathname])

  // Close mobile menu when viewport reaches desktop width
  useEffect(() => {
    const close = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') return
    e.preventDefault()
    const hash = href.split('#')[1]
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isActive = (href: string) => {
    if (location.pathname !== '/') return false
    if (href === '/') return activeHash === ''
    return activeHash === (href.split('#')[1] ?? '')
  }

  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <h1 className="text-4xl font-bold text-sky-500">kiddo</h1>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors pb-0.5 border-b-2 ${
                isActive(link.href)
                  ? 'text-sky-600 font-semibold border-sky-500'
                  : 'text-slate-500 hover:text-sky-600 border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons + hamburger */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="font-medium text-slate-600 hover:text-sky-600">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:inline-flex rounded-xl font-semibold px-5 bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
            <Link to="/daftar">Mulai Gratis</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-sky-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-50 text-sky-600 font-semibold'
                        : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.2 }}
                className="pt-2 mt-1 border-t border-slate-100"
              >
                <Button size="sm" asChild className="w-full rounded-xl font-semibold bg-sky-500 hover:bg-sky-600 text-white mt-2">
                  <Link to="/daftar" onClick={() => setMenuOpen(false)}>Mulai Gratis</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default LandingPageLayoutNavbar
