import { Link } from 'react-router'

const footerLinks = ['Privacy Policy', 'Safety Center', 'Parent Guide', 'Contact Support']

const LandingPageLayoutFooter = () => {
  return (
    <footer className="bg-white border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">
            K
          </div>
          <span className="font-bold text-primary">Kiddo</span>
        </Link>

        <div className="flex items-center gap-6">
          {footerLinks.map(link => (
            <Link
              key={link}
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          © 2024 Kiddo Learning Adventure. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default LandingPageLayoutFooter
