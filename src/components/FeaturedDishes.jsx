import { Link } from 'react-router-dom';
import { featuredDishes } from '../data/menu';
import DecorativeBorder from './DecorativeBorder';

function FeaturedDishes() {
  return (
    <section className="py-16 md:py-24 bg-yun-cream">
      <div className="page-container">
        <div className="text-center mb-12">
          <p className="section-subheading mb-2">招牌菜</p>
          <h2 className="section-heading">Chef&apos;s Favourites</h2>
          <DecorativeBorder className="max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <article
              key={dish.name}
              className="group bg-white shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 border-t-2 border-yun-gold">
                <p className="font-serif text-yun-gold text-sm mb-1">{dish.chinese}</p>
                <h3 className="font-display text-xl font-semibold text-yun-charcoal mb-2">{dish.name}</h3>
                <p className="text-yun-ink/70 text-sm leading-relaxed">{dish.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/menu" className="btn-primary">
            Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDishes;
