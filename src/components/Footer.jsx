import { Link } from 'react-router-dom';
import { restaurantInfo } from '../data/menu';
import HoursWidget from './HoursWidget';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="bg-yun-charcoal text-white">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo variant="light" size="nav" />
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              {restaurantInfo.tagline}. Authentic flavours from across China, served with warmth and care.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-yun-gold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/menu" className="hover:text-yun-gold transition-colors">Menu</Link></li>
              <li><Link to="/about" className="hover:text-yun-gold transition-colors">Our Story</Link></li>
              <li><Link to="/gallery" className="hover:text-yun-gold transition-colors">Gallery</Link></li>
              <li><Link to="/reservations" className="hover:text-yun-gold transition-colors">Reservations</Link></li>
              <li><Link to="/order" className="hover:text-yun-gold transition-colors">Order Online</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-yun-gold mb-4">Contact</h4>
            <address className="not-italic text-sm text-white/70 space-y-2">
              <p>{restaurantInfo.address}</p>
              <p>{restaurantInfo.city}</p>
              <p>
                <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="hover:text-yun-gold transition-colors">
                  {restaurantInfo.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${restaurantInfo.email}`} className="hover:text-yun-gold transition-colors">
                  {restaurantInfo.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <HoursWidget />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Yun Hai Chinese Restaurant. All rights reserved.</p>
          <p className="font-serif text-yun-gold/60">云海 · Cloud Sea</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
