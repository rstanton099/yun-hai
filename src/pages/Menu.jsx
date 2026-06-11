import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import DecorativeBorder from '../components/DecorativeBorder';
import { menuCategories } from '../data/menu';

function MenuItem({ item }) {
  return (
    <div className="menu-item">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h4 className="font-display text-lg font-semibold text-yun-charcoal">{item.name}</h4>
          <span className="font-serif text-yun-gold text-sm">{item.chinese}</span>
          {item.spicy && (
            <span className="text-xs bg-yun-red/10 text-yun-red px-2 py-0.5 rounded">Spicy</span>
          )}
          {item.vegetarian && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">V</span>
          )}
        </div>
        <p className="text-sm text-yun-ink/60 mt-0.5">{item.description}</p>
      </div>
      <div className="menu-item-dots hidden sm:block" />
      <span className="font-display text-lg text-yun-red font-semibold shrink-0">
        £{item.price.toFixed(2)}
      </span>
    </div>
  );
}

function Menu() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);

  return (
    <>
      <PageBanner
        title="Menu"
        chinese="菜单"
        subtitle="Fresh ingredients, bold flavours, and recipes passed down through generations."
      />

      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-yun-red text-white'
                    : 'bg-white text-yun-ink hover:bg-yun-gold/20 border border-yun-gold/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {menuCategories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className={`mb-16 scroll-mt-28 ${activeCategory !== category.id ? 'hidden' : ''}`}
            >
              <div className="text-center mb-8">
                <p className="font-serif text-yun-gold tracking-widest">{category.chinese}</p>
                <h2 className="section-heading">{category.name}</h2>
                <DecorativeBorder className="max-w-xs mx-auto" />
              </div>
              <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 shadow-md">
                {category.items.map((item) => (
                  <MenuItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 max-w-xl mx-auto bg-white p-8 shadow-md text-center">
            <h3 className="font-display text-2xl font-semibold text-yun-charcoal mb-2">Ready to order?</h3>
            <DecorativeBorder className="max-w-xs mx-auto" />
            <p className="text-yun-ink/70 text-sm mb-6">
              Order online for collection or delivery — no need to call ahead.
            </p>
            <Link to="/order" className="btn-primary">Takeaway / Delivery</Link>
          </div>

          <p className="text-center text-sm text-yun-ink/50 mt-8 max-w-lg mx-auto">
            All prices include VAT. Please inform your server of any allergies or dietary requirements.
            A discretionary 12.5% service charge is added to tables of six or more.
          </p>
        </div>
      </section>
    </>
  );
}

export default Menu;
