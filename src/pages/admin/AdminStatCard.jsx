function AdminStatCard({ label, value, accent = 'charcoal' }) {
  const styles = {
    charcoal: { value: 'text-yun-charcoal', border: 'border-yun-charcoal' },
    red: { value: 'text-yun-red', border: 'border-yun-red' },
    gold: { value: 'text-yun-gold-dark', border: 'border-yun-gold' },
  };

  const style = styles[accent] || styles.charcoal;

  return (
    <div className={`admin-card p-6 border-l-4 ${style.border}`}>
      <p className="admin-stat-label">{label}</p>
      <p className={`admin-stat-value ${style.value}`}>{value}</p>
    </div>
  );
}

export default AdminStatCard;
