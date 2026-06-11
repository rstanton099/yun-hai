import DecorativeBorder from './DecorativeBorder';

function PageBanner({ title, subtitle, chinese }) {
  return (
    <section className="relative bg-lantern-gradient pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="absolute inset-0 bg-cloud-pattern opacity-20" />
      <div className="relative page-container text-center text-white">
        {chinese && (
          <p className="font-serif text-yun-gold-light text-lg tracking-[0.3em] mb-2">{chinese}</p>
        )}
        <h1 className="font-display text-4xl md:text-5xl font-semibold">{title}</h1>
        {subtitle && (
          <>
            <DecorativeBorder className="max-w-xs mx-auto my-4" />
            <p className="text-white/80 max-w-lg mx-auto">{subtitle}</p>
          </>
        )}
      </div>
    </section>
  );
}

export default PageBanner;
