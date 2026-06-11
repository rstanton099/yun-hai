import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedDishes from '../components/FeaturedDishes';
import DecorativeBorder from '../components/DecorativeBorder';
import HoursWidget from '../components/HoursWidget';
import { restaurantInfo } from '../data/menu';

function Home() {
  return (
    <>
      <Hero />

      <section className="py-16 md:py-24 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subheading mb-2">欢迎</p>
              <h2 className="section-heading mb-4">Welcome to Yun Hai</h2>
              <DecorativeBorder className="max-w-xs" />
              <p className="text-yun-ink/80 leading-relaxed mb-4">
                Named after the sea of clouds that drifts above China&apos;s mountain peaks, Yun Hai brings
                together recipes from Sichuan, Cantonese, and northern traditions — each dish prepared
                with fresh ingredients and time-honoured techniques.
              </p>
              <p className="text-yun-ink/80 leading-relaxed mb-8">
                Whether you&apos;re joining us for a celebratory banquet, a quick lunch, or ordering
                takeaway to enjoy at home, we invite you to experience the warmth of Chinese hospitality.
              </p>
              <Link to="/about" className="btn-outline">
                Our Story
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
                alt="Chef preparing dishes in the kitchen"
                className="w-full shadow-xl"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-4 border-yun-gold hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      <FeaturedDishes />

      <section className="py-16 md:py-24 bg-yun-cream bg-cloud-pattern">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="section-subheading mb-2">联系我们</p>
              <h2 className="section-heading mb-4">Visit Us</h2>
              <DecorativeBorder className="max-w-xs" />
              <address className="not-italic text-yun-ink/80 space-y-2 mb-6">
                <p className="font-medium text-yun-charcoal">{restaurantInfo.address}</p>
                <p>{restaurantInfo.city}</p>
                <p>
                  <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="text-yun-red hover:underline">
                    {restaurantInfo.phone}
                  </a>
                </p>
              </address>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/reservations" className="btn-primary">Reserve a Table</Link>
                <Link to="/contact" className="btn-outline">Get Directions</Link>
              </div>
            </div>
            <HoursWidget />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
