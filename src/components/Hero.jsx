import { Link } from 'react-router-dom';
import DecorativeBorder from './DecorativeBorder';
import { restaurantInfo } from '../data/menu';

const heroActions = [
  { to: '/menu', label: 'View Menu' },
  { to: '/reservations', label: 'Book a Table' },
  { to: '/takeaway', label: 'Order Takeaway' },
  { to: '/delivery', label: 'Delivery' },
];

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-yun-charcoal/80 via-yun-red-dark/70 to-yun-charcoal/90" />

      <div className="absolute inset-0 bg-cloud-pattern opacity-30" />

      <div className="relative z-10 page-container text-center text-white py-32">
        <p className="font-serif text-yun-gold-light text-lg md:text-xl tracking-[0.3em] mb-4 animate-fade-in">
          {restaurantInfo.chineseName}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-4 animate-fade-in-up">
          Yun Hai
        </h1>
        <DecorativeBorder className="max-w-xs mx-auto" />
        <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-12 font-light animate-fade-in-up">
          {restaurantInfo.tagline}
        </p>

        <div className="animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 gap-4 w-fit mx-auto">
          {heroActions.map((action) => (
            <Link key={action.to} to={action.to} className="hero-cta">
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-yun-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;
