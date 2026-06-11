function DecorativeBorder({ className = '' }) {
  return (
    <div className={`gold-divider ${className}`}>
      <svg className="w-6 h-6 text-yun-gold shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    </div>
  );
}

export default DecorativeBorder;
