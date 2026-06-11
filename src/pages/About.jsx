import PageBanner from '../components/PageBanner';
import DecorativeBorder from '../components/DecorativeBorder';

const milestones = [
  { year: '1998', title: 'Humble Beginnings', description: 'Chef Li Ming opens a small noodle shop on Lantern Lane with just six tables.' },
  { year: '2005', title: 'Yun Hai is Born', description: 'The restaurant expands and adopts the name Yun Hai — inspired by the misty peaks of his hometown in Yunnan.' },
  { year: '2012', title: 'Award Recognition', description: 'Named Best Chinese Restaurant in central London by the Evening Standard.' },
  { year: '2020', title: 'A New Chapter', description: 'Complete refurbishment blending traditional Chinese design with contemporary elegance.' },
];

function About() {
  return (
    <>
      <PageBanner
        title="Our Story"
        chinese="关于我们"
        subtitle="Three decades of passion, family recipes, and the art of Chinese cooking."
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading mb-4">Rooted in Tradition</h2>
              <DecorativeBorder className="max-w-xs" />
              <p className="text-yun-ink/80 leading-relaxed mb-4">
                Yun Hai was founded on a simple belief: that great Chinese food starts with respect —
                for ingredients, for technique, and for the people gathered around the table.
              </p>
              <p className="text-yun-ink/80 leading-relaxed mb-4">
                Head Chef Li Ming trained in Chengdu before bringing the bold flavours of Sichuan
                cuisine to London. Over the years, the menu has grown to celebrate regional specialities
                from Cantonese dim sum to northern-style roasted meats.
              </p>
              <p className="text-yun-ink/80 leading-relaxed">
                Today, Yun Hai remains a family-run restaurant where every dish is cooked to order,
                every guest is treated like family, and every meal is an occasion worth savouring.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
              alt="Chef Li Ming in the kitchen"
              className="w-full shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-yun-cream">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="section-subheading mb-2">历程</p>
            <h2 className="section-heading">Our Journey</h2>
            <DecorativeBorder className="max-w-xs mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-yun-red text-white flex items-center justify-center font-display font-semibold text-sm shrink-0">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-yun-gold/40 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-display text-xl font-semibold text-yun-charcoal mb-1">{milestone.title}</h3>
                  <p className="text-yun-ink/70 text-sm leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-yun-charcoal text-white">
        <div className="page-container text-center max-w-2xl mx-auto">
          <p className="font-serif text-yun-gold text-4xl mb-6">食</p>
          <blockquote className="font-display text-2xl md:text-3xl italic leading-relaxed text-white/90">
            &ldquo;Food is the bridge between cultures. A shared meal speaks every language.&rdquo;
          </blockquote>
          <p className="mt-6 text-yun-gold font-display">— Chef Li Ming</p>
        </div>
      </section>
    </>
  );
}

export default About;
