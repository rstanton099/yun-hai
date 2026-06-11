import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import { galleryImages } from '../data/menu';

function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <PageBanner
        title="Gallery"
        chinese="相册"
        subtitle="A glimpse into our kitchen, dining rooms, and the dishes we love to serve."
      />

      <section className="py-12 md:py-16 bg-yun-cream">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setSelected(index)}
                className="group relative aspect-[4/3] overflow-hidden focus:outline-none focus:ring-2 focus:ring-yun-gold"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-yun-charcoal/0 group-hover:bg-yun-charcoal/40 transition-colors flex items-end">
                  <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.alt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={galleryImages[selected].src.replace('w=800', 'w=1200')}
            alt={galleryImages[selected].alt}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default Gallery;
