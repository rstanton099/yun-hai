import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/contact', label: 'Contact' },
];

function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navBg = scrolled || !isHome
    ? 'bg-yun-cream/95 backdrop-blur-sm shadow-md border-b border-yun-gold/20'
    : 'bg-transparent';

  const linkBase = scrolled || !isHome
    ? 'text-yun-ink/80 hover:text-yun-red'
    : 'text-white/90 hover:text-yun-gold-light';

  const linkActive = scrolled || !isHome
    ? 'text-yun-red font-semibold'
    : 'text-yun-gold-light font-semibold';

  const logoVariant = scrolled || !isHome ? 'dark' : 'light';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="page-container">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90"
            aria-label="Yun Hai — Home"
          >
            <Logo variant={logoVariant} size="nav" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === link.to ? linkActive : linkBase
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className={`lg:hidden p-2 transition-colors ${scrolled || !isHome ? 'text-yun-charcoal' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-16 z-50 bg-yun-cream border-t border-yun-gold/20 shadow-lg">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-yun-red bg-yun-red/5'
                    : 'text-yun-ink hover:bg-yun-gold/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
