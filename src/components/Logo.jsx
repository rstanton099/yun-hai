function Logo({ variant = 'dark', size = 'nav' }) {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-yun-charcoal';
  const goldColor = isLight ? 'text-yun-gold-light' : 'text-yun-gold';
  const sizeClasses = size === 'nav' ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl';

  return (
    <div className={`flex flex-col items-start leading-none ${sizeClasses}`}>
      <span className={`font-serif font-bold tracking-widest ${goldColor}`}>云海</span>
      <span className={`font-display font-semibold tracking-[0.2em] uppercase ${textColor}`}>
        Yun Hai
      </span>
    </div>
  );
}

export default Logo;
